import { Locale } from '@/i18n'
import type React from 'react'

export interface LocaleParams {
  locale: string
}

export type WithLocale<K extends string> = { [_ in K]: string } & LocaleParams
export type TagParams = WithLocale<'tag'>
export type BlogPageParams = WithLocale<'page'>
export type TagPageParams = WithLocale<'tag' | 'page'>

export interface SlugParams extends LocaleParams {
  slug: string[]
}

export interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<LocaleParams>
}

export type KeySlugMappingData = Record<string, Partial<Record<Locale, string>>>
