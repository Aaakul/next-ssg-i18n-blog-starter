import dynamic from 'next/dynamic'
import Header from '@/components/header/Header'
import Footer from '@/components/Footer'
import ThemeProviders from '@/components/ThemeProviders'
import { Locale, supportedLocales } from '@/i18n'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RootLayoutProps } from '@/app/types'
import { SiteConfig } from '@/data/siteConfig.mjs'
import '@/styles/global.css'

// create static pages for each language
export async function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({ locale }))
}

const DynamicSearchProvider = dynamic(() => import('@/components/custom-KBar/SearchProvider'), {
  loading: () => null,
})

const DynamicScrollTop = dynamic(() => import('@/components/ScrollTop'), {
  loading: () => null,
})

export default async function LocaleLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  setRequestLocale(locale)
  const t = await getTranslations('common')

  return (
    <>
      <link
        rel="alternate"
        type="application/rss+xml"
        href={`${SiteConfig.basePath}/${locale}/feed.xml`}
      />
      <link
        rel="alternate"
        type="application/atom+xml"
        href={`${SiteConfig.basePath}/${locale}/atom.xml`}
      />
      <link
        rel="alternate"
        type="application/json"
        href={`${SiteConfig.basePath}/${locale}/feed.json`}
      />
      <NextIntlClientProvider>
        <ThemeProviders>
          <DynamicScrollTop />
          <DynamicSearchProvider>
            <Header locale={locale as Locale} />
            <style>{`#main{@media{padding-inline:0;}}`}</style>
            <main
              id="main"
              style={{
                margin: 'auto',
                width: '100%',
                maxWidth: '72rem',
                flex: 1,
                paddingInline: '0.5rem',
              }}
            >
              {children}
            </main>
          </DynamicSearchProvider>
          <Footer copyrightText={t('site_title')} />
        </ThemeProviders>
      </NextIntlClientProvider>
    </>
  )
}
