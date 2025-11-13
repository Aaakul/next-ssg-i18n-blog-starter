import { use } from 'react'
import { allBlogs } from 'contentlayer/generated'
import { Locale, supportedLocales } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import genPageMetadata from '@/lib/seo'
import { BlogPageParams } from '@/app/types'
import { RenderBlogListPage } from '@/components/RenderPages'

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) => {
    const totalPages = Math.ceil(
      allBlogs.filter((post) => post.language === locale).length / SiteConfig.postsPerPage
    )

    return Array.from({ length: totalPages }, (_, i) => ({
      locale,
      page: i === 0 ? undefined : ['page', (i + 1).toString()], // skip `/page/1`
    }))
  })
}

export async function generateMetadata(props: { params: Promise<BlogPageParams> }) {
  const params = await props.params
  const { locale, page } = params

  const t = await getTranslations({ locale, namespace: 'common' })

  const path = !page ? '' : page.join('/')

  const altLangURL: Record<string, string> = {}

  for (const locale of supportedLocales) {
    altLangURL[locale] = new URL(`${SiteUrlWithBase}/${locale}/blog/list/${path}`).toString()
  }

  return genPageMetadata({
    locale: locale,
    title: `${t('all_posts')} | ${t('site_title')}`,
    description: `${t('all_posts')} | ${t('site_title')}`,
    fullUrl: altLangURL[locale],
    alternates: {
      languages: altLangURL,
    },
  })
}

export default function Page(props: { params: Promise<BlogPageParams> }) {
  const params = use(props.params)
  const { locale, page } = params
  setRequestLocale(locale)
  const pageNum = page?.[0] === 'page' && page?.[1] ? parseInt(page[1], 10) : 1
  return RenderBlogListPage({ locale: locale as Locale, pageNum: pageNum, type: 'posts' })
}
