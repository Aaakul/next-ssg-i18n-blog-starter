'use client'

import { redirect } from 'next/navigation'
import { defaultLocale, supportedLocales } from '@/i18n/'
import { hasLocale } from 'next-intl'
import { useEffect } from 'react'
import { SiteConfig } from '@/data/siteConfig.mjs'
import Cookies from 'js-cookie'

export default function RootPage() {
  useEffect(() => {
    let preferredLocale = defaultLocale
    const localeInCookie = Cookies.get('NEXT_LOCALE')
    const cookieConfig = SiteConfig.cookieMaxAgeDays as string | number
    if (localeInCookie && hasLocale(supportedLocales, localeInCookie)) {
      preferredLocale = localeInCookie
    } else {
      const languages = [...navigator.languages]
      for (let lang of languages) {
        if (hasLocale(supportedLocales, lang)) {
          preferredLocale = lang
          break
        }
      }
    }
    document.documentElement.lang = preferredLocale
    if (localeInCookie !== preferredLocale && cookieConfig !== 'none') {
      const cookieOption = typeof cookieConfig === 'number' ? { expires: cookieConfig } : undefined
      Cookies.set('NEXT_LOCALE', preferredLocale, { ...cookieOption })
    }

    redirect(`/${preferredLocale}`)
  }, [])
}
