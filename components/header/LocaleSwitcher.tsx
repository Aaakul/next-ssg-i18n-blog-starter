'use client'
import { Fragment, useCallback, useState } from 'react'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
  TransitionChild,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { defaultLocale, supportedLocales, Locale, localeDisplayNames } from '@/i18n'
import { useRouter, usePathname } from '@/i18n/routing'
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-100">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop
            className="fixed inset-0 bg-black/30 backdrop-blur backdrop-grayscale backdrop-filter"
            style={{ WebkitBackdropFilter: 'blur(8px) grayscale(100%)' }}
          />
        </TransitionChild>

        {/* Panel Wrapper */}
        <div className="flex-center fixed inset-0 p-4 sm:p-6">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={clsx(
                'w-full max-w-md rounded-2xl p-6',
                'bg-default transform text-left align-middle shadow-lg'
              )}
            >
              {/* Icon + Title + Message */}
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon Circle */}
                <div
                  className={clsx(
                    'bg-primary-100 rounded-full dark:bg-gray-900/50',
                    'h-10 w-10 sm:h-12 sm:w-12',
                    'flex-center mt-1 flex shrink-0'
                  )}
                >
                  <InformationCircleIcon
                    className="text-primary-600 icon-size"
                    aria-hidden="true"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <DialogTitle className="text-lg font-semibold">{t('title')}</DialogTitle>
                  <div className="text-muted mt-1 space-y-1 text-sm">
                    <p>{t('no_translation', { targetLocaleName })}</p>
                    <p>{t('switch_to_available')}</p>
                  </div>
                </div>
              </div>

              {/* Fallback Language Options */}
              <div className="mt-5 max-h-40 space-y-2 overflow-y-auto rounded-lg px-1">
                {fallbackOptions.map((option) => (
                  <button
                    key={option.locale}
                    type="button"
                    className={clsx(
                      'hover:bg-primary-500 bg-white/95 dark:bg-gray-700 dark:hover:bg-gray-600',
                      'w-full rounded-lg px-4 py-3 text-left text-sm font-medium shadow-xs'
                    )}
                    onClick={() => handleFallback(option.locale, option.slug)}
                  >
                    {option.displayName}
                  </button>
                ))}
              </div>

              {/* Close Button */}
              <div className="mt-6">
                <button type="button" className="button-primary w-full px-4 py-3" onClick={onClose}>
                  {t('close')}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
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
      <Popover className="relative inline-block text-left">
        {({ close: closePopover }) => (
          <>
            <PopoverButton className="header-button flex-center" aria-label={t('locale_switcher')}>
              <LanguageIcon className="icon-size" />
            </PopoverButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel
                className={clsx(
                  'absolute z-80 mt-2 w-24 origin-top-left',
                  'bg-default shadow-lg',
                  'rounded-lg focus:outline-none'
                )}
              >
                <div className="p-1">
                  {supportedLocales.map((locale: Locale) => (
                    <button
                      key={locale}
                      onClick={() => changeLocale(locale, closePopover)}
                      className={clsx(
                        'hover:bg-primary-500 rounded-lg hover:text-gray-100',
                        'text-left text-sm',
                        'group space-x relative w-full px-2 py-2'
                      )}
                    >
                      {localeDisplayNames[locale as Locale]}
                    </button>
                  ))}
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>

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
