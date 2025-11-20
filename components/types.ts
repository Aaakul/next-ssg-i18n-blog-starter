import type { CoreContent } from '@/lib/contentlayer-utils'
import { Locale } from '@/i18n'
import { ReadTimeResults } from 'reading-time'
import { Authors } from '@/.contentlayer/generated/types'
import type { Action } from 'kbar'
import type React from 'react'

export interface CardProps {
  title: string
  description: string
  imgSrc: string | undefined
  href: string | undefined
}

export interface PostHeaderProps {
  date: string
  title: string
  readingTime: ReadTimeResults
  tags: string[]
  locale: Locale
  authorDetails: CoreContent<Authors>[]
}

export interface HeaderNavLinksProps {
  linkClassName: string
  links: { href: string; title: string }[]
  locale: Locale
  onLinkClick?: () => void
}

export interface MobileNavProps {
  locale: Locale
  links: { href: string; title: string }[]
}

export type BlogListPageParams = {
  locale: Locale
  pageNum: number
  type: 'posts' | 'tags' | 'categories'
  decodedSlug?: string
}

export interface PostListProps {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary?: string
    tags?: string[]
    toc?: [{ value: string; url: string; depth: number }]
  }>
  locale: Locale
  maxDisplay?: number
}

export interface TableOfContentsProps {
  toc: [{ value: string; url: string; depth: number }]
}

export interface TagProps {
  text: string
  locale: Locale
}

export interface FooterNavigationProps {
  prev:
    | {
        path: string
        title: string
      }
    | undefined
  next:
    | {
        path: string
        title: string
      }
    | undefined
  locale: Locale
}

export interface LocaleFallbackModalProps {
  isOpen: boolean
  onClose: () => void
  targetLocale: Locale
  fallbackOptions: {
    locale: Locale
    slug: string
    displayName: string
  }[]
}

export interface KBarSearchProps {
  defaultActions?: Action[]
  onSearchDocumentsLoad?: (json: any) => Action[]
}

export interface LinksPanelProps {
  fieldCount: Record<string, number>
  field: 'tags' | 'categories'
  basePath?: string
  locale: string
  linksPanelClass?: string
}

export interface PaginationButtonProps {
  isEnabled: boolean
  label?: string
  pageLabel?: string | number
  href?: string
  icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  className?: string
  isCurrentPage?: boolean
}

export type RelatedPostsData = {
  path: string
  title: string
}

export interface RelatedPostsProps {
  relatedPosts: RelatedPostsData[]
}
