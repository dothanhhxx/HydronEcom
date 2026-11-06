import type { Metadata } from "next";
import Link from "next/link";
import BottleRender from "@/components/bottle/BottleRender";
import { Icon } from "@/components/ds";
import PostCover from "@/components/landing/PostCover";
import { PageHeader } from "@/components/shell/PageHeader";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = { title: "Cẩm nang dùng bình giữ nhiệt", description: "Chọn dung tích, vệ sinh bình, ý tưởng in tên làm quà và cách bình giữ nhiệt hoạt động." };

const viDate = (d: string) => d.split("-").reverse().join("/");

export default function JournalPage() {
  const [first, ...rest] = POSTS;
  return (
    <>
      <PageHeader title="Cẩm nang" crumbs={[{ label: "Cẩm nang" }]} desc="Chọn bình, dùng bình, giữ bình bền lâu, và vài ý tưởng in tên làm quà."
        art={
          <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: `repeat(${POSTS.length}, 1fr)`, alignItems: "end" }}>
            {POSTS.map((p) => (
              <BottleRender key={p.slug} shape={p.cover.shape} hex={p.cover.hex} size={p.cover.size} custom={p.cover.custom} label="" viewBox="110 40 180 430" />
            ))}
          </div>
        }
      />

      {first && (
        <section className="hd-surface hd-surface-mist hd-section" data-ripple="left" aria-label="Bài mới nhất">
          <div className="lt-container">
            <Link href={`/cam-nang/${first.slug}`} className="hd-post-feature">
              <div className="hd-frame">
                <div className="hd-frame-inner">
                  <PostCover post={first} />
                </div>
              </div>
              <div className="hd-stack">
                <span className="hd-kicker">Bài mới nhất</span>
                <h2>{first.title}</h2>
                <p className="hd-lede">{first.excerpt}</p>
                <time className="hd-post-meta" dateTime={first.date} style={{ display: "block" }}>{viDate(first.date)} · {first.minutes} phút đọc</time>
                <span className="hd-btn hd-btn-primary" style={{ marginTop: 24 }}>Đọc bài viết <Icon name="arrow-right" size={18} /></span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="hd-surface hd-surface-paper hd-section" data-ripple="right" data-waves aria-labelledby="bai-khac">
          <div className="lt-container">
            <div className="hd-stack" style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
              <span className="hd-kicker">Đọc thêm</span>
              <h2 id="bai-khac" style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>Mẹo dùng bình và ý tưởng quà tặng</h2>
            </div>
            <div className="hd-posts">
              {rest.map((p) => (
                <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="hd-post-box">
                  <span className="hd-post-cover"><PostCover post={p} /></span>
                  <time dateTime={p.date}>{viDate(p.date)} · {p.minutes} phút đọc</time>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="hd-post-more">Đọc bài <Icon name="arrow-right" size={16} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
