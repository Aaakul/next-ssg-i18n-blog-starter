'use client'
// https://easonchang.com/zh-TW/posts/post-side-toc
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { TableOfContentsProps } from './types'
export default function TableOfContents({ toc }: TableOfContentsProps) {
  const filteredHeadings = toc.filter(
    (item) => item.depth === 1 || item.depth === 2 || item.depth === 3
  )

  const [activeId, setActiveId] = useState<string>('')
  const t = useTranslations('common')
  useEffect(() => {
    const handleScroll = () => {
      const headings = filteredHeadings.map((h) => h.url.slice(1))
      let current = ''

      for (const id of headings) {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 80) {
            current = id
          }
        }
      }

      if (current && current !== activeId) {
        setActiveId(current)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [filteredHeadings, activeId])

  if (filteredHeadings.length === 0) {
    return null
  }

  return (
    <div aria-label={t('table_of_contents') || 'On this page'}>
      <p className="mb-3 text-left text-base font-semibold text-gray-900 dark:text-gray-100">
        {t('table_of_contents') || 'On this page'}
      </p>
      <nav className="flex flex-col">
        {filteredHeadings.map((heading) => {
          const id = heading.url.slice(1)
          const isActive = activeId === id

          return (
            <button
              key={id}
              type="button"
              className={clsx(
                'text-left text-xs transition-colors sm:text-sm',
                'mb-1',
                'pl-2',
                'whitespace-nowrap',
                'overflow-hidden',
                'text-ellipsis',
                'cursor-pointer',
                isActive
                  ? 'text-primary-500/95 hover:text-primary-600 dark:hover:text-primary-400 font-medium'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                heading.depth === 2
                  ? 'pl-4 opacity-90'
                  : heading.depth === 3
                    ? 'pl-8 opacity-80'
                    : 'font-medium'
              )}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(id)
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                  window.history.pushState(null, '', heading.url)
                }
              }}
            >
              {heading.value}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
