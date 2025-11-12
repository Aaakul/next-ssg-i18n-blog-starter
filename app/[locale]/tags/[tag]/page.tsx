import { SiteUrlWithBase } from '@/data/siteConfig.mjs'
import tagDataRaw from '@/app/tag-data.json' with { type: 'json' }
import genPageMetadata from '@/lib/seo'
import { Locale, supportedLocales } from '@/i18n'
import { use } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { TagParams } from '@/app/types'
import { RenderBlogListPage } from '@/components/RenderPages'

const tagData = tagDataRaw as unknown as {
  [_ in Locale]: Record<string, number>
}
// create static pages for each language
export function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) => {
    // todo

    const tagCounts = tagData[locale] || {}
    const tagKeys = Object.keys(tagCounts)

    return tagKeys.map((tag) => ({
      locale,
      tag: decodeURI(tag),
    }))
  })
}

export async function generateMetadata(props: { params: Promise<TagParams> }) {
  const params = await props.params
  const { locale, tag } = params

  const t = await getTranslations({ locale, namespace: 'common' })
  const decodedTag = decodeURI(tag)

  const altUrl: Record<string, string> = {}
  for (const locale of supportedLocales) {
    altUrl[locale] = `${SiteUrlWithBase}/${locale}/tags/${decodedTag}`
  }

  return genPageMetadata({
    title: `${decodedTag.toUpperCase()} | ${t('site_title')}`,
    description: `${t('tags')}: ${decodedTag} | ${t('site_title')}`,
    fullUrl: `${SiteUrlWithBase}/${locale}/tags/${decodedTag}`,
    locale: locale,
    alternates: {
      languages: altUrl,
    },
  })
}

export default function Page(props: { params: Promise<TagParams> }) {
  const params = use(props.params)
  const { locale, tag } = params
  setRequestLocale(locale)

  return RenderBlogListPage({
    locale: locale,
    page: '1',
    type: 'tags',
    decodedTag: decodeURI(tag),
  })
}
