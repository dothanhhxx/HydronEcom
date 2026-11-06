import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Dancing_Script, Unbounded } from "next/font/google";
import Analytics from "@/components/shell/Analytics";
import StoreShell from "@/components/shell/StoreShell";
import "./globals.css";

const display = Unbounded({ subsets: ["latin", "vietnamese"], weight: ["500", "600", "700"], variable: "--font-display-face", display: "swap" });
const body = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body-face", display: "swap" });
const script = Dancing_Script({ subsets: ["latin", "vietnamese"], weight: ["700"], variable: "--font-script-face", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Hydron – Bình giữ nhiệt in tên riêng, tự thiết kế 3D",
    template: "%s · Hydron",
  },
  description: "Bình giữ nhiệt thép 304 dung tích 500 – 900ml, giữ lạnh 24 giờ. Tự thiết kế 3D: in tên, số, sticker ngay trên web. Giá từ 150.000₫.",
  icons: { icon: "/icon.svg" },
  openGraph: { siteName: "Hydron", locale: "vi_VN", type: "website" },
};

export const viewport: Viewport = { themeColor: "#FDF2DF", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${script.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreShell>{children}</StoreShell>
        <Analytics />
      </body>
    </html>
  );
}
