"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ds";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Vui lòng nhập mã bảo mật.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (data.ok) {
        router.push("/quan-tri/don-hang");
        router.refresh();
      } else {
        setError(data.error || "Mã bảo mật không đúng.");
      }
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at top, #143527 0%, #081912 100%)",
        padding: "20px",
        fontFamily: "var(--font-ui)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#FFFFFF",
          borderRadius: 14,
          padding: "36px 32px 32px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          border: "1px solid rgba(188, 154, 108, 0.4)",
          textAlign: "center",
        }}
      >
        {/* Emblem & Brand Title */}
        <div style={{ display: "inline-flex", padding: 12, borderRadius: 12, background: "#0D2219", border: "1px solid rgba(188, 154, 108, 0.5)", marginBottom: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/lam-tra-emblem.svg" alt="" style={{ height: 36 }} />
        </div>

        <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#0D2219", letterSpacing: "0.02em" }}>
          Quản Trị Lam Trà
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: "#6B7280", lineHeight: 1.5 }}>
          Cổng duyệt đơn hàng và điều chỉnh giá trà độc lập cho chủ shop.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Mã bảo mật quản trị (Master Passcode)
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                placeholder="Nhập mã bảo mật…"
                style={{
                  width: "100%",
                  height: 46,
                  padding: "0 14px",
                  borderRadius: 8,
                  border: error ? "1.5px solid #EF4444" : "1.2px solid #D1D5DB",
                  background: "#FAF8F5",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {error && (
              <div style={{ fontSize: 12.5, color: "#DC2626", marginTop: 6, fontWeight: 500 }}>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              height: 46,
              borderRadius: 8,
              border: 0,
              background: "linear-gradient(135deg, #DFBE89 0%, #BC9A6C 100%)",
              color: "#0F261C",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 2px 8px rgba(188, 154, 108, 0.4)",
              transition: "transform 150ms ease",
            }}
          >
            {loading ? "Đang xác thực..." : "Đăng nhập Quản Trị →"}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid #F3F4F6", fontSize: 12.5, color: "#9CA3AF" }}>
          <div>
            <Link href="/" style={{ color: "#047857", textDecoration: "none", fontWeight: 500 }}>
              ← Quay lại trang chủ Lam Trà
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
