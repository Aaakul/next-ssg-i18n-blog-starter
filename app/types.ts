import { Locale } from '@/i18n'
import type React from 'react'

export type LocaleParams = {
  locale: string
}

export type WithLocale<K extends string> = { [_ in K]: string } & LocaleParams
export type TagParams = WithLocale<'tag'>
export type WithOptionalParams<K extends string> = { [_ in K]?: string[] }
export type PostSlugParams = {
  slug: string[]
} & LocaleParams

export type AuthorSlugParams = LocaleParams & WithOptionalParams<'slug'>
export type TagPageParams = TagParams & WithOptionalParams<'page'>
export type CategoriesPageParams = WithLocale<'categories'> & WithOptionalParams<'page'>
export type BlogPageParams = WithLocale<'page'>

export type RootLayoutProps = {
  children: React.ReactNode
  params: Promise<LocaleParams>
}

export type KeySlugMappingData = Record<string, Partial<Record<Locale, string>>>
