import { use } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagsDataRaw from '@/.contentlayer/generated/tags-data.json' with { type: 'json' }
import genPageMetadata from '@/lib/seo'
import { supportedLocales, Locale } from '@/i18n'
import { SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { LocaleParams } from '@/app/types'
import clsx from 'clsx'

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

  const tagsData = tagsDataRaw as unknown as {
    [_ in Locale]: Record<string, number>
  }
  const tagCounts = tagsData[locale as Locale] || {}
  const tagKeys = Object.keys(tagCounts)

  return (
    <section
      className={clsx(
        'mb-4 flex flex-col items-start justify-start pt-6 pb-8',
        'md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6'
      )}
    >
      <div className="space-y-5 md:border-r-2 md:px-6">
        <h2
          className={clsx(
            'text-3xl font-bold',
            'sm:text-4xl sm:leading-10',
            'md:text-6xl md:leading-14'
          )}
        >
          {t('tags')}
        </h2>
      </div>
      {tagKeys.length === 0 ? (
        <p className="text-muted">{t('no_tags_found')}</p>
      ) : (
        <div className="flex max-w-lg flex-wrap gap-4">
          {tagKeys.map((tag) => (
            <div key={tag} className="flex-center font-bold">
              <Tag text={tag} locale={locale as Locale} />
              <Link
                href={`/${locale}/tags/${slug(tag)}`}
                className="text-muted uppercase"
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
