import { Metadata } from 'next'
import { SiteConfig, SiteUrlWithBase } from '@/data/siteConfig.mjs'
import { defaultLocale } from '@/i18n'

export interface PageSEOProps {
  title?: string
  description?: string
  image?: string
  locale?: string
  fullUrl?: string
  type?: 'article' | 'website' | 'profile'
  authors?: string[] | string
  publishedTime?: string
  modifiedTime?: string
  username?: string
  [_: string]: unknown
}

export default function genPageMetadata({
  title,
  description,
  locale,
  fullUrl,
  type,
  authors,
  username,
  publishedTime,
  modifiedTime,
  image,
  ...rest
}: PageSEOProps): Metadata {
  return {
    title: title,
    description: description,
    openGraph: {
      authors: type === 'article' ? authors || SiteConfig.defaultAuthorName : null,
      username: type === 'profile' ? username : null,
      title: title,
      description: description,
      siteName: title,
      locale: locale || defaultLocale,
      url: fullUrl ? fullUrl : SiteUrlWithBase,
      type: type || 'website',
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      images: image ? [image] : `${SiteUrlWithBase}${SiteConfig.socialBanner}`,
    },
    alternates: {
      ...rest,
    },
    robots: {
      index: SiteConfig.isAllowRobots,
      follow: SiteConfig.isAllowRobots,
      googleBot: {
        index: SiteConfig.isAllowRobots,
        follow: SiteConfig.isAllowRobots,
      },
    },
    ...rest,
  }
}
