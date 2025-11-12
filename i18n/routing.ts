import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
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

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
