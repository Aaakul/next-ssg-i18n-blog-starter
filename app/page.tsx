import { defaultLocale, supportedLocales } from '@/i18n'
import { SiteConfig } from '@/data/siteConfig.mjs'
import getMessageByLocale from '@/lib/locale-message-utils.mjs'
import Script from 'next/script'

const redirectScript = `
;(function() {
  const DEFAULT_LOCALE = ${JSON.stringify(defaultLocale)};
  const SUPPORTED_LOCALES = ${JSON.stringify(supportedLocales)};
  const BASE_PATH = ${JSON.stringify(SiteConfig.basePath)};;
  const COOKIE_MAX_AGE_DAYS = ${JSON.stringify(SiteConfig.cookieMaxAgeDays)};
  const COOKIE_NAME = 'NEXT_LOCALE';

  const getPreferredLocale = () => {
    const localeFromCookie = getLocaleFromCookie();
    if (localeFromCookie) {
      if (SUPPORTED_LOCALES.indexOf(localeFromCookie) !== -1) {
        return localeFromCookie
      }
      const matchedByPrefix = findLocaleByPrefix(localeFromCookie);
      if (matchedByPrefix) {
        return matchedByPrefix
      }
    }

    const browserLocales = navigator.languages || [navigator.language];
    for (const locale of browserLocales) {
      if (SUPPORTED_LOCALES.indexOf(locale) != -1) return locale;
      const matched = findLocaleByPrefix(locale);
      if (matched) return matched
    }

    return DEFAULT_LOCALE
  };

  const getLocaleFromCookie = () => {
    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
    return match ? match[2] : null
  };

  const findLocaleByPrefix = (locale) => {
    const prefix = locale.split('-')[0];
    return SUPPORTED_LOCALES.find((supportedLocale) => supportedLocale.startsWith(prefix))
  };

  const setLocaleCookie = (locale) => {
    let cookieValue = COOKIE_NAME + '=' + locale;
    if (COOKIE_MAX_AGE_DAYS > 0) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + COOKIE_MAX_AGE_DAYS);
      cookieValue += '; expires=' + expirationDate.toUTCString() + '; path=/; SameSite=Lax'
    } else {
      cookieValue += '; path=/; SameSite=Lax'
    }
    document.cookie = cookieValue
  };

  const currentLocaleInCookie = getLocaleFromCookie();
  const preferredLocale = getPreferredLocale();
  if (!currentLocaleInCookie) {
    setLocaleCookie(preferredLocale)
  }

  window.location.replace(BASE_PATH + '/' + preferredLocale)
})()`

export default async function Page() {
  const defaultTranslations = (await getMessageByLocale(defaultLocale))?.common

  return (
    <>
      <title>{`${defaultTranslations?.redirecting} | ${defaultTranslations?.site_title}`}</title>
      <meta name="description" content={defaultTranslations?.redirecting}></meta>
      <style>{`@keyframes pulse{50%{background-color:#1f2937}}body{background-color:#d4d4d4;animation:pulse 2s cubic-bezier(0.4,0,0.6,1)infinite}`}</style>
      <Script strategy="beforeInteractive" id="redirect">
        {redirectScript}
      </Script>
    </>
  )
}
