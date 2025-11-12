import type { Document, MDX } from 'contentlayer2/core'
import { Locale } from '@/i18n'

export type MDXDocument = Document & { body: MDX }
export type MDXDocumentDate = MDXDocument & {
  date: string
}
export type MDXBlog = MDXDocumentDate & {
  tags?: string[]
  draft?: boolean
  toc?: TocItem[]
  summary?: string
  translationKey?: string
  authors?: string[]
}

export type MDXAuthor = MDXDocument & {
  name: string
}

export interface SearchIndexEntry {
  language: Locale
  path: string
  title: string
  keywords: string
  date: string
}

export type TocItem = {
  value: string
  url: string
  depth: number
}

export type Toc = TocItem[]

/**
 * Replace special characters with a single space and reduce extra whitespace
 */
function sanitizeText(text: string): string {
  return text
    .replace(/\p{P}|\p{S}|\p{C}/gu, ' ') // Remove punctuation, symbols and control characters
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/**
 * Generate flattened keywords string from blog posts
 */
function extractKeywords(post: MDXBlog): string {
  const tagText = post.tags?.join(' ') || ''
  const summaryText = post.summary || ''
  const tocText = post.toc?.map((item: TocItem) => item.value).join(' ') || ''
  const translationKey = post.translationKey
  const authors = post.authors?.filter((author) => author != 'default').join(' ') || ''

  const combined = `${tagText} ${summaryText} ${tocText} ${translationKey} ${authors}`
  if (combined.trim() === '') return ''
  const uniqueWords = [...new Set(combined.split(' '))].join(' ') // Remove duplicate words
  return sanitizeText(uniqueWords)
}

/**
 * Generate simplified search index
 */
export function generateSearchIndex(blogs: MDXBlog[]): SearchIndexEntry[] {
  return blogs.map((post) => ({
    language: post.language as Locale,
    path: post.path,
    title: post.title,
    date: post.date,
    keywords: extractKeywords(post),
  }))
}

// from pliny/utils/contentlayer.ts

const isProduction = process.env.NODE_ENV === 'production'

function dateSortDesc(a: string, b: string) {
  const dateA = new Date(a)
  const dateB = new Date(b)
  if (dateA > dateB) return -1
  if (dateA < dateB) return 1
  return 0
}

/**
 * Sorts a list of MDX documents by date in descending order
 *
 * @param {MDXDocumentDate[]} allBlogs
 * @param {string} [dateKey='date']
 * @return {*}
 */
export function sortPosts<T extends MDXDocumentDate>(allBlogs: T[], dateKey: string = 'date') {
  return allBlogs.sort((a, b) => dateSortDesc(a[dateKey], b[dateKey]))
}

/**
 * Kept for backwards compatibility
 * Please use `sortPosts` instead
 * @deprecated
 * @param {MDXBlog[]} allBlogs
 * @return {*}
 */
export function sortedBlogPost(allBlogs: MDXDocumentDate[]) {
  return sortPosts(allBlogs)
}

type ConvertUndefined<T> = OrNull<{
  [K in keyof T as undefined extends T[K] ? K : never]-?: T[K]
}>
type OrNull<T> = { [K in keyof T]: Exclude<T[K], undefined> | null }
type PickRequired<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K]
}
type ConvertPick<T> = ConvertUndefined<T> & PickRequired<T>

/**
 * A typesafe omit helper function
 * @example pick(content, ['title', 'description'])
 *
 * @param {Obj} obj
 * @param {Keys[]} keys
 * @return {*}  {ConvertPick<{ [K in Keys]: Obj[K] }>}
 */
export const pick = <Obj, Keys extends keyof Obj>(
  obj: Obj,
  keys: Keys[]
): ConvertPick<{ [K in Keys]: Obj[K] }> => {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key] ?? null
    return acc
  }, {} as any)
}

/**
 * A typesafe omit helper function
 * @example omit(content, ['body', '_raw', '_id'])
 *
 * @param {Obj} obj
 * @param {Keys[]} keys
 * @return {*}  {Omit<Obj, Keys>}
 */
export const omit = <Obj, Keys extends keyof Obj>(obj: Obj, keys: Keys[]): Omit<Obj, Keys> => {
  const result = Object.assign({}, obj)
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>

/**
 * Omit body, _raw, _id from MDX document and return only the core content
 *
 * @param {T} content
 * @return {*}  {CoreContent<T>}
 */
export function coreContent<T extends MDXDocument>(content: T): CoreContent<T> {
  return omit(content, ['body', '_raw', '_id'])
}

/**
 * Omit body, _raw, _id from a list of MDX documents and returns only the core content
 * If `NODE_ENV` === "production", it will also filter out any documents with draft: true.
 *
 * @param {T[]} contents
 * @return {*}  {CoreContent<T>[]}
 */
export function allCoreContent<T extends MDXDocument>(contents: T[]): CoreContent<T>[] {
  if (isProduction)
    return contents.map((c) => coreContent(c)).filter((c) => !('draft' in c && c.draft === true))
  return contents.map((c) => coreContent(c))
}
