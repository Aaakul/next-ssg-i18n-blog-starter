'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

const SCROLL_THRESHOLD = 50

const ScrollTop = () => {
  const t = useTranslations('common')
  const [show, setShow] = useState<boolean>(false)

  const handleWindowScroll = useCallback(() => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      setShow(true)
    } else {
      setShow(false)
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
    <svg className="icon-size" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  return (
    <div
      className={clsx(
        'fixed right-5 bottom-18 z-30 flex flex-col md:pr-4 md:pb-4 lg:pr-30',
        show ? 'flex' : 'invisible'
      )}
    >
      <button
        type="button"
        aria-label={t('scroll_to_top')}
        onClick={handleScrollTop}
        className={clsx(
          'rounded-full p-2 shadow-sm transition-all duration-300 ease-in-out',
          'bg-default focus:outline-non link-hover hover:scale-125 focus:ring-2'
        )}
      >
        {UpArrowIcon}
      </button>
    </div>
  )
}

export default ScrollTop
