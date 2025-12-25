import { SiteConfig } from '@/data/siteConfig.mjs'
import HeaderNavLinks from '@/components/header/HeaderNavLinks'
import Image from '../Image'
import Link from '../Link'
import { useTranslations } from 'next-intl'
import { Locale } from '@/i18n'
import clsx from 'clsx'
import HeaderButtons from './HeaderButtons'

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('common')
  const links = [
    { href: '/', title: t('home') },
    { href: '/tags', title: t('tags') },
    { href: '/projects', title: t('projects') },
    { href: '/about', title: t('about') },
  ]
  return (
    <header
      className={clsx(
        'z-30 mx-auto flex h-16 w-[98%] max-w-400 rounded-2xl focus:outline-none',
        'bg-default shadow-lg ring-inset',
        SiteConfig.isStickyNav && 'sticky top-2'
      )}
    >
      <nav
        className="mx-auto flex w-full items-center justify-between px-2"
        aria-label={t('global_nav')}
      >
        <div className="flex flex-1 items-center justify-start">
          <Link href={`/${locale}`} aria-label={t('link_to', { title: t('home') })}>
            <div className="flex-center space-x-2 sm:pl-2">
              {SiteConfig.isShowLogo && (
                <Image src="/favicon.svg" alt="Logo" width={32} height={32} loading="eager" />
              )}
              <div
                className={clsx(
                  'link-hover truncate bg-clip-text text-xl font-semibold text-transparent xl:text-2xl',
                  'to-primary-500 bg-linear-to-bl from-neutral-100 via-blue-300',
                  'hidden lg:block'
                )}
              >
                {t('header_title')}
              </div>
            </div>
          </Link>
        </div>

        <div
          className={clsx(
            'mx-auto items-center justify-center gap-x-4 break-keep',
            'hidden sm:flex sm:shrink-0'
          )}
        >
          <HeaderNavLinks
            locale={locale}
            links={links}
            linkClassName="text-lg lg:text-xl link-hover font-semibold whitespace-nowrap"
          />
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-4 sm:-mr-2">
          <HeaderButtons locale={locale} links={links} />
        </div>
      </nav>
    </header>
  )
}
