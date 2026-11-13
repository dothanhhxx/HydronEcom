// Client-side AI Sticker Engine & Stylizer
// Biến ảnh chụp thông thường (thú cưng, logo, hình vẽ, chân dung) thành Sticker Die-Cut chuẩn 3D.

export type StickerStyleId =
  | "cute"
  | "bold"
  | "minimal"
  | "cartoon"
  | "anime"
  | "pixel"
  | "graffiti"
  | "sport"
  | "vintage"
  | "3d";

export type StickerStyleOption = {
  id: StickerStyleId;
  name: string;
  desc: string;
  tag: string;
  borderWidth: number;
  borderColor: string;
};

export const STICKER_STYLES: StickerStyleOption[] = [
  {
    id: "cute",
    name: "Cute Dễ thương",
    desc: "Màu pastel ngọt ngào, viền trắng dày tròn trịa",
    tag: "🌸 Pastel",
    borderWidth: 14,
    borderColor: "#FFFFFF",
  },
  {
    id: "bold",
    name: "Bold Nổi bật",
    desc: "Màu rực rỡ, viền đen kép kết hợp trắng tương phản",
    tag: "⚡ Nổi bật",
    borderWidth: 16,
    borderColor: "#FFFFFF",
  },
  {
    id: "minimal",
    name: "Minimal Tối giản",
    desc: "Đơn sắc tinh tế, đường nét thanh lịch sang trọng",
    tag: "✨ Tối giản",
    borderWidth: 10,
    borderColor: "#FFFFFF",
  },
  {
    id: "cartoon",
    name: "Cartoon Hoạt hình",
    desc: "Phong cách truyện tranh hoạt hình sống động",
    tag: "🎨 Comic",
    borderWidth: 14,
    borderColor: "#FFFFFF",
  },
  {
    id: "anime",
    name: "Anime Nhật Bản",
    desc: "Tone màu tươi sáng, mắt trong và ánh sáng mềm",
    tag: "✨ Anime",
    borderWidth: 12,
    borderColor: "#FFFFFF",
  },
  {
    id: "pixel",
    name: "Pixel 8-Bit",
    desc: "Đồ họa điểm ảnh retro phong cách game cổ điển",
    tag: "👾 8-Bit",
    borderWidth: 10,
    borderColor: "#FFFFFF",
  },
  {
    id: "graffiti",
    name: "Graffiti Đường phố",
    desc: "Phong cách xịt sơn street art ngầu và bụi bặm",
    tag: "🔥 Street",
    borderWidth: 14,
    borderColor: "#FFE600",
  },
  {
    id: "sport",
    name: "Sport Thể thao",
    desc: "Đậm chất huy hiệu câu lạc bộ thể thao năng động",
    tag: "🏆 Thể thao",
    borderWidth: 14,
    borderColor: "#FFFFFF",
  },
  {
    id: "vintage",
    name: "Vintage Cổ điển",
    desc: "Màu ấm sepia film cổ điển, hơi nhuốm màu thời gian",
    tag: "🎞️ Retro",
    borderWidth: 12,
    borderColor: "#F7F2E7",
  },
  {
    id: "3d",
    name: "3D Phồng nổi",
    desc: "Hiệu ứng sticker nổi bóng bẩy có độ dày và bóng đổ",
    tag: "💎 3D Puffy",
    borderWidth: 16,
    borderColor: "#FFFFFF",
  },
];

/** Tách nền thông minh: nhận diện màu nền góc ảnh và làm trong suốt phần nền tương đồng */
function removeBackgroundAndIsolate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tolerance = 38
) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Lấy mẫu màu ở 4 góc để xác định màu background
  const samplePixels = [
    0, // top-left
    (w - 1) * 4, // top-right
    (h - 1) * w * 4, // bottom-left
    ((h - 1) * w + (w - 1)) * 4, // bottom-right
    Math.floor(w / 2) * 4, // top-mid
  ];

  let bgR = 0,
    bgG = 0,
    bgB = 0,
    count = 0;
  for (const idx of samplePixels) {
    if (data[idx + 3] > 200) {
      bgR += data[idx];
      bgG += data[idx + 1];
      bgB += data[idx + 2];
      count++;
    }
  }

  // Nếu không có màu nền rõ (ảnh đã có PNG transparent), giữ nguyên alpha
  if (count > 0) {
    bgR = Math.round(bgR / count);
    bgG = Math.round(bgG / count);
    bgB = Math.round(bgB / count);

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 20) continue; // đã trong suốt
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const diff = Math.sqrt(
        (r - bgR) ** 2 * 0.299 +
          (g - bgG) ** 2 * 0.587 +
          (b - bgB) ** 2 * 0.114
      );

      // Nếu pixel rất gần màu background thì làm mờ hoặc trong suốt
      if (diff < tolerance) {
        data[i + 3] = 0;
      } else if (diff < tolerance + 18) {
        data[i + 3] = Math.round(((diff - tolerance) / 18) * 255);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

/** Áp dụng bộ lọc nghệ thuật theo phong cách */
function applyStyleFilter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  style: StickerStyleId
) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 10) continue;

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    switch (style) {
      case "cute": {
        // Tăng sáng và tăng hồng nhẹ (pastel)
        r = Math.min(255, Math.round(r * 1.12 + 18));
        g = Math.min(255, Math.round(g * 1.05 + 10));
        b = Math.min(255, Math.round(b * 1.08 + 16));
        break;
      }
      case "bold": {
        // Tăng độ bão hòa và độ tương phản
        const avg = (r + g + b) / 3;
        r = Math.min(255, Math.max(0, Math.round(avg + (r - avg) * 1.45)));
        g = Math.min(255, Math.max(0, Math.round(avg + (g - avg) * 1.45)));
        b = Math.min(255, Math.max(0, Math.round(avg + (b - avg) * 1.45)));
        break;
      }
      case "minimal": {
        // Chuyển sang duo-tone đơn sắc sạch sẽ
        const lum = r * 0.299 + g * 0.587 + b * 0.114;
        if (lum > 150) {
          r = 245;
          g = 245;
          b = 245;
        } else {
          r = 18;
          g = 35;
          b = 45;
        }
        break;
      }
      case "cartoon": {
        // Posterize các dải màu (comic tone)
        const step = 48;
        r = Math.round(r / step) * step;
        g = Math.round(g / step) * step;
        b = Math.round(b / step) * step;
        break;
      }
      case "anime": {
        // Sáng hơn, hơi ngả cyan/magenta
        r = Math.min(255, Math.round(r * 1.08 + 12));
        g = Math.min(255, Math.round(g * 1.05 + 8));
        b = Math.min(255, Math.round(b * 1.15 + 20));
        break;
      }
      case "pixel": {
        // Màu sắc giảm còn 8 mức retro
        r = Math.round(r / 36) * 36;
        g = Math.round(g / 36) * 36;
        b = Math.round(b / 36) * 36;
        break;
      }
      case "graffiti": {
        // Tăng tương phản cao, ngả màu vàng/đen đường phố
        const lum = r * 0.299 + g * 0.587 + b * 0.114;
        if (lum > 140) {
          r = 255;
          g = 230;
          b = 0;
        } else {
          r = Math.max(15, r * 0.6);
          g = Math.max(15, g * 0.6);
          b = Math.max(15, b * 0.6);
        }
        break;
      }
      case "sport": {
        // Đậm nét, tăng xanh thể thao và độ sắc nét
        r = Math.min(255, Math.round(r * 0.95));
        g = Math.min(255, Math.round(g * 1.1 + 8));
        b = Math.min(255, Math.round(b * 1.25 + 15));
        break;
      }
      case "vintage": {
        // Lọc màu sepia cổ điển
        const tr = r * 0.393 + g * 0.769 + b * 0.189;
        const tg = r * 0.349 + g * 0.686 + b * 0.168;
        const tb = r * 0.272 + g * 0.534 + b * 0.131;
        r = Math.min(255, Math.round(tr));
        g = Math.min(255, Math.round(tg));
        b = Math.min(255, Math.round(tb));
        break;
      }
      case "3d": {
        // Giữ màu gốc, hiệu ứng 3D được tạo bởi viền và ánh sáng bóng
        break;
      }
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(imgData, 0, 0);

  // Hiệu ứng Pixelate thực sự nếu chọn style Pixel
  if (style === "pixel") {
    const scale = 0.16; // thu nhỏ rồi phóng to không làm mượt (nearest-neighbor)
    const smallW = Math.max(1, Math.floor(w * scale));
    const smallH = Math.max(1, Math.floor(h * scale));

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = smallW;
    tempCanvas.height = smallH;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(ctx.canvas, 0, 0, smallW, smallH);

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
  }
}

/**
 * Tạo viền sticker die-cut xung quanh chủ thể.
 * Quét alpha mask, tạo lớp outline viền trắng dày bo tròn, thêm bóng đổ và chi tiết nổi 3D.
 */
function createDieCutStickerBorder(
  subjectCanvas: HTMLCanvasElement,
  styleOpt: StickerStyleOption
): HTMLCanvasElement {
  const pad = Math.round(styleOpt.borderWidth * 2.2);
  const outW = subjectCanvas.width + pad * 2;
  const outH = subjectCanvas.height + pad * 2;

  const outCanvas = document.createElement("canvas");
  outCanvas.width = outW;
  outCanvas.height = outH;
  const outCtx = outCanvas.getContext("2d")!;

  // 1. Tạo mặt nạ hình dạng (Alpha silhouette)
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = outW;
  maskCanvas.height = outH;
  const maskCtx = maskCanvas.getContext("2d")!;

  // Vẽ chủ thể vào giữa
  maskCtx.drawImage(subjectCanvas, pad, pad);
  const imgData = maskCtx.getImageData(0, 0, outW, outH);
  const data = imgData.data;

  // Biến mọi pixel không trong suốt thành màu đặc của viền
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 20) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    } else {
      data[i + 3] = 0;
    }
  }
  maskCtx.putImageData(imgData, 0, 0);

  // 2. Giãn nở mặt nạ tạo viền dày tròn (Radial dilation)
  const radius = styleOpt.borderWidth;
  const steps = 18;
  const borderCanvas = document.createElement("canvas");
  borderCanvas.width = outW;
  borderCanvas.height = outH;
  const borderCtx = borderCanvas.getContext("2d")!;

  for (let s = 1; s <= radius; s += 2) {
    for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / steps) {
      const ox = Math.round(Math.cos(a) * s);
      const oy = Math.round(Math.sin(a) * s);
      borderCtx.drawImage(maskCanvas, ox, oy);
    }
  }
  borderCtx.drawImage(maskCanvas, 0, 0);

  // Tô màu viền đã cấu hình (mặc định trắng #fff hoặc vàng graffiti)
  borderCtx.globalCompositeOperation = "source-in";
  borderCtx.fillStyle = styleOpt.borderColor;
  borderCtx.fillRect(0, 0, outW, outH);
  borderCtx.globalCompositeOperation = "source-over";

  // 3. Bóng đổ vinyl sticker mềm mại bên dưới
  outCtx.save();
  outCtx.shadowColor = "rgba(11, 42, 54, 0.28)";
  outCtx.shadowBlur = styleOpt.id === "3d" ? 18 : 10;
  outCtx.shadowOffsetY = styleOpt.id === "3d" ? 8 : 4;
  outCtx.drawImage(borderCanvas, 0, 0);
  outCtx.restore();

  // Vẽ lại lớp viền chính thức
  outCtx.drawImage(borderCanvas, 0, 0);

  // Nếu là style Bold: thêm 1 đường viền phụ mỏng màu đen
  if (styleOpt.id === "bold") {
    outCtx.save();
    outCtx.shadowColor = "rgba(0,0,0,0.4)";
    outCtx.shadowBlur = 4;
    outCtx.drawImage(subjectCanvas, pad, pad);
    outCtx.restore();
  }

  // 4. Vẽ chủ thể đã lọc màu lên trên viền sticker
  outCtx.drawImage(subjectCanvas, pad, pad);

  // 5. Nếu là style 3D Phồng nổi: phủ một lớp bóng lóa (specular highlight gradient)
  if (styleOpt.id === "3d") {
    outCtx.save();
    outCtx.globalCompositeOperation = "source-atop";
    const glossGrad = outCtx.createLinearGradient(0, 0, outW * 0.8, outH * 0.8);
    glossGrad.addColorStop(0, "rgba(255, 255, 255, 0.42)");
    glossGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.12)");
    glossGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    glossGrad.addColorStop(1, "rgba(0, 0, 0, 0.15)");
    outCtx.fillStyle = glossGrad;
    outCtx.fillRect(0, 0, outW, outH);
    outCtx.restore();
  }

  return outCanvas;
}

/**
 * Xử lý ảnh tải lên: Tách nền -> Tạo viền sticker die-cut -> Áp dụng phong cách nghệ thuật.
 * Trả về Data URL PNG trong suốt, sẵn sàng dán trực tiếp lên bình 3D.
 */
export async function processImageToSticker(
  fileOrDataUrl: File | string,
  styleId: StickerStyleId = "cute",
  options?: { removeBg?: boolean; maxWidth?: number }
): Promise<string> {
  const styleOpt =
    STICKER_STYLES.find((s) => s.id === styleId) ?? STICKER_STYLES[0];
  const maxW = options?.maxWidth ?? 480;
  const shouldRemoveBg = options?.removeBg ?? true;

  // Đọc ảnh thành HTMLImageElement
  let src = "";
  if (typeof fileOrDataUrl === "string") {
    src = fileOrDataUrl;
  } else {
    src = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = "anonymous";
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = src;
  });

  // Tính tỷ lệ kích thước tối ưu
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (w > maxW || h > maxW) {
    if (w > h) {
      h = Math.round((h * maxW) / w);
      w = maxW;
    } else {
      w = Math.round((w * maxW) / h);
      h = maxW;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  // 1. Tách nền nếu cần
  if (shouldRemoveBg) {
    removeBackgroundAndIsolate(ctx, w, h);
  }

  // 2. Lọc màu theo phong cách nghệ thuật
  applyStyleFilter(ctx, w, h, styleId);

  // 3. Tạo viền sticker die-cut chuyên nghiệp
  const finalCanvas = createDieCutStickerBorder(canvas, styleOpt);

  return finalCanvas.toDataURL("image/png");
}

