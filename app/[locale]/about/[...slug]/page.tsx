import 'katex/dist/katex.css'
import '@/styles/post.css'
import { Authors, allAuthors } from 'contentlayer/generated'
import { SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import genPageMetadata from '@/lib/seo'
import { supportedLocales, Locale } from '@/i18n'
import { redirect } from 'next/navigation'
import { SlugParams } from '@/app/types'
import { RenderAuthorPage } from '@/components/RenderPages'

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) =>
    allAuthors
      .filter((author) => author.language === locale && !author.slug.endsWith('/default'))
      .map((author) => ({
        locale: locale,
        slug: author.slug
          .substring(locale.length + 1)
          .split('/')
          .map(decodeURI),
      }))
  )
}

export async function generateMetadata(props: { params: Promise<SlugParams> }) {
  const { locale, slug } = await props.params
  const decodedSlug = decodeURI(slug[0])

  const t = await getTranslations({ locale, namespace: 'common' })

  const author = allAuthors.find(
    (a) => a.slug.endsWith(`/${decodedSlug}`) && a.language === locale
  ) as Authors

  const altUrl: Record<string, string> = {}

  for (const locale of supportedLocales) {
    const slug = allAuthors.find(
      (a) => a.slug.endsWith(`/${decodedSlug}`) && a.language === locale && a.language === locale
    )?.slug
    if (slug) {
      altUrl[locale] = `${SiteUrlWithBase}/${locale}/about/${slug}`
    }
  }

  return genPageMetadata({
    title: `${t('about')} ${author?.name} | ${t('site_title')}`,
    description: `${t('about')} ${author?.name} | ${t('site_title')}`,
    fullUrl: `${SiteUrlWithBase}/${locale}/about/${slug}`,
    locale: locale,
    type: 'profile',
    username: author?.name,
    alternates: {
      languages: altUrl,
    },
  })
}

export default function Page(props: { params: Promise<SlugParams> }) {
  const params = use(props.params)
  const { locale, slug } = params
  setRequestLocale(locale)
  if (slug[0] === 'default') {
    redirect(`/${locale}/about`)
  }

  const decodedSlug = decodeURI(slug[0])

  return RenderAuthorPage({ locale: locale as Locale, slug: decodedSlug })
}
