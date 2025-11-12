import { SiteConfig } from '@/data/siteConfig.mjs'
import getMessageByLocale from '@/lib/locale-message-utils.mjs'
import type { MetadataRoute } from 'next'
import { defaultLocale } from '@/i18n'

export const dynamic = 'force-static'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const defaultTranslations = (await getMessageByLocale(defaultLocale))?.common

  return {
    name: defaultTranslations?.site_title,
    description: defaultTranslations?.site_description,
    start_url: SiteConfig.basePath,
    display: 'standalone',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
