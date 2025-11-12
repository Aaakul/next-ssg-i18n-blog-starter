import { SiteConfig } from '@/data/siteConfig.mjs'
import { hasLocale } from 'next-intl'

export const localeDisplayNames = { ...SiteConfig.localeDisplayNames } as const
export type Locale = keyof typeof localeDisplayNames
export const supportedLocales = Object.keys(localeDisplayNames) as readonly Locale[]
export const defaultLocale = hasLocale(supportedLocales, SiteConfig.defaultLocale)
  ? (SiteConfig.defaultLocale as Locale)
  : supportedLocales[0]
