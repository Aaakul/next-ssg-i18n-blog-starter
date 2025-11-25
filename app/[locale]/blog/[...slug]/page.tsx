import { use } from 'react'
import 'katex/dist/katex.css'
import '@/styles/post.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from '@/lib/pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from '@/lib/contentlayer-utils'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import { PostLayout } from '@/layouts'
import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { Locale, supportedLocales } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import genPageMetadata from '@/lib/seo'
import { PostSlugParams } from '@/app/types'
import { getSlugByLocaleAndKey } from '@/lib/key-slug-utils'
import { findRelatedPosts } from '@/lib/posts-filter-utils'

const defaultLayout = 'PostLayout' as const
const layouts = {
  PostLayout,
} as const

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale: Locale) =>
    allBlogs
      .filter((post) => post.language === locale)
      .map((post) => ({
        locale: locale,
        slug: post.slug.split('/').map((name) => decodeURI(name)),
      }))
  )
}

export async function generateMetadata(props: { params: Promise<PostSlugParams> }) {
  const { locale, slug } = await props.params
  const decodedSlug = decodeURI(slug.join('/'))

  const post = allBlogs
    .filter((post) => post.language === locale)
    .find((p) => p.slug === decodedSlug)

  if (!post) {
    return
  }

  const authorList = post.authors || ['default']

  const authorDetails = authorList.map((author) => {
    const authorAltUrl = allAuthors.find((a) => a.slug === `${locale}/${author}`)
    return coreContent(authorAltUrl as Authors)
  })
  const authors = authorDetails.map((author) => author.name)

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()

  const title = post.title
  const description = !post.summary ? title : post.summary
  const getFullURL = (locale: Locale, slug: string) =>
    new URL(`${SiteUrlWithBase}/${locale}/blog/${slug}`).toString()

  const altLangURL: Record<string, string> = {}
  if (post.isCanonical) altLangURL['x-default'] = getFullURL(locale as Locale, decodedSlug)

  const getAltLangSlug = (locale: Locale) => getSlugByLocaleAndKey(post.translationKey, locale)

  if (!getAltLangSlug(post.language as Locale)) {
    return
  }

  for (const locale of supportedLocales) {
    const altLangSlug = getAltLangSlug(locale as Locale)
    if (altLangSlug) {
      altLangURL[locale] = getFullURL(locale, altLangSlug)
    }
  }

  const t = await getTranslations({ locale, namespace: 'common' })

  return genPageMetadata({
    title: `${title} | ${t('site_title')}`,
    description: description,
    locale: locale,
    type: 'article',
    fullUrl: getFullURL(locale as Locale, decodedSlug),
    publishedTime: publishedAt,
    modifiedTime: modifiedAt,
    authors: authors.length > 0 ? authors : [SiteConfig.defaultAuthorName],
    alternates: {
      languages: altLangURL,
    },
  })
}

export default function Page(props: { params: Promise<PostSlugParams> }) {
  const params = use(props.params)
  const { locale, slug } = params
  setRequestLocale(locale)
  const decodedSlug = decodeURI(slug.join('/'))

  const sortedCoreContents = allCoreContent(sortPosts(allBlogs)).filter(
    (post) => post.language === locale
  )

  const postIndex = sortedCoreContents.findIndex((post) => post.slug === decodedSlug)

  if (postIndex === -1) {
    notFound()
  }

  const post = allBlogs.find((post) => post.slug === decodedSlug) as Blog
  const relatedPosts = findRelatedPosts(sortPosts(allBlogs), post)
  const mainContent = coreContent(post)
  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorAltUrl = allAuthors.find((a) => a.slug === `${locale}/${author}`)
    return coreContent(authorAltUrl as Authors)
  })

  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => ({
    '@type': 'Person',
    name: author.name,
  }))

  type LayoutKey = keyof typeof layouts
  const layoutKey: LayoutKey =
    post.layout && post.layout in layouts ? (post.layout as LayoutKey) : defaultLayout
  const Layout = layouts[layoutKey]

  const isWrongDisqusJSConfig = !process.env.DISQUS_SHORT_NAME || !process.env.DISQUS_API_KEY

  const showComments = SiteConfig.isEnableDisqusJS && post.enableComments && !isWrongDisqusJSConfig

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        lastmod={post.lastmod}
        next={next}
        prev={prev}
        toc={post.toc}
        relatedPosts={relatedPosts}
        showComments={showComments}
      >
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
