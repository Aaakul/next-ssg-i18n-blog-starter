import type { CoreContent, Toc } from '@/lib/contentlayer-utils'
import type { Authors, Blog } from 'contentlayer/generated'
import type React from 'react'
import { Locale } from '@/i18n'

export interface PostLayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: React.ReactNode
  toc?: Toc
  lastmod?: string | undefined
  relatedPosts: CoreContent<Blog>[]
  showComments: boolean
}

export interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
}

export interface ListLayoutProps {
  header?: React.ReactNode
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  locale: Locale
  tagCount: Record<string, number>
  categoryCount: Record<string, number>
}

export interface AuthorLayoutProps {
  children: React.ReactNode
  content: CoreContent<Authors>
}
