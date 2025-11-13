import { use } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagDataRaw from '@/app/tag-data.json' with { type: 'json' }
import genPageMetadata from '@/lib/seo'
import { supportedLocales, Locale } from '@/i18n'
import { SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { LocaleParams } from '@/app/types'

// create static pages for each language
export async function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<LocaleParams> }) {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'common' })

  const altLangURL: Partial<Record<Locale, string>> = {}
  for (const locale of supportedLocales) {
    altLangURL[locale] = new URL(`${SiteUrlWithBase}/${locale}/tags`).toString()
  }

  return genPageMetadata({
    title: `${t('tags')} | ${t('site_title')}`,
    description: `${t('tags')} | ${t('site_title')}`,
    fullUrl: altLangURL[locale as Locale],
    locale: locale,
    alternates: {
      languages: altLangURL,
    },
  })
}

export default function Page(props: { params: Promise<LocaleParams> }) {
  const params = use(props.params)
  const { locale } = params
  setRequestLocale(locale)
  const t = useTranslations('common')

  const tagData = tagDataRaw as unknown as {
    [_ in Locale]: Record<string, number>
  }
  const tagCounts = tagData[locale as Locale] || {}
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a: string, b: string) => {
    return (tagCounts[b] || 0) - (tagCounts[a] || 0)
  })

  return (
    <section className="mb-4 flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-y-5 pt-6 pb-8 md:space-y-5">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
          {t('tags')}
        </h2>
      </div>
      {tagKeys.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">{t('no_tags_found')}</p>
      ) : (
        <div className="flex max-w-lg flex-wrap gap-4">
          {sortedTags.map((tag) => (
            <div key={tag} className="flex items-center">
              <Tag text={tag} locale={locale as Locale} />
              <Link
                href={`/${locale}/tags/${slug(tag)}`}
                className="text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                aria-label={t('view_posts_tagged', { tag: tag })}
              >
                ({tagCounts[tag]})
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
