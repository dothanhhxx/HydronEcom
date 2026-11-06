import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { ENV } from "./config/env.js";
import { JsonStore } from "./infrastructure/persistence/json-store.js";
import { adminKeyConfigured } from "./modules/auth/auth.service.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { productsRoutes } from "./modules/products/products.routes.js";
import { ordersRoutes } from "./modules/orders/orders.routes.js";
import { messagesRoutes } from "./modules/messages/messages.routes.js";
import { uploadsRoutes } from "./modules/uploads/uploads.routes.js";

async function bootstrap() {
  const server = Fastify({
    logger: true,
  });

  // 1. CORS
  const configuredOrigins = (ENV.CORS_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const defaultOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4000",
    "http://127.0.0.1:4000",
  ];

  await server.register(cors, {
    origin: (origin, cb) => {
      // Cho phép request nội bộ không kèm header origin (như SSR, curl, webhook)
      if (!origin) return cb(null, true);
      const isAllowed =
        configuredOrigins.includes(origin) ||
        defaultOrigins.includes(origin) ||
        origin.endsWith(".onrender.com") ||
        process.env.NODE_ENV !== "production";
      cb(null, isAllowed);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // 2. Cookie
  await server.register(cookie);

  // 3. Multipart Upload
  await server.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  // 4. Phục vụ tĩnh thư mục uploads (/uploads/*)
  const { mkdir } = await import("node:fs/promises");
  await mkdir(ENV.UPLOADS_DIR, { recursive: true }).catch(() => {});
  await mkdir(ENV.DATA_DIR, { recursive: true }).catch(() => {});

  await server.register(fastifyStatic, {
    root: ENV.UPLOADS_DIR,
    prefix: "/uploads/",
    decorateReply: false,
  });

  // 5. Health Check
  // Có chạm vào database để ping định kỳ (UptimeRobot) giữ cả Render lẫn Supabase không ngủ.
  server.get("/api/health", async (_request, reply) => {
    try {
      const storage = await JsonStore.ping();
      return { ok: true, service: "lam-tra-api", storage, uptime: process.uptime(), timestamp: new Date().toISOString() };
    } catch (err: any) {
      return reply.status(503).send({ ok: false, service: "lam-tra-api", error: err.message });
    }
  });

  // 6. Đăng ký các modules
  await server.register(authRoutes);
  await server.register(productsRoutes);
  await server.register(ordersRoutes);
  await server.register(messagesRoutes);
  await server.register(uploadsRoutes);

  try {
    const address = await server.listen({ port: ENV.PORT, host: ENV.HOST });
    console.log(`[LamTra API] Server đang chạy tại: ${address}`);
    if (!adminKeyConfigured()) {
      console.warn("[LamTra API] ⚠ Trang quản trị đang bị KHOÁ: đặt ADMIN_SECRET_KEY (≥ 12 ký tự, khác mật khẩu mặc định) trong Environment.");
    }
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

bootstrap();
