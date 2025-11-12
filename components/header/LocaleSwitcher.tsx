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
            className="fixed inset-0 bg-black/30 backdrop-blur backdrop-grayscale"
            style={{ WebkitBackdropFilter: 'blur(8px) grayscale(100%)' }}
          />
        </TransitionChild>

        {/* Panel Wrapper */}
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform rounded-2xl bg-gray-50 p-5 text-left align-middle shadow-lg sm:p-6 dark:bg-gray-800">
              {/* Icon + Title + Message */}
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon Circle */}
                <div className="bg-primary-100 dark:bg-primary-900/50 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12">
                  <InformationCircleIcon
                    className="text-primary-600 dark:text-primary-400 h-6 w-6"
                    aria-hidden="true"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <DialogTitle className="text-lg leading-6 font-semibold text-gray-900 dark:text-gray-100">
                    {t('title')}
                  </DialogTitle>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('no_translation', { targetLocaleName })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('switch_to_available')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fallback Language Options */}
              <div className="mt-5 max-h-40 space-y-2 overflow-y-auto rounded-lg px-1">
                {fallbackOptions.map((option) => (
                  <button
                    key={option.locale}
                    type="button"
                    className="hover:bg-primary-600 w-full rounded-lg bg-white px-4 py-2.5 text-left text-sm font-medium text-gray-900 shadow-xs dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
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
                  className="bg-primary-600 hover:bg-primary-500 active:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:active:bg-primary-600 inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-100 shadow-sm"
                  onClick={onClose}
                >
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
            <PopoverButton
              className="header-button flex items-center"
              aria-label={t('locale_switcher')}
            >
              <LanguageIcon className="h-6" />
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
              <PopoverPanel className="absolute -right-2 z-8 mt-2 w-24 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg transition duration-100 ease-in-out focus:outline-none dark:bg-gray-800">
                <div className="p-1">
                  {supportedLocales.map((locale: Locale) => (
                    <button
                      key={locale}
                      onClick={() => changeLocale(locale, closePopover)}
                      className="group hover:bg-primary-600 space-x relative flex w-full items-center rounded-lg px-2 py-2 text-sm leading-6 hover:text-white focus:outline-none dark:text-gray-100"
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
