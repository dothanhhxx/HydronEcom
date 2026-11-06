import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ds";
import PostCover from "@/components/landing/PostCover";
import JsonLd from "@/components/shell/JsonLd";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { POSTS, getPost } from "@/lib/posts";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt, alternates: { canonical: `/cam-nang/${p.slug}` } } : {};
}

const viDate = (d: string) => d.split("-").reverse().join("/");

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  return (
    <article>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, datePublished: post.date, author: { "@type": "Organization", name: SITE.name } }} />
      <div className="lt-container" style={{ maxWidth: 860, paddingTop: 20 }}>
        <Breadcrumbs crumbs={[{ label: "Cẩm nang", href: "/cam-nang" }, { label: post.title }]} />
        <h1 style={{ marginTop: 20, fontSize: "clamp(28px, 4vw, 46px)" }}>{post.title}</h1>
        <p style={{ marginTop: 14, fontSize: 18, lineHeight: 1.6, color: "var(--text-body)" }}>{post.excerpt}</p>
        <time dateTime={post.date} style={{ display: "block", marginTop: 12, fontSize: 14, color: "var(--text-subtle)" }}>
          {viDate(post.date)} · {post.minutes} phút đọc
        </time>
        <div style={{ position: "relative", aspectRatio: "16 / 9", marginTop: 28, borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <PostCover post={post} />
        </div>
        <div className="lt-prose" style={{ margin: "36px 0 0", maxWidth: 680 }}>
          {post.body.map((b, i) => (
            <section key={i}>
              {b.h && <h2>{b.h}</h2>}
              {b.p && <p>{b.p}</p>}
              {b.list && (
                <ul>
                  {b.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <div style={{ margin: "40px 0 0", padding: 24, borderRadius: "var(--radius-card)", background: "var(--blue-50)", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>Thử in tên lên bình của bạn</span>
          <Link href="/thiet-ke-3d" className="hd-btn hd-btn-primary"><Icon name="pencil" size={18} />Mở trình thiết kế 3D</Link>
        </div>
      </div>
      <section className="hd-section">
        <div className="lt-container" style={{ maxWidth: 860 }}>
          <h2 style={{ fontSize: 24, marginBottom: 24 }}>Đọc tiếp</h2>
          <div className="hd-posts" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {more.map((p) => (
              <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="hd-post">
                <span className="hd-post-cover"><PostCover post={p} /></span>
                <h3>{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
