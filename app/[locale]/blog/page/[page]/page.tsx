import { use } from 'react'
import { allBlogs } from 'contentlayer/generated'
import { Locale, supportedLocales } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import genPageMetadata from '@/lib/seo'
import { BlogPageParams } from '@/app/types'
import { RenderBlogListPage } from '@/components/RenderPages'

export function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) => {
    const totalPages = Math.ceil(
      allBlogs.filter((post) => post.language === locale).length / SiteConfig.postsPerPage || 1
    )

    return Array.from({ length: totalPages }, (_, i) => ({
      locale,
      page: (i + 1).toString(),
    }))
  })
}

export async function generateMetadata(props: { params: Promise<BlogPageParams> }) {
  const params = await props.params
  const { locale, page } = params

  const t = await getTranslations({ locale, namespace: 'common' })
  const altUrl: Record<string, string> = {}

  for (const locale of supportedLocales) {
    altUrl[locale] = `${SiteUrlWithBase}/${locale}/blog/page/${page}`
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

export default function Page(props: { params: Promise<BlogPageParams> }) {
  const params = use(props.params)
  const { locale, page } = params
  setRequestLocale(locale)

  return RenderBlogListPage({ locale: locale, page: page, type: 'posts' })
}
