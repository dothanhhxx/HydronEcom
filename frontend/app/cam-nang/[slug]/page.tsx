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
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const toc = post.body.map((b, i) => ({ id: `muc-${i + 1}`, h: b.h })).filter((x): x is { id: string; h: string } => Boolean(x.h));
  return (
    <article>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, datePublished: post.date, author: { "@type": "Organization", name: SITE.name } }} />
      <header className="hd-page-head">
        <div className="lt-container hd-page-head-inner" data-art="">
          <div>
            <Breadcrumbs crumbs={[{ label: "Cẩm nang", href: "/cam-nang" }, { label: post.title }]} />
            <h1 style={{ fontSize: "clamp(30px, 4.2vw, 54px)" }}>{post.title}</h1>
            <p>{post.excerpt}</p>
            <time dateTime={post.date} className="hd-post-meta" style={{ display: "block", marginTop: 14 }}>
              {viDate(post.date)} · {post.minutes} phút đọc
            </time>
          </div>
          <div className="hd-frame" style={{ width: "100%" }}>
            <div className="hd-frame-inner" style={{ aspectRatio: "16 / 11" }}>
              <PostCover post={post} />
            </div>
          </div>
        </div>
      </header>

      <div className="hd-surface hd-surface-page" data-ripple="right">
        <div className="lt-container hd-article">
          <div className="lt-prose">
            {post.body.map((b, i) => (
              <section key={i} id={b.h ? `muc-${i + 1}` : undefined}>
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
          <aside className="hd-article-aside" aria-label="Trong bài">
            {toc.length > 1 && (
              <nav className="hd-toc" aria-labelledby="toc-title">
                <h2 id="toc-title">Trong bài này</h2>
                <ol>
                  {toc.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`}>{t.h}</a></li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="hd-aside-cta hd-surface hd-surface-deep" data-ripple="right">
              <strong>Thử in tên lên bình của bạn</strong>
              <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>Gõ tên, chọn kiểu chữ và xoay mô hình 3D trước khi đặt.</p>
              <Link href="/thiet-ke-3d" className="hd-btn hd-btn-cream"><Icon name="pencil" size={18} />Mở trình thiết kế 3D</Link>
            </div>
          </aside>
        </div>
      </div>

      <section className="hd-surface hd-surface-paper hd-section" data-waves aria-labelledby="doc-tiep">
        <div className="lt-container">
          <div className="hd-stack" style={{ marginBottom: 28 }}>
            <span className="hd-kicker">Đọc tiếp</span>
            <h2 id="doc-tiep" style={{ fontSize: "clamp(24px, 2.6vw, 34px)" }}>Bài viết khác</h2>
          </div>
          <div className="hd-posts">
            {more.map((p) => (
              <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="hd-post-box">
                <span className="hd-post-cover"><PostCover post={p} /></span>
                <time dateTime={p.date}>{viDate(p.date)} · {p.minutes} phút đọc</time>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
