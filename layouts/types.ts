import type { CoreContent } from '@/lib/contentlayer-utils'
import type { Authors, Blog } from 'contentlayer/generated'
import type React from 'react'
import { Locale } from '@/i18n'

export interface PostLayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: React.ReactNode
  toc?: [{ value: string; url: string; depth: number }]
  lastmod?: string | undefined
}

export interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
}

export interface ListLayoutProps {
  headerTitle: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  locale: Locale
  tagCounts: Record<string, number>
}

export interface AuthorLayoutProps {
  children: React.ReactNode
  content: CoreContent<Authors>
}

export interface PaginationButtonProps {
  isEnabled: boolean
  label: string
  href?: string
  onClick?: () => void
  icon: React.ComponentType<React.ComponentProps<'svg'>>
}
