import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import tagDataRaw from '@/app/tag-data.json' with { type: 'json' }
import genPageMetadata from '@/lib/seo'
import { Locale, supportedLocales } from '@/i18n'
import { use } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { TagPageParams } from '@/app/types'
import { RenderBlogListPage } from '@/components/RenderPages'

const POSTS_PER_PAGE = SiteConfig.postsPerPage

const tagData = tagDataRaw as unknown as {
  [_ in Locale]: Record<string, number>
}

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) => {
    const tagCounts = tagData[locale] || {}
    const tags = Object.keys(tagCounts)

    return tags.flatMap((sluggedTag) => {
      const count = tagCounts[sluggedTag]
      const totalPages = Math.ceil(count / POSTS_PER_PAGE) || 1

      return Array.from({ length: totalPages }, (_, i) => ({
        locale,
        tag: sluggedTag,
        page: i === 0 ? undefined : ['page', (i + 1).toString()], // skip `/page/1`
      }))
    })
  })
}

export async function generateMetadata(props: { params: Promise<TagPageParams> }) {
  const params = await props.params
  const { locale, tag, page } = params

  const t = await getTranslations({ locale, namespace: 'common' })
  const decodedTag = decodeURI(tag)
  const path = !page ? '' : page.join('/')

  const getFullURL = (locale: Locale, path: string) =>
    new URL(`${SiteUrlWithBase}/${locale}/tags/${decodedTag}/${path}`).toString()

  const altLangURL: Record<string, string> = {}
  for (const locale of supportedLocales) {
    altLangURL[locale] = getFullURL(locale, path)
  }

  return genPageMetadata({
    title: `${decodedTag.toUpperCase()} | ${t('site_title')}`,
    description: `${t('tags')}: ${decodedTag} | ${t('site_title')}`,
    fullUrl: altLangURL[locale],
    locale: locale,
    alternates: {
      languages: altLangURL,
    },
  })
}

export default function Page(props: { params: Promise<TagPageParams> }) {
  const params = use(props.params)
  const { locale, tag, page } = params
  setRequestLocale(locale)

  const pageNum = page?.[0] === 'page' && page?.[1] ? parseInt(page[1], 10) : 1

  return RenderBlogListPage({
    locale: locale as Locale,
    pageNum: pageNum,
    type: 'tags',
    decodedTag: decodeURI(tag),
  })
}
