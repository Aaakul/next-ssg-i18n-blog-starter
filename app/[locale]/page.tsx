import { use } from 'react'
import Link from '@/components/Link'
import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import Balancer from 'react-wrap-balancer'
import { supportedLocales, Locale } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { sortPosts, allCoreContent } from '@/lib/contentlayer-utils'
import { allBlogs } from 'contentlayer/generated'
import { useTranslations } from 'next-intl'
import genPageMetadata from '@/lib/seo'
import { PostList } from '@/components/PostList'
import { LocaleParams } from '@/app/types'

const MAX_DISPLAY = SiteConfig.homepageMaxPosts

export async function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<LocaleParams> }) {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'common' })

  const altLangURL: Record<string, string> = {}
  for (const locale of supportedLocales) {
    altLangURL[locale] = new URL(`${SiteUrlWithBase}/${locale}`).toString()
  }

  return genPageMetadata({
    title: `${t('latest_posts')} | ${t('site_title')}`,
    description: `${t('site_description')} | ${t('site_title')}`,
    locale: locale,
    fullUrl: altLangURL[locale],
    alternates: {
      languages: altLangURL,
    },
  })
}

export default function Home(props: { params: Promise<LocaleParams> }) {
  const params = use(props.params)
  const { locale } = params
  setRequestLocale(locale)
  const t = useTranslations('common')

  // Filter posts
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts).filter((post) => post.language === locale)

  return (
    <section>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-4 md:space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            <Balancer>{t('latest_posts')}</Balancer>
          </h1>
          <h2 className="text-lg text-gray-500 dark:text-gray-400">
            <Balancer> {t('site_description')}</Balancer>
          </h2>
        </div>
        <PostList posts={posts} locale={locale as Locale} maxDisplay={MAX_DISPLAY} />
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="mr-4 flex justify-end text-base font-medium">
          <Link
            href={`/${locale}/blog/list`}
            className="text-primary-400 hover:text-primary-400 flex text-xl"
            aria-label={t('all_posts')}
          >
            &rarr; {t('all_posts')}
          </Link>
        </div>
      )}
    </section>
  )
}
