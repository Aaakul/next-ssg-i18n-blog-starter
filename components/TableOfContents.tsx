'use client'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { TableOfContentsProps } from './types'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function TOCWithToggleButton({ toc }: TableOfContentsProps) {
  const [showTOC, setShowTOC] = useState(false)
  const t = useTranslations('common')
  const tocRef = useRef<HTMLDivElement>(null)

  const filteredHeadings = toc.filter(
    (item) => item.depth === 1 || item.depth === 2 || item.depth === 3
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tocRef.current && !tocRef.current.contains(event.target as Node)) {
        setShowTOC(false)
      }
    }

    if (showTOC) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTOC])

  if (filteredHeadings.length === 0) {
    return null
  }

  const toggleTOC = () => {
    setShowTOC(!showTOC)
  }

  return (
    <>
      <div
        ref={tocRef}
        className={clsx(
          'lg:hidden',
          'fixed top-0 right-0 z-80 h-full w-full p-6',
          'bg-default',
          'shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          showTOC ? 'translate-x-0' : 'translate-x-full'
        )}
        onClick={() => {
          setShowTOC(false)
        }}
      >
        <button
          type="button"
          aria-label={t('close_toc')}
          onClick={toggleTOC}
          className="link-hover absolute top-3 right-3 rounded-full p-2 focus:outline-none"
        >
          <XMarkIcon className="icon-size h-6 w-6" />
        </button>

        <TableOfContents toc={toc} />
      </div>

      <div
        className={clsx('fixed right-5 bottom-4 z-30 flex flex-col md:pr-4 md:pb-2', 'lg:hidden')}
      >
        <button
          type="button"
          aria-label={t('open_toc')}
          onClick={toggleTOC}
          className={clsx(
            'rounded-full p-2 shadow-lg transition-all duration-300 ease-in-out',
            'bg-default focus:outline-non link-hover hover:scale-125 focus:ring-2',
            showTOC ? 'hidden' : 'block'
          )}
        >
          <Bars3BottomLeftIcon className="icon-size" />
        </button>
      </div>

      <aside className="hidden p-6 lg:sticky lg:top-20 lg:block">
        {filteredHeadings && filteredHeadings.length > 0 && <TableOfContents toc={toc} />}
      </aside>
    </>
  )
}

// https://easonchang.com/zh-TW/posts/post-side-toc
function TableOfContents({ toc }: TableOfContentsProps) {
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
      <p className="mb-3 text-left text-3xl font-semibold md:text-4xl lg:text-base">
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
                'text-left text-base transition-colors md:text-lg lg:text-sm',
                'mb-1',
                'pl-2',
                'whitespace-nowrap',
                'lg:overflow-hidden',
                'text-ellipsis',
                'cursor-pointer',
                'link-hover',
                isActive ? 'text-primary-500 font-medium' : 'text-muted',
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
