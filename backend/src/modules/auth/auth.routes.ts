import type { FastifyPluginAsync } from "fastify";
import { ADMIN_COOKIE_NAME, AuthService } from "./auth.service.js";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/api/admin/auth", async (request, reply) => {
    const body = (request.body as { passcode?: string }) || {};
    const { passcode } = body;

    if (!passcode || !AuthService.verifyPasscode(passcode)) {
      return reply.status(401).send({
        ok: false,
        error: "Mã bảo mật quản trị không chính xác.",
      });
    }

    const token = await AuthService.createSessionToken();

    reply.setCookie(ADMIN_COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 ngày
    });

    return { ok: true, message: "Đăng nhập quản trị thành công." };
  });

  fastify.get("/api/admin/auth", async (request) => {
    const cookieToken = request.cookies[ADMIN_COOKIE_NAME];
    const authHeader = request.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    const valid = await AuthService.verifySessionToken(token);
    return { authenticated: valid };
  });

  fastify.delete("/api/admin/auth", async (_request, reply) => {
    reply.clearCookie(ADMIN_COOKIE_NAME, {
      path: "/",
      httpOnly: true,
    });
    return { ok: true, message: "Đã đăng xuất khỏi trang quản trị." };
  });
};
