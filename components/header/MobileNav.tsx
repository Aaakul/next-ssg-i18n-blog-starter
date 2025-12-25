'use client'

import { MobileNavProps } from '../types'
import HeaderNavLinks from '@/components/header/HeaderNavLinks'
import { Bars4Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import { clsx } from 'clsx'

const MobileNav = ({ locale, links }: MobileNavProps) => {
  const t = useTranslations('common')

  const handleLinkClick = () => {
    const checkbox = document.getElementById('mobile-nav') as HTMLInputElement
    if (checkbox) {
      checkbox.checked = false
    }
  }

  return (
    <>
      {/* Open Button*/}
      <div className="sm:pointer-events-none sm:invisible">
        <label
          htmlFor="mobile-nav"
          aria-label={t('open_nav')}
          className="header-button block cursor-pointer sm:hidden"
        >
          <Bars4Icon className="size-6" aria-hidden="true" />
        </label>
      </div>

      {/* Hidden Checkbox */}
      <input type="checkbox" id="mobile-nav" className="peer hidden" />

      {/* Sliding Panel */}
      <div
        className={clsx(
          'bg-default fixed inset-y-0 right-0 w-full shadow-lg transition-all duration-300 ease-in-out',
          'z-90 translate-x-full',
          'peer-checked:translate-x-0'
        )}
        role="dialog"
        aria-modal="true"
        title={t('nav_modal')}
      >
        {/* Close Button */}
        <label
          htmlFor="mobile-nav"
          className="link-hover flex-center absolute top-4 right-4 z-85 size-16 cursor-pointer p-4"
          aria-label={t('close_nav')}
        >
          <XMarkIcon className="size-8" aria-hidden="true" />
        </label>

        {/* Navigation Links */}
        <nav className="h-screen overflow-y-auto p-6 pt-18 pb-24">
          <HeaderNavLinks
            locale={locale}
            links={links}
            linkClassName="block py-3 pr-4 text-2xl link-hover font-bold"
            onLinkClick={handleLinkClick}
          />
        </nav>
      </div>
    </>
  )
}

export default MobileNav
