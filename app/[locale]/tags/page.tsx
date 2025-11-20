import { use } from 'react'
import Tag from '@/components/Tag'
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
        'mb-4 flex flex-col gap-y-6 py-6',
        'md:mt-24 md:flex-row md:items-center md:justify-center md:gap-x-6'
      )}
    >
      <header className={clsx('shrink-0', 'md:border-r-2 md:pr-6 md:pl-0')}>
        <h1 className="h1-heading">{t('tags')}</h1>
      </header>
      {tagKeys.length === 0 ? (
        <p className="text-muted text-large">{t('no_tags_found')}</p>
      ) : (
        <div className={clsx('flex flex-wrap items-center gap-4 md:max-w-lg')}>
          {tagKeys.map((tag) => (
            <div
              key={tag}
              className="text-muted text-muted text-base font-bold md:text-lg lg:text-xl"
            >
              <Tag
                text={tag}
                locale={locale as Locale}
                className="text-base md:text-lg lg:text-xl"
              />
              ({tagCounts[tag]})
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
