// app/articles/wrapper.tsx

import { ArticlePost } from "@/lib/articleLoader"

export default function ArticleWrapper({
  post,
  children,
}: {
  post: ArticlePost
  children: React.ReactNode
}) {
  return (
    <article className="prose mx-auto py-12">
      <h1>{post.meta.title}</h1>
      <div className="text-sm text-gray-500">{post.meta.date}</div>
      {post.meta.author && (
        <div className="mb-4 mt-2 text-sm text-neutral-700">
          By {post.meta.author.name}
          {post.meta.author.role ? `, ${post.meta.author.role}` : ''}
        </div>
      )}
      <div className="mt-4">{children}</div>
    </article>
  )
}
