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
    { href: '/', title: t('home') || 'Home' },
    { href: '/blog', title: t('blog') || 'Blog' },
    { href: '/tags', title: t('tags') || 'Tags' },
    { href: '/projects', title: t('projects') || 'Projects' },
    { href: '/about', title: t('about') || 'About' },
  ]
  return (
    <header
      className={clsx(
        'z-50 m-auto flex h-16 w-[98%] max-w-7xl rounded-2xl bg-white/90 drop-shadow-xl backdrop-blur-md backdrop-filter focus:outline-none md:rounded-lg dark:bg-gray-800/90',
        '[-webkit-backdrop-filter:blur(12px)]',
        SiteConfig.isStickyNav && 'sticky top-2'
      )}
    >
      <nav
        className="m-auto flex w-full items-center justify-between p-2 duration-300"
        aria-label={t('global_nav')}
      >
        <div className="flex flex-1 items-center justify-start">
          <Link href={`/${locale}`} aria-label={t('link_to', { title: t('home') })}>
            <div className="flex items-center space-x-2">
              <div className="mx-1 h-8 w-8">
                <Image
                  src="/favicon.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                  fetchPriority="high"
                  loading="eager"
                  preload={true}
                />
              </div>
              <div className="to-primary-500 hover:text-primary-600 ml-1 hidden bg-linear-to-bl from-neutral-100 via-blue-300 bg-clip-text text-xl leading-10 font-semibold text-transparent duration-300 md:block xl:text-2xl dark:opacity-95">
                {t('header_title')}
              </div>
            </div>
          </Link>
        </div>

        <div className="mx-auto hidden items-center justify-center space-x-4 overflow-x-auto text-center sm:flex sm:flex-1">
          <HeaderNavLinks
            locale={locale}
            links={links}
            linkClassName="hover:text-primary-500 text-sm md:text-md lg:text-lg dark:hover:text-primary-400 font-semibold text-gray-900 duration-300 hover:text-lg hover:drop-shadow-xl dark:text-gray-100"
          />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <HeaderButtons locale={locale} links={links} />
        </div>
      </nav>
    </header>
  )
}
