// Shared Auth Types for Admin Portal

export type AdminSession = {
  authenticated: boolean;
  issuedAt: number;
  expiresAt: number;
  role: "admin";
};

export type AuthResult =
  | { ok: true; session: AdminSession }
  | { ok: false; error: string };
