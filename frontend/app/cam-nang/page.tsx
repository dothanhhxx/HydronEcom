import type { Metadata } from "next";
import Link from "next/link";
import PostCover from "@/components/landing/PostCover";
import { PageHeader } from "@/components/shell/PageHeader";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = { title: "Cẩm nang dùng bình giữ nhiệt", description: "Chọn dung tích, vệ sinh bình, ý tưởng in tên làm quà và cách bình giữ nhiệt hoạt động." };

export default function JournalPage() {
  return (
    <>
      <PageHeader title="Cẩm nang" crumbs={[{ label: "Cẩm nang" }]} desc="Chọn bình, dùng bình, giữ bình bền lâu, và vài ý tưởng in tên làm quà." />
      <div className="lt-container" style={{ paddingTop: "clamp(40px, 6vw, 72px)", paddingBottom: 96 }}>
        <div className="hd-posts">
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="hd-post">
              <span className="hd-post-cover"><PostCover post={p} /></span>
              <time dateTime={p.date}>{p.date.split("-").reverse().join("/")} · {p.minutes} phút đọc</time>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 19, fontWeight: 600, lineHeight: 1.35 }}>{p.title}</h2>
              <p>{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
