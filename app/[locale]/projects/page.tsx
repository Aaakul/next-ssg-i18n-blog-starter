import { use } from 'react'
import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import genPageMetadata from '@/lib/seo'
import { SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { Locale, supportedLocales } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { allAuthors, Authors } from '@/.contentlayer/generated'
import { LocaleParams } from '@/app/types'
import Balancer from 'react-wrap-balancer'

export function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<LocaleParams> }) {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'common' })

  const author = allAuthors.find(
    (a) => a.slug.endsWith('/default') && a.language === locale
  ) as Authors

  const altUrl: Record<string, string> = {}

  for (const locale of supportedLocales) {
    altUrl[locale] = `${SiteUrlWithBase}/${locale}/projects`
  }

  return genPageMetadata({
    title: `${t('projects')} | ${t('site_title')}`,
    description: `${t('projects_desc')} | ${t('site_title')}`,
    locale: locale,
    fullUrl: `${SiteUrlWithBase}/${locale}/projects`,
    type: 'article',
    authors: author.name,
    alternates: {
      languages: altUrl,
    },
  })
}

export default function Projects(props: { params: Promise<LocaleParams> }) {
  const params = use(props.params)
  const { locale } = params
  setRequestLocale(locale)
  const t = useTranslations('common')

  return (
    <main className="divide-y divide-gray-200 dark:divide-gray-700">
      <header className="space-y-2 pt-6 pb-4 md:space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          <Balancer>{t('projects')}</Balancer>
        </h1>
        <h2 className="text-lg text-gray-500 dark:text-gray-400">
          <Balancer> {t('projects_desc')}</Balancer>
        </h2>
      </header>
      <section className="py-4">
        <div className="m-0 flex flex-wrap">
          {projectsData.map((d) => (
            <Card
              key={d.href}
              title={d.title[locale]}
              description={d.description[locale]}
              imgSrc={d.imgSrc}
              href={d.href}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
