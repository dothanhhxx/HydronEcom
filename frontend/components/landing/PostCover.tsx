import BottleRender from "@/components/bottle/BottleRender";
import type { Post } from "@/lib/posts";

/** Ảnh bìa bài viết: dựng bình theo chủ đề bài, cho tới khi có ảnh chụp thật. */
export default function PostCover({ post }: { post: Post }) {
  const c = post.cover;
  return (
    <span style={{ position: "absolute", inset: 0, background: c.bg, display: "block" }}>
      <BottleRender shape={c.shape} hex={c.hex} size={c.size} custom={c.custom} label="" viewBox="40 40 320 440" />
    </span>
  );
}
