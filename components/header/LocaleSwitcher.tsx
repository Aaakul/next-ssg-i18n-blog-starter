'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { defaultLocale, supportedLocales, Locale, localeDisplayNames } from '@/i18n'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { InformationCircleIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'
import { getKeyByLocaleAndSlug, getSlugByLocaleAndKey } from '@/lib/key-slug-utils'
import { LocaleFallbackModalProps } from '../types'
import clsx from 'clsx'

function LocaleFallbackModal({
  isOpen,
  onClose,
  targetLocale,
  fallbackOptions,
}: LocaleFallbackModalProps) {
  const intlRouter = useRouter()
  const t = useTranslations('locale_switcher')

  const targetLocaleName = localeDisplayNames[targetLocale] || targetLocale

  const handleFallback = (locale: Locale, slug: string) => {
    intlRouter.replace(`/blog/${slug}`, { locale })
    onClose()
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="flex-center fixed inset-0 z-90 w-full">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        style={{ WebkitBackdropFilter: 'blur(8px)' }}
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div className="bg-default relative mx-4 w-full max-w-md rounded-2xl p-6 shadow-lg">
        {/* Icon + Title + Message */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon Circle */}
          <div
            className={clsx(
              'bg-primary-100 rounded-full dark:bg-gray-900/50',
              'size-10 sm:size-12',
              'flex-center mt-1 flex shrink-0'
            )}
          >
            <InformationCircleIcon className="text-primary-600 size-6" aria-hidden="true" />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{t('title')}</h3>
            <div className="text-muted mt-1 space-y-1 text-sm">
              <p>{t('no_translation', { targetLocaleName })}</p>
              <p>{t('switch_to_available')}</p>
            </div>
          </div>
        </div>
        {/* Fallback Language Options */}
        <div className="mt-5 max-h-40 space-y-2 overflow-y-auto rounded-lg p-1">
          {fallbackOptions.map((option) => (
            <button
              key={option.locale}
              type="button"
              className={clsx(
                'hover:bg-primary-500 bg-white dark:bg-gray-700 dark:hover:bg-gray-600',
                'w-full rounded-lg px-4 py-3 text-left text-sm font-medium drop-shadow-md ring-inset'
              )}
              onClick={() => handleFallback(option.locale, option.slug)}
            >
              {option.displayName}
            </button>
          ))}
        </div>
        {/* Close Button */}
        <div className="mt-6">
          <button
            type="button"
            className={clsx(
              'bg-primary-600 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400',
              'inline-flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold text-gray-100 drop-shadow-md ring-inset'
            )}
            onClick={onClose}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LocaleSwitcher() {
  const intlRouter = useRouter()
  const intlPathname = usePathname()
  const currentLocale = useLocale() as Locale
  const t = useTranslations('locale_switcher')

  const [fallbackModal, setFallbackModal] = useState<{
    isOpen: boolean
    targetLocale: Locale
    options: { locale: Locale; slug: string; displayName: string }[]
  }>({
    isOpen: false,
    targetLocale: defaultLocale as Locale,
    options: [],
  })

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const openFallbackModal = (
    targetLocale: Locale,
    options: { locale: Locale; slug: string; displayName: string }[]
  ) => {
    setFallbackModal({ isOpen: true, targetLocale, options })
  }

  const closeFallbackModal = () => {
    setFallbackModal((prev) => ({ ...prev, isOpen: false }))
  }

  const changeLocale = useCallback(
    async (newLocale: Locale, closePopover?: () => void) => {
      if (newLocale === currentLocale) {
        closePopover?.()
        return
      }
      const segments = intlPathname.split('/').filter(Boolean)
      const isBlogPostPage =
        segments.length >= 2 && segments[0] === 'blog' && segments[1] !== 'page'

      if (isBlogPostPage) {
        const slug = decodeURI(segments.slice(1).join('/'))
        const postKey = getKeyByLocaleAndSlug(slug, currentLocale)
        if (!postKey) {
          closePopover?.()
          return notFound()
        }

        const newSlug = getSlugByLocaleAndKey(postKey, newLocale)

        if (newSlug) {
          intlRouter.replace(`/blog/${newSlug}`, { locale: newLocale })
        } else {
          const fallbackOptions = supportedLocales
            .filter((locale) => locale !== newLocale)
            .map((locale) => {
              const slug = getSlugByLocaleAndKey(postKey, locale)
              return slug
                ? {
                    locale,
                    slug,
                    displayName: localeDisplayNames[locale] ?? locale,
                  }
                : null
            })
            .filter(
              (option): option is { locale: Locale; slug: string; displayName: string } =>
                option !== null
            )

          if (fallbackOptions.length > 0) {
            openFallbackModal(newLocale, fallbackOptions)
          } else {
            alert(t('no_translation'))
          }
        }
        closePopover?.()
      } else {
        intlRouter.replace(intlPathname, { locale: newLocale })
        closePopover?.()
      }
    },
    [currentLocale, intlRouter, intlPathname, t]
  )

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          ref={buttonRef}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
          className="header-button flex-center"
          aria-label={t('locale_switcher')}
          type="button"
        >
          <LanguageIcon className="size-6" />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className={clsx(
              'absolute right-0 mt-2 w-28',
              'bg-default z-40 rounded-lg drop-shadow-md ring-inset focus:outline-none'
            )}
            role="menu"
          >
            <div className="p-1">
              {supportedLocales.map((locale: Locale) => (
                <button
                  key={locale}
                  onClick={() => {
                    changeLocale(locale, () => setMenuOpen(false))
                    setMenuOpen(false)
                  }}
                  className={clsx(
                    'hover:bg-primary-500 rounded-lg hover:text-gray-100',
                    'w-full px-3 py-2 text-left text-sm'
                  )}
                  role="menuitem"
                >
                  {localeDisplayNames[locale as Locale]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {fallbackModal.isOpen && (
        <LocaleFallbackModal
          isOpen={fallbackModal.isOpen}
          onClose={closeFallbackModal}
          targetLocale={fallbackModal.targetLocale}
          fallbackOptions={fallbackModal.options}
        />
      )}
    </>
  )
}
