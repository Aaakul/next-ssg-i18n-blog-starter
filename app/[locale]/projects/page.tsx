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

export async function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<LocaleParams> }) {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'common' })

  const author = allAuthors.find(
    (a) => a.slug.endsWith('/default') && a.language === locale
  ) as Authors

  const altLangURL: Record<string, string> = {}

  for (const locale of supportedLocales) {
    altLangURL[locale] = new URL(`${SiteUrlWithBase}/${locale}/projects`).toString()
  }

  return genPageMetadata({
    title: `${t('projects')} | ${t('site_title')}`,
    description: `${t('projects_description')} | ${t('site_title')}`,
    locale: locale,
    fullUrl: altLangURL[locale],
    type: 'article',
    authors: author.name,
    alternates: {
      languages: altLangURL,
    },
  })
}

export default function Projects(props: { params: Promise<LocaleParams> }) {
  const params = use(props.params)
  const { locale } = params
  setRequestLocale(locale)
  const t = useTranslations('common')

  return (
    <main className="divide-y-gray">
      <header className="gap-y-2 pt-4">
        <h1 className="h1-heading">{t('projects')}</h1>
        <h2 className="text-muted text-lg">{t('projects_description')}</h2>
      </header>
      <section className="lg:py-6">
        <div className="flex-center m-0 flex-wrap">
          {projectsData.length > 0 &&
            projectsData.map((d) => (
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
