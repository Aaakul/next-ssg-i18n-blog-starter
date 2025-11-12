import { Locale } from '@/i18n'
import { KeySlugMappingData } from '@/app/types'
import keySlugMappingData from '@/app/key-slug-mapping.json' with { type: 'json' }

export function getSlugByLocaleAndKey(postKey: string, targetLocale: Locale): string | undefined {
  const mapping = keySlugMappingData as KeySlugMappingData
  return mapping[postKey as keyof typeof keySlugMappingData]?.[targetLocale]
}

export function getKeyByLocaleAndSlug(postSlug: string, currentLocale: Locale): string | undefined {
  for (const [postKey, locales] of Object.entries(keySlugMappingData as KeySlugMappingData)) {
    if (locales[currentLocale] === postSlug) {
      return postKey
    }
  }

  return undefined
}
