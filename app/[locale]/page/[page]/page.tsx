import { use } from 'react'
import { allBlogs } from 'contentlayer/generated'
import { Locale, supportedLocales } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import genPageMetadata from '@/lib/seo'
import { BlogPageParams } from '@/app/types'
import { RenderBlogListPage } from '@/components/RenderPages'
import { redirect } from 'next/navigation'
import { useTranslations } from 'next-intl'

const POSTS_PER_PAGE = SiteConfig.postsPerPage

export const dynamicParams = false

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) => {
    const totalPages =
      Math.ceil(allBlogs.filter((post) => post.language === locale).length / POSTS_PER_PAGE) || 1

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

  const altLangURL: Record<string, string> = {}

  for (const locale of supportedLocales) {
    altLangURL[locale] = new URL(`${SiteUrlWithBase}/${locale}/page/${page}`).toString()
  }

  const isAllowRobots = parseInt(page, 10) === 1 ? false : SiteConfig.isAllowRobots

  return genPageMetadata({
    locale: locale,
    title: `${t('all_posts')} | ${t('site_title')}`,
    description: `${t('all_posts')} | ${t('site_title')}`,
    fullUrl: altLangURL[locale],
    alternates: {
      languages: altLangURL,
    },
    robots: {
      index: isAllowRobots,
      follow: isAllowRobots,
      googleBot: {
        index: isAllowRobots,
        follow: isAllowRobots,
      },
    },
  })
}

export default function Page(props: { params: Promise<BlogPageParams> }) {
  const params = use(props.params)
  const { locale, page } = params
  setRequestLocale(locale)
  const pageNum = parseInt(page, 10)

  if (pageNum === 1) redirect(`/${locale}`)
  const t = useTranslations('common')

  const header = (
    <>
      <h1 className="h1-heading">{t('all_posts')}</h1>
    </>
  )

  return RenderBlogListPage({
    locale: locale as Locale,
    pageNum: pageNum,
    type: 'posts',
    header: header,
  })
}
