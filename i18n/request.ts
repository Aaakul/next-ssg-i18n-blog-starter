import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { supportedLocales, defaultLocale } from './index'
import Cookies from 'js-cookie'

export default getRequestConfig(async ({ requestLocale }) => {
  const localeInCookie = Cookies.get('NEXT_LOCALE')
  const fallBackLocale =
    localeInCookie && hasLocale(supportedLocales, localeInCookie) ? localeInCookie : defaultLocale

  const requested = await requestLocale
  const locale = hasLocale(supportedLocales, requested) ? requested : fallBackLocale

  return {
    locale: locale as (typeof supportedLocales)[number],
    messages: (await import(`@/i18n/messages/${locale}.json`, { with: { type: 'json' } })).default,
  }
})
