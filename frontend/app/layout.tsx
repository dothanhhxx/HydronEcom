import type { Metadata } from "next";
import Analytics from "@/components/shell/Analytics";
import StoreShell from "@/components/shell/StoreShell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Lam Trà – Trọn vị trà Việt, trọn tấm lòng trao gửi",
    template: "%s · Lam Trà",
  },
  description: "Trà Tân Cương, Thái Nguyên: Móc Câu, Nõn Tôm, Đinh Sen, Đinh Thượng Hạng và hộp quà biếu.",
  icons: { icon: "/assets/lam-tra-emblem.svg" },
  openGraph: { siteName: "Lam Trà", locale: "vi_VN", type: "website", images: ["/assets/photos/hero.jpg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreShell>{children}</StoreShell>
        <Analytics />
      </body>
    </html>
  );
}
