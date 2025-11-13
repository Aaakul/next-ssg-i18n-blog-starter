import 'katex/dist/katex.css'
import '@/styles/post.css'
import { Authors, allAuthors } from 'contentlayer/generated'
import { SiteUrlWithBase, SiteConfig } from '@/data/siteConfig.mjs'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import genPageMetadata from '@/lib/seo'
import { supportedLocales, Locale } from '@/i18n'
import { AuthorSlugParams } from '@/app/types'
import { RenderAuthorPage } from '@/components/RenderPages'

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) =>
    allAuthors
      .filter((author) => author.language === locale)
      .map((author) => {
        let slugArray: string[] = []
        // skip `/about/default`
        if (!author.slug.endsWith('/default')) {
          slugArray = author.slug
            .substring(locale.length + 1) // remove `${locale}/`
            .split('/')
            .map(decodeURI)
        }

        return {
          locale: locale,
          slug: slugArray,
        }
      })
  )
}

export async function generateMetadata(props: { params: Promise<AuthorSlugParams> }) {
  const { locale, slug } = await props.params
  const t = await getTranslations({ locale, namespace: 'common' })
  const decodedSlug = !slug ? 'default' : decodeURI(slug[0])

  const findAuthor = (authorSlug: string, locale: Locale): Authors | undefined =>
    allAuthors.find((a) => a.slug.endsWith(`${authorSlug}`) && a.language === locale)

  const currentLocaleAuthor = findAuthor(decodedSlug, locale as Locale)

  const altLangURL: Record<string, string> = {}

  const getFullURL = (locale: Locale, slug: string) =>
    new URL(`${SiteUrlWithBase}/${locale}/about/${slug === 'default' ? '' : slug}`).toString()

  for (const loc of supportedLocales) {
    const authorForThisLanguage =
      loc === locale ? currentLocaleAuthor : findAuthor(decodedSlug, loc) || undefined

    const foundSlugWithoutLocale = authorForThisLanguage?.slug.substring(locale.length + 1)

    if (foundSlugWithoutLocale) {
      const url = getFullURL(loc, foundSlugWithoutLocale)
      altLangURL[loc] = url

      if (loc === SiteConfig.defaultLocale) {
        altLangURL['x-default'] = url
      }
    }
  }
  const displayName = currentLocaleAuthor?.name || ''

  return genPageMetadata({
    title: `${t('about')} ${displayName} | ${t('site_title')}`,
    description: `${t('about')} ${displayName} | ${t('site_title')}`,
    fullUrl: altLangURL[locale],
    locale: locale,
    type: 'profile',
    username: currentLocaleAuthor?.name,
    alternates: {
      languages: altLangURL,
    },
  })
}

export default function Page(props: { params: Promise<AuthorSlugParams> }) {
  const params = use(props.params)
  const { locale, slug } = params
  setRequestLocale(locale)

  const decodedSlug = !slug ? 'default' : decodeURI(slug[0])

  return RenderAuthorPage({ locale: locale as Locale, slug: decodedSlug })
}
