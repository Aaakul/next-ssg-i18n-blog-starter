import 'katex/dist/katex.css'
import '@/styles/post.css'
import { Authors, allAuthors } from 'contentlayer/generated'
import { SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { Locale, supportedLocales } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import genPageMetadata from '@/lib/seo'
import { LocaleParams } from '@/app/types'
import { RenderAuthorPage } from '@/components/RenderPages'

export function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<LocaleParams> }) {
  const params = await props.params
  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'common' })
  const author = allAuthors.find(
    (a) => a.slug.endsWith('/default') && a.language === locale
  ) as Authors

  const altUrl: Record<string, string> = {}

  for (const locale of supportedLocales) {
    const slug = allAuthors.find(
      (a) => a.slug.endsWith('/default') && a.language === locale && a.language === locale
    )?.slug
    if (slug) {
      altUrl[locale] = `${SiteUrlWithBase}/${locale}/about`
    }
  }

  return genPageMetadata({
    title: `${t('about')} ${author.name} | ${t('site_title')}`,
    description: `${t('about')} ${author.name} | ${t('site_title')}`,
    fullUrl: `${SiteUrlWithBase}/${locale}/about`,
    locale: locale,
    type: 'profile',
    username: author.name,
    alternates: {
      languages: altUrl,
    },
  })
}

export default function Page(props: { params: Promise<LocaleParams> }) {
  const params = use(props.params)
  const { locale } = params
  setRequestLocale(locale)

  return RenderAuthorPage({ locale: locale as Locale, slug: 'default' })
}
