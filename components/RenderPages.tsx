import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from '@/lib/pliny/mdx-components'
import { AuthorLayout } from '@/layouts'
import { Locale } from '@/i18n'
import { notFound } from 'next/navigation'
import { coreContent } from '@/lib/contentlayer-utils'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from '@/lib/contentlayer-utils'
import { allBlogs } from 'contentlayer/generated'
import { BlogListPageParams } from './types'
import tagsDataRaw from '@/.contentlayer/generated/tags-data.json' with { type: 'json' }
import categoriesDataRaw from '@/.contentlayer/generated/categories-data.json' with { type: 'json' }
import { SiteConfig } from '@/data/siteConfig.mjs'
import { slug } from 'github-slugger'

const POSTS_PER_PAGE = SiteConfig.postsPerPage
const tagsData = tagsDataRaw as unknown as {
  [_ in Locale]: Record<string, number>
}
const categoriesData = categoriesDataRaw as unknown as {
  [_ in Locale]: Record<string, number>
}

export function RenderAuthorPage({ locale, slug }: { locale: Locale; slug: string }) {
  const author = allAuthors.find((a) => a.slug.endsWith(`/${slug}`) && a.language === locale) as
    | Authors
    | undefined

  if (!author) {
    return notFound()
  }

  const mainContent = coreContent(author)

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}

export function getBlogListData({ locale, pageNum, type, decodedSlug }: BlogListPageParams) {
  let filteredPosts = allCoreContent(sortPosts(allBlogs)).filter((post) => post.language === locale)

  if (type === 'categories') {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.categories && post.categories.some((category) => slug(category) === decodedSlug)
    )
  } else if (type === 'tags') {
    filteredPosts = filteredPosts.filter(
      (post) => post.tags && post.tags.some((tag) => slug(tag.toLowerCase()) === decodedSlug)
    )
  }

  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNum - 1),
    POSTS_PER_PAGE * pageNum
  )

  const pagination = {
    currentPage: pageNum,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
    basePath:
      type === 'tags'
        ? `/${locale}/tags/${decodedSlug}`
        : type === 'categories'
          ? `/${locale}/categories/${decodedSlug}`
          : `/${locale}`,
  }

  return {
    initialDisplayPosts,
    pagination,
  }
}

export function RenderBlogListPage({
  locale,
  pageNum,
  type,
  decodedSlug,
  header,
}: BlogListPageParams) {
  const listData = getBlogListData({ locale, pageNum, type, decodedSlug })

  const tagsForThisLocaleEntries = Object.entries(tagsData[locale as Locale]) || []
  const filteredTagsEntries =
    tagsForThisLocaleEntries.length <= 10
      ? tagsForThisLocaleEntries
      : tagsForThisLocaleEntries.filter(([_tag, count]) => count > 1).slice(0, 10)

  return (
    <ListLayout
      initialDisplayPosts={listData.initialDisplayPosts}
      pagination={listData.pagination}
      header={header}
      locale={locale as Locale}
      categoryCount={categoriesData[locale as Locale]}
      tagCount={Object.fromEntries(filteredTagsEntries)}
    />
  )
}
