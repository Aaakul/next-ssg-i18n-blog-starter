import { use } from 'react'
import { SiteUrlWithBase } from '@/data/siteConfig.mjs'
import Balancer from 'react-wrap-balancer'
import { supportedLocales, Locale } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import genPageMetadata from '@/lib/seo'
import { LocaleParams } from '@/app/types'
import { RenderBlogListPage } from '@/components/RenderPages'

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
  const header = (
    <>
      <h1 className="h1-heading">{t('latest_posts')}</h1>
      <h2 className="text-muted text-lg">
        <Balancer dangerouslySetInnerHTML={{ __html: t.raw('site_description_html') }} />
      </h2>
    </>
  )

  return RenderBlogListPage({
    locale: locale as Locale,
    pageNum: 1,
    type: 'posts',
    header: header,
  })
}
