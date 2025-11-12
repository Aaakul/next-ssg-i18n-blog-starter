'use client'

import dynamic from 'next/dynamic'
import { MobileNavProps } from '../types'
import { useTranslations } from 'next-intl'

export function IconPlaceholder() {
  const t = useTranslations('kbar_search')
  return (
    <div
      className="h-6 w-6 animate-pulse rounded-full bg-neutral-300/50"
      aria-label={t('loading')}
      aria-busy={true}
    ></div>
  )
}

const DynamicLocaleSwitcher = dynamic(() => import('./LocaleSwitcher'), {
  ssr: false,
  loading: () => <IconPlaceholder />,
})

const DynamicSearchButton = dynamic(() => import('./SearchButton'), {
  ssr: false,
  loading: () => <IconPlaceholder />,
})

const DynamicThemeSwither = dynamic(() => import('./ThemeSwitcher'), {
  ssr: false,
  loading: () => <IconPlaceholder />,
})

const DynamicMobileNav = dynamic(() => import('./MobileNav'), {
  ssr: false,
  loading: () => (
    <div className="sm:hidden">
      <IconPlaceholder />
    </div>
  ),
})

export default function HeaderButtons({ locale, links }: MobileNavProps) {
  return (
    <>
      <DynamicLocaleSwitcher />
      <DynamicSearchButton />
      <DynamicThemeSwither />
      <DynamicMobileNav locale={locale} links={links} />
    </>
  )
}
