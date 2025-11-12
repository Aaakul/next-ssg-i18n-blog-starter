import dynamic from 'next/dynamic'
import Header from '@/components/header/Header'
import Footer from '@/components/Footer'
import ThemeProviders from '@/components/ThemeProviders'
import { Locale, defaultLocale, supportedLocales } from '@/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RootLayoutProps } from '@/app/types'
import { redirect } from 'next/navigation'

// create static pages for each language
export function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({ locale }))
}

const DynamicSearchProvider = dynamic(() => import('@/components/custom-KBar/SearchProvider'), {
  ssr: true,
  loading: () => null,
})

export default async function LocaleLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  if (!supportedLocales.includes(locale as any)) {
    redirect(`/${defaultLocale}`)
  }

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'common' })

  return (
    <>
      <link rel="alternate" type="application/rss+xml" href={`/${locale}/feed.xml`} />
      <link rel="alternate" type="application/atom+xml" href={`/${locale}/atom.xml`} />
      <link rel="alternate" type="application/json" href={`/${locale}/feed.json`} />
      <NextIntlClientProvider>
        <ThemeProviders>
          <DynamicSearchProvider>
            <Header locale={locale as Locale} />
            <main className="m-auto max-w-5xl">{children}</main>
          </DynamicSearchProvider>
          <Footer copyrightText={t('site_title')} />
        </ThemeProviders>
      </NextIntlClientProvider>
    </>
  )
}
