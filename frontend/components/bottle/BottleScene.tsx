"use client";

// Cảnh 3D của bình Hydron (three.js). Thân bình dựng bằng LatheGeometry, phần in tên/sticker là một
// lớp trụ trong suốt quấn quanh thân với CanvasTexture. Nạp động (next/dynamic, ssr: false).
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { Customization, Shape } from "@/shared/types/product.types";
import { luminance, mix } from "./color";
import { STICKER_ART } from "./stickers";

export type BottleSceneHandle = { snapshot: () => string | null; front: () => void };

type Props = {
  shape: Shape;
  hex: string;
  lid?: string;
  size: string;
  custom?: Customization;
  /** Trang chủ: tự xoay chậm, không zoom */
  showcase?: boolean;
  onFail?: () => void;
};

// Kích thước (đơn vị cảnh) theo dung tích
const DIMS: Record<string, { h: number; r: number }> = {
  "500": { h: 2.2, r: 0.37 },
  "700": { h: 2.48, r: 0.4 },
  "900": { h: 2.74, r: 0.445 },
};

const FONT_VAR: Record<string, { v: string; w: number; f: string }> = {
  block: { v: "--font-display-face", w: 700, f: "sans-serif" },
  round: { v: "--font-body-face", w: 800, f: "sans-serif" },
  script: { v: "--font-script-face", w: 700, f: "cursive" },
};

function fontFamily(id: string) {
  const spec = FONT_VAR[id] ?? FONT_VAR.block;
  const fam = getComputedStyle(document.documentElement).getPropertyValue(spec.v).trim();
  return { css: `${spec.w} %spx ${fam || spec.f}`, fam: fam || spec.f, w: spec.w };
}

function bodyProfile(h: number, r: number) {
  const pts: THREE.Vector2[] = [];
  const rb = 0.07; // bo đáy
  pts.push(new THREE.Vector2(0, 0));
  pts.push(new THREE.Vector2(r - rb, 0));
  for (let i = 1; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    pts.push(new THREE.Vector2(r - rb + Math.sin(a) * rb, rb - Math.cos(a) * rb));
  }
  const shoulder = h * 0.8;
  pts.push(new THREE.Vector2(r, shoulder));
  const neckR = r * 0.74;
  const neckY = h * 0.865;
  for (let i = 1; i <= 10; i++) {
    const t = i / 10;
    const e = 1 - Math.pow(1 - t, 2);
    pts.push(new THREE.Vector2(r + (neckR - r) * e, shoulder + (neckY - shoulder) * t));
  }
  pts.push(new THREE.Vector2(neckR * 0.98, neckY + 0.002));
  pts.push(new THREE.Vector2(0, neckY + 0.002));
  return { pts, neckR, neckY };
}

function roundedCap(radius: number, height: number, dome = 0.25) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, 0), new THREE.Vector2(radius, 0)];
  const flat = height * (1 - dome);
  pts.push(new THREE.Vector2(radius, flat));
  for (let i = 1; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius * Math.cos(a) * 0.92 + radius * 0.08 * (1 - i / 8), flat + Math.sin(a) * height * dome));
  }
  pts.push(new THREE.Vector2(0, height));
  return new THREE.LatheGeometry(pts, 72);
}

const shadowTexture = (() => {
  let tex: THREE.CanvasTexture | null = null;
  return () => {
    if (tex) return tex;
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(11,42,54,0.42)");
    grd.addColorStop(0.5, "rgba(11,42,54,0.14)");
    grd.addColorStop(1, "rgba(11,42,54,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    tex = new THREE.CanvasTexture(c);
    return tex;
  };
})();

const BottleScene = forwardRef<BottleSceneHandle, Props>(function BottleScene({ shape, hex, lid, size, custom, showcase, onFail }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    group: THREE.Group;
    bodyMat: THREE.MeshPhysicalMaterial;
    capMat: THREE.MeshPhysicalMaterial;
    print?: { mesh: THREE.Mesh; canvas: HTMLCanvasElement; tex: THREE.CanvasTexture };
    dims: { h: number; r: number };
    targetColor: THREE.Color;
    targetCap: THREE.Color;
    frontTween?: { from: number; start: number };
    render: () => void;
  } | null>(null);

  useImperativeHandle(ref, () => ({
    snapshot: () => {
      const a = api.current;
      if (!a) return null;
      a.render();
      return a.renderer.domElement.toDataURL("image/png");
    },
    front: () => {
      const a = api.current;
      if (!a) return;
      a.frontTween = { from: a.controls.getAzimuthalAngle(), start: performance.now() };
    },
  }));

  // Khởi tạo một lần
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    } catch {
      onFail?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.35, showcase ? 6.6 : 7.2);

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 5, 4);
    scene.add(key);
    scene.add(new THREE.HemisphereLight(0xfff6e8, 0x9fb7bf, 0.6));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = !showcase;
    controls.minDistance = 4.2;
    controls.maxDistance = 9;
    controls.minPolarAngle = Math.PI * 0.32;
    controls.maxPolarAngle = Math.PI * 0.6;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotate = !!showcase && !reduce;
    controls.autoRotateSpeed = 1.6;
    controls.addEventListener("start", () => (controls.autoRotate = false));

    const group = new THREE.Group();
    scene.add(group);


    const bodyMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex), roughness: 0.52, metalness: 0.12, clearcoat: 0.35, clearcoatRoughness: 0.45 });
    const capMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex), roughness: 0.42, metalness: 0.05, clearcoat: 0.2 });

    const render = () => renderer.render(scene, camera);
    api.current = { renderer, scene, camera, controls, group, bodyMat, capMat, dims: DIMS["700"], targetColor: new THREE.Color(hex), targetCap: new THREE.Color(hex), render };

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const a = api.current!;
      a.bodyMat.color.lerp(a.targetColor, 0.14);
      a.capMat.color.lerp(a.targetCap, 0.14);
      if (a.frontTween) {
        const t = Math.min(1, (performance.now() - a.frontTween.start) / 600);
        const e = 1 - Math.pow(1 - t, 3);
        const az = a.frontTween.from * (1 - e);
        const dist = camera.position.distanceTo(controls.target);
        const polar = controls.getPolarAngle();
        camera.position.set(controls.target.x + dist * Math.sin(polar) * Math.sin(az), controls.target.y + dist * Math.cos(polar), controls.target.z + dist * Math.sin(polar) * Math.cos(az));
        camera.lookAt(controls.target);
        if (t >= 1) a.frontTween = undefined;
      }
      controls.update();
      render();
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
      });
      bodyMat.dispose();
      capMat.dispose();
      api.current?.print?.tex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      el.removeChild(renderer.domElement);
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcase]);

  // Dựng lại hình khi đổi kiểu dáng / dung tích
  useEffect(() => {
    const a = api.current;
    if (!a) return;
    const { group, bodyMat, capMat } = a;
    group.children.slice().forEach((c) => {
      group.remove(c);
      c.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
    });
    const dims = DIMS[size] ?? DIMS["700"];
    a.dims = dims;
    const { h, r } = dims;
    const { pts, neckR, neckY } = bodyProfile(h, r);
    group.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 128), bodyMat));
    // Bóng đổ mềm dưới đáy, đi cùng bình (đáy bình nằm ở y = 0 trong group)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(r * 5, r * 5), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.002;
    group.add(floor);

    const steel = new THREE.MeshStandardMaterial({ color: 0xd3d9db, metalness: 1, roughness: 0.22 });
    const ringH = h * 0.03;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(neckR * 0.99, neckR * 0.99, ringH, 72), steel);
    ring.position.y = neckY + ringH / 2;
    group.add(ring);

    const capR = neckR * 1.04;
    const capY = neckY + ringH;
    const handleMat = new THREE.MeshPhysicalMaterial({ color: 0x2a3033, roughness: 0.6 });
    if (shape === "sport") {
      const capH = h * 0.12;
      const cap = new THREE.Mesh(roundedCap(capR, capH, 0.3), capMat);
      cap.position.y = capY;
      group.add(cap);
      const spout = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.16, 6, 16), handleMat);
      spout.position.set(0, capY + capH + 0.08, 0.02);
      spout.rotation.x = -0.15;
      group.add(spout);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(capH * 0.48, 0.035, 12, 32, Math.PI), handleMat);
      handle.position.set(capR - 0.02, capY + capH * 0.5, 0);
      handle.rotation.z = -Math.PI / 2;
      group.add(handle);
    } else if (shape === "flip") {
      const capH = h * 0.11;
      const cap = new THREE.Mesh(roundedCap(capR, capH, 0.55), capMat);
      cap.position.y = capY;
      group.add(cap);
      const btn = new THREE.Mesh(new THREE.BoxGeometry(0.16, capH * 0.32, 0.05), steel);
      btn.position.set(0, capY + capH * 0.42, capR - 0.005);
      group.add(btn);
      const seam = new THREE.Mesh(new THREE.TorusGeometry(capR * 1.002, 0.006, 6, 72), handleMat);
      seam.rotation.x = Math.PI / 2;
      seam.position.y = capY + capH * 0.48;
      group.add(seam);
    } else {
      const capH = h * 0.1;
      const cap = new THREE.Mesh(roundedCap(capR, capH, 0.18), capMat);
      cap.position.y = capY;
      group.add(cap);
      const loop = new THREE.Mesh(new THREE.TorusGeometry(capR * 0.62, 0.05, 16, 48, Math.PI), handleMat);
      loop.position.y = capY + capH * 0.86;
      group.add(loop);
    }

    // Lớp in quanh thân: phủ đoạn thẳng của thân bình
    const bandBottom = h * 0.12;
    const bandTop = h * 0.74;
    const bandH = bandTop - bandBottom;
    const circ = 2 * Math.PI * r;
    const cw = 2048;
    const ch = Math.round((cw * bandH) / circ);
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = a.renderer.capabilities.getMaxAnisotropy();
    const printMat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.55, metalness: 0.05, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.003, r * 1.003, bandH, 160, 1, true, -Math.PI, Math.PI * 2), printMat);
    mesh.position.y = bandBottom + bandH / 2;
    group.add(mesh);
    a.print?.tex.dispose();
    a.print = { mesh, canvas, tex };

    group.position.y = -h * 0.5;
    a.controls.target.set(0, 0.02, 0);
    a.controls.update();
    drawPrint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, size]);

  // Đổi màu: chuyển mượt
  useEffect(() => {
    const a = api.current;
    if (!a) return;
    a.targetColor = new THREE.Color(hex);
    const light = luminance(hex) > 0.55;
    a.targetCap = new THREE.Color(lid ?? (shape === "sport" && light ? "#F6F4EF" : mix(hex, "#000000", light ? 0.08 : 0.18)));
  }, [hex, lid, shape]);

  // Vẽ lại phần in
  function drawPrint() {
    const a = api.current;
    if (!a?.print) return;
    const { canvas, tex } = a.print;
    const g = canvas.getContext("2d")!;
    g.clearRect(0, 0, canvas.width, canvas.height);
    const c = custom;
    if (c && (c.text || c.sticker)) {
      const cx = canvas.width / 2;
      const H = canvas.height;
      const maxW = canvas.width * 0.24;
      const both = !!c.text && !!c.sticker;
      const art = c.sticker ? STICKER_ART[c.sticker] : undefined;
      if (art) {
        const s = Math.min(H * (both ? 0.3 : 0.42), maxW * 0.7);
        const y = both ? H * 0.3 - s / 2 : H / 2 - s / 2;
        g.save();
        g.translate(cx - s / 2, y);
        g.scale(s / 24, s / 24);
        const p = new Path2D(art.d);
        if (art.mode === "fill") {
          g.fillStyle = c.ink;
          g.fill(p, "evenodd");
        } else {
          g.strokeStyle = c.ink;
          g.lineWidth = 2;
          g.lineCap = "round";
          g.lineJoin = "round";
          g.stroke(p);
        }
        g.restore();
      }
      if (c.text) {
        const f = fontFamily(c.font);
        let px = Math.min(H * (both ? 0.2 : 0.26), 220);
        g.font = f.css.replace("%s", String(px));
        const w = g.measureText(c.text).width;
        if (w > maxW) px = Math.floor((px * maxW) / w);
        g.font = f.css.replace("%s", String(px));
        g.fillStyle = c.ink;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(c.text, cx, both ? H * 0.68 : H / 2);
      }
    }
    tex.needsUpdate = true;
  }

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (custom?.text) {
        const f = fontFamily(custom.font);
        try {
          await document.fonts.load(`${f.w} 64px ${f.fam}`, custom.text);
        } catch {
          /* dùng font dự phòng */
        }
      }
      if (alive) drawPrint();
    };
    run();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [custom?.text, custom?.font, custom?.ink, custom?.sticker, shape, size]);

  return <div ref={host} style={{ position: "absolute", inset: 0 }} />;
});

export default BottleScene;
