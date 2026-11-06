"use client";

// Bọc cảnh 3D: nạp three.js khi cần, hiện ảnh dựng 2D trong lúc tải hoặc khi máy không hỗ trợ WebGL.
import dynamic from "next/dynamic";
import { forwardRef, useState } from "react";
import type { Customization, Shape } from "@/shared/types/product.types";
import BottleRender from "./BottleRender";
import type { BottleSceneHandle } from "./BottleScene";

export type { BottleSceneHandle };

const Scene = dynamic(() => import("./BottleScene"), { ssr: false });

type Props = { shape: Shape; hex: string; lid?: string; size: string; custom?: Customization; showcase?: boolean; label?: string };

const Bottle3D = forwardRef<BottleSceneHandle, Props>(function Bottle3D({ label, ...props }, ref) {
  const [failed, setFailed] = useState(false);
  if (failed) return <BottleRender {...props} label={label} />;
  return (
    <div role="img" aria-label={label ?? "Mô hình 3D bình Hydron, kéo để xoay"} style={{ position: "absolute", inset: 0 }}>
      <Scene ref={ref} {...props} onFail={() => setFailed(true)} />
    </div>
  );
});

export default Bottle3D;
