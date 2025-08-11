'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export default function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const articleContent = document.querySelector('article')
    if (!articleContent) return

    const articleHeadings = Array.from(
      articleContent.querySelectorAll('h1, h2')
    )
      .map((heading) => ({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      }))
      .filter((heading) => heading.id && heading.id.trim() !== '')

    setHeadings(articleHeadings)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -35% 0px' }
    )

    articleHeadings.forEach(({ id }) => {
      if (id && id.trim() !== '') {
        const element = articleContent.querySelector(`#${id}`)
        if (element) observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <div className={`lg:sticky lg:top-8 ${className}`}>
      <h3 className="font-display text-sm font-semibold text-neutral-950 mb-4">
        Table of Contents
      </h3>
      <nav className="space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-sm transition-colors hover:text-neutral-950 ${
              activeId === heading.id
                ? 'text-neutral-950 font-medium'
                : 'text-neutral-600'
            } ${heading.level === 1 ? 'font-medium' : 'ml-4'}`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  )
}
