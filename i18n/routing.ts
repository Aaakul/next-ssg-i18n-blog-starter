import { defineRouting } from 'next-intl/routing'
import { cookieMaxAge } from '@/data/siteConfig.mjs'
import { supportedLocales, defaultLocale, Locale } from './index'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: supportedLocales,
  defaultLocale: defaultLocale as Locale,
  localePrefix: 'always',
  localeCookie: {
    maxAge: cookieMaxAge,
  },
})
