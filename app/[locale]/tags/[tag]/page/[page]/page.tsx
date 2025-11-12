import { slug } from 'github-slugger'
import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { allBlogs } from 'contentlayer/generated'
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

export function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) => {
    const tagCounts = tagData[locale] || {}
    const tags = Object.keys(tagCounts)

    return tags.flatMap((tagSlug) => {
      const totalPosts = allBlogs.filter(
        (post) => post.tags && post.tags.map((t) => slug(t)).includes(tagSlug)
      ).length

      const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE) || 1

      return Array.from({ length: totalPages }, (_, i) => ({
        locale,
        tag: tagSlug,
        page: (i + 1).toString(),
      }))
    })
  })
}

export async function generateMetadata(props: { params: Promise<TagPageParams> }) {
  const params = await props.params
  const { locale, tag, page } = params

  const t = await getTranslations({ locale, namespace: 'common' })
  const decodedTag = decodeURI(tag)

  const altUrl: Record<string, string> = {}
  for (const locale of supportedLocales) {
    altUrl[locale] = `${SiteUrlWithBase}/${locale}/tags/${decodedTag}/page/${page}`
  }

  return genPageMetadata({
    title: `${decodedTag.toUpperCase()} | ${t('site_title')}`,
    description: `${t('tags')}: ${decodedTag} | ${t('site_title')}`,
    fullUrl: altUrl[locale],
    locale: locale,
    alternates: {
      languages: altUrl,
    },
  })
}

export default function Page(props: { params: Promise<TagPageParams> }) {
  const params = use(props.params)
  const { locale, tag, page } = params
  setRequestLocale(locale)

  return RenderBlogListPage({
    locale: locale,
    page: page,
    type: 'tags',
    decodedTag: decodeURI(tag),
  })
}
