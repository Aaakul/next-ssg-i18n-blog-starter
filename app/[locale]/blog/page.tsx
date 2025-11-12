import { use } from 'react'
import genPageMetadata from '@/lib/seo'
import { SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { Locale, supportedLocales } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LocaleParams } from '@/app/types'
import { RenderBlogListPage } from '@/components/RenderPages'

// create static pages for each language
export function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<LocaleParams> }) {
  const params = await props.params
  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'common' })

  const altUrl: Record<string, string> = {}

  for (const locale of supportedLocales) {
    altUrl[locale] = `${SiteUrlWithBase}/${locale}/blog`
  }

  return genPageMetadata({
    locale: locale,
    title: `${t('all_posts')} | ${t('site_title')}`,
    description: `${t('all_posts')} | ${t('site_title')}`,
    fullUrl: altUrl[locale],
    alternates: {
      languages: altUrl,
    },
  })
}

export default function Page(props: { params: Promise<LocaleParams> }) {
  const params = use(props.params)
  const { locale } = params
  setRequestLocale(locale)

  return RenderBlogListPage({ locale: locale, page: '1', type: 'posts' })
}
