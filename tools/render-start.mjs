#!/usr/bin/env node
/**
 * Render Production Runner cho Lam Trà E-Commerce
 *
 * Tác dụng:
 * 1. Khởi động Fastify API Backend tại cổng nội bộ 4000 (127.0.0.1:4000)
 * 2. Khởi động Next.js Frontend tại cổng Render cung cấp ($PORT, mặc định 3000, 0.0.0.0)
 * 3. Cho phép chạy trọn gói CẢ Frontend + Backend trên CÙNG 1 Web Service Free của Render
 *    giúp tiết kiệm 100% quota Free Tier, tránh cold start chéo và chia sẻ chung thư mục lưu trữ uploads/data.
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PUBLIC_PORT = process.env.PORT || "3000";
const BACKEND_INTERNAL_PORT = process.env.BACKEND_INTERNAL_PORT || "4000";

console.log("══════════════════════════════════════════════════════════════");
console.log("  🍵 LAM TRÀ E-COMMERCE - RENDER PRODUCTION RUNNER");
console.log("══════════════════════════════════════════════════════════════");
console.log(`  ▶ Cổng Render công khai (Next.js): ${PUBLIC_PORT}`);
console.log(`  ▶ Cổng nội bộ (Fastify Backend):   ${BACKEND_INTERNAL_PORT}`);
console.log(`  ▶ Thư mục gốc dự án:               ${ROOT}`);
console.log("──────────────────────────────────────────────────────────────");

// 1. Khởi động Fastify Backend
const backendEnv = {
  ...process.env,
  PORT: String(BACKEND_INTERNAL_PORT),
  HOST: "127.0.0.1",
  NODE_ENV: "production",
  CORS_ORIGIN: `http://localhost:${PUBLIC_PORT},http://127.0.0.1:${PUBLIC_PORT}`,
};

console.log("[1/2] Đang khởi động Fastify Backend API...");
const backendProcess = spawn("node", ["dist/main.js"], {
  cwd: path.join(ROOT, "backend"),
  env: backendEnv,
  stdio: "inherit",
});

backendProcess.on("error", (err) => {
  console.error("❌ Lỗi khi khởi động tiến trình Backend:", err);
  process.exit(1);
});

backendProcess.on("exit", (code) => {
  console.warn(`⚠️ Tiến trình Backend kết thúc với mã: ${code}`);
  if (code !== 0) {
    process.exit(code || 1);
  }
});

// Chờ 1.2 giây để Backend Fastify sẵn sàng rồi khởi động Next.js
setTimeout(() => {
  console.log("[2/2] Đang khởi động Next.js Frontend Server...");

  const frontendEnv = {
    ...process.env,
    PORT: String(PUBLIC_PORT),
    HOSTNAME: "0.0.0.0",
    NODE_ENV: "production",
    BACKEND_URL: `http://127.0.0.1:${BACKEND_INTERNAL_PORT}`,
  };

  const frontendProcess = spawn(
    "npm",
    ["--prefix", "frontend", "run", "start"],
    {
      cwd: ROOT,
      env: frontendEnv,
      stdio: "inherit",
      shell: true,
    }
  );

  frontendProcess.on("error", (err) => {
    console.error("❌ Lỗi khi khởi động tiến trình Frontend:", err);
    process.exit(1);
  });

  frontendProcess.on("exit", (code) => {
    console.warn(`⚠️ Tiến trình Frontend kết thúc với mã: ${code}`);
    process.exit(code || 0);
  });

  // Xử lý dừng tiến trình nhẹ nhàng khi Render gửi tín hiệu SIGTERM
  const handleShutdown = (signal) => {
    console.log(`\n🛑 Nhận tín hiệu ${signal}. Đang đóng các dịch vụ an toàn...`);
    try {
      backendProcess.kill("SIGTERM");
    } catch {}
    try {
      frontendProcess.kill("SIGTERM");
    } catch {}
    setTimeout(() => process.exit(0), 1000);
  };

  process.on("SIGINT", () => handleShutdown("SIGINT"));
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
}, 1200);
