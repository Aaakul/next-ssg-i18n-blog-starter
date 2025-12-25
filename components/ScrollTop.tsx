'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

const SCROLL_THRESHOLD = 50

const ScrollTop = () => {
  const t = useTranslations('common')
  const [show, setShow] = useState<boolean>(false)
  const ticking = useRef(false)

  const handleWindowScroll = useCallback(() => {
    if (!ticking.current) {
      ticking.current = true
      requestAnimationFrame(() => {
        const shouldShow = window.scrollY > SCROLL_THRESHOLD
        setShow((prev) => (prev === shouldShow ? prev : shouldShow))
        ticking.current = false
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll)

    return () => {
      window.removeEventListener('scroll', handleWindowScroll)
    }
  }, [handleWindowScroll])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const UpArrowIcon = (
    <svg
      className="size-6"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
  )

  return (
    <div
      className={clsx(
        'fixed right-5 bottom-18 z-30 flex flex-col md:pr-4 md:pb-4 lg:pr-30',
        'transition-opacity duration-300 ease-in-out',
        show
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      )}
    >
      <button
        type="button"
        aria-label={t('scroll_to_top')}
        onClick={handleScrollTop}
        className={clsx(
          'rounded-full p-2 drop-shadow-md transition-all duration-300 ease-in-out ring-inset',
          'bg-default focus:outline-non link-hover hover:scale-125 focus:ring-2',
          'transform-gpu'
        )}
        style={{
          willChange: 'opacity, transform',
          WebkitBackfaceVisibility: 'hidden',
          WebkitTransform: 'translateZ(0)',
        }}
      >
        {UpArrowIcon}
      </button>
    </div>
  )
}

export default ScrollTop
