import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import categoriesDataRaw from '@/.contentlayer/generated/categories-data.json' with { type: 'json' }
import genPageMetadata from '@/lib/seo'
import { Locale, supportedLocales } from '@/i18n'
import { use } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CategoriesPageParams } from '@/app/types'
import { RenderBlogListPage } from '@/components/RenderPages'
import { useTranslations } from 'next-intl'

const POSTS_PER_PAGE = SiteConfig.postsPerPage

const categoriesData = categoriesDataRaw as unknown as {
  [_ in Locale]: Record<string, number>
}

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) => {
    const categoryCounts = categoriesData[locale] || {}
    const categories = Object.keys(categoryCounts)

    return categories.flatMap((sluggedCategory) => {
      const count = categoryCounts[sluggedCategory]
      const totalPages = Math.ceil(count / POSTS_PER_PAGE) || 1

      return Array.from({ length: totalPages }, (_, i) => ({
        locale,
        categories: sluggedCategory,
        page: i === 0 ? undefined : ['page', (i + 1).toString()], // skip `/page/1`
      }))
    })
  })
}

export async function generateMetadata(props: { params: Promise<CategoriesPageParams> }) {
  const params = await props.params
  const { locale, categories, page } = params

  const t = await getTranslations({ locale, namespace: 'common' })
  const decodedSlug = decodeURI(categories)
  const path = !page ? '' : page.join('/')

  const getFullURL = (locale: Locale, path: string) =>
    new URL(`${SiteUrlWithBase}/${locale}/categories/${decodedSlug}/${path}`).toString()

  const altLangURL: Record<string, string> = {}
  for (const locale of supportedLocales) {
    altLangURL[locale] = getFullURL(locale, path)
  }

  return genPageMetadata({
    title: `${t('categories')}: ${decodedSlug} | ${t('site_title')}`,
    description: `${t('categories')}: ${decodedSlug} | ${t('site_title')}`,
    fullUrl: altLangURL[locale],
    locale: locale,
    alternates: {
      languages: altLangURL,
    },
  })
}

export default function Page(props: { params: Promise<CategoriesPageParams> }) {
  const params = use(props.params)
  const { locale, categories, page } = params
  setRequestLocale(locale)
  const t = useTranslations('common')

  const pageNum = page?.[0] === 'page' && page?.[1] ? parseInt(page[1], 10) : 1
  const decodedSlug = decodeURI(categories)
  const title =
    t('categories') +
    ': ' +
    decodedSlug![0].toUpperCase() +
    decodedSlug!.slice(1).replace(/\s+/g, '-')

  const header = <h1 className="h1-heading">{title}</h1>

  return RenderBlogListPage({
    locale: locale as Locale,
    pageNum: pageNum,
    type: 'categories',
    decodedSlug: decodedSlug,
    header: header,
  })
}
