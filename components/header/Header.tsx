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
    { href: '', title: t('home') || 'Home' },
    { href: '/tags', title: t('tags') || 'Tags' },
    { href: '/projects', title: t('projects') || 'Projects' },
    { href: '/about', title: t('about') || 'About' },
  ]
  return (
    <header
      className={clsx(
        'z-30 m-auto flex h-16 w-[98%] max-w-7xl rounded-2xl focus:outline-none',
        'bg-default shadow-lg',
        SiteConfig.isStickyNav && 'sticky top-2'
      )}
    >
      <nav
        className="m-auto flex w-full items-center justify-between p-2"
        aria-label={t('global_nav')}
      >
        <div className="flex flex-1 items-center justify-start">
          <Link href={`/${locale}`} aria-label={t('link_to', { title: t('home') })}>
            <div className="flex-center space-x-2">
              <div className="h-8 w-8 rounded-full">
                <Image src="/favicon.svg" alt="Logo" width={32} height={32} loading="eager" />
              </div>
              <div
                className={clsx(
                  'link-hover truncate bg-clip-text text-lg font-semibold text-transparent xl:text-2xl',
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
            'mx-auto items-center justify-center space-x-4 break-keep',
            'hidden sm:flex sm:shrink-0'
          )}
        >
          <HeaderNavLinks
            locale={locale}
            links={links}
            linkClassName="text-lg lg:text-xl link-hover font-semibold whitespace-nowrap"
          />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <HeaderButtons locale={locale} links={links} />
        </div>
      </nav>
    </header>
  )
}
