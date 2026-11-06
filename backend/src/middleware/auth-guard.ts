import type { FastifyReply, FastifyRequest } from "fastify";
import { ADMIN_COOKIE_NAME, AuthService } from "../modules/auth/auth.service.js";

export async function adminAuthGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const cookieToken = request.cookies[ADMIN_COOKIE_NAME];
  const authHeader = request.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;

  const valid = await AuthService.verifySessionToken(token);
  if (!valid) {
    reply.status(401).send({ ok: false, error: "Yêu cầu quyền quản trị viên." });
  }
}
