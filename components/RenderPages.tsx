import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from '@/lib/pliny/mdx-components'
import { AuthorLayout } from '@/layouts'
import { Locale } from '@/i18n'
import { notFound } from 'next/navigation'
import { coreContent } from '@/lib/contentlayer-utils'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { useTranslations } from 'next-intl'
import { allCoreContent, sortPosts } from '@/lib/contentlayer-utils'
import { allBlogs } from 'contentlayer/generated'
import { BlogListPageParams } from './types'
import tagDataRaw from '@/app/tag-data.json' with { type: 'json' }
import { SiteConfig } from '@/data/siteConfig.mjs'
import { slug } from 'github-slugger'

const POSTS_PER_PAGE = SiteConfig.postsPerPage
const tagData = tagDataRaw as unknown as {
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

export function getBlogListData({ locale, pageNum, type, decodedTag }: BlogListPageParams) {
  const filteredPosts =
    type === 'tags'
      ? allCoreContent(
          sortPosts(
            allBlogs.filter(
              (post) => post.tags && post.tags.map((t) => slug(t)).includes(decodedTag!)
            )
          )
        ).filter((post) => post.language === locale)
      : allCoreContent(sortPosts(allBlogs)).filter((post) => post.language === locale)

  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNum - 1),
    POSTS_PER_PAGE * pageNum
  )

  const pagination = {
    currentPage: pageNum,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
    basePath: type === 'tags' ? `/${locale}/tags/${decodedTag}` : `/${locale}/blog/list`,
  }

  return {
    initialDisplayPosts,
    pagination,
  }
}

export function RenderBlogListPage({ locale, pageNum, type, decodedTag }: BlogListPageParams) {
  const t = useTranslations('common')
  const listData = getBlogListData({ locale, pageNum, type, decodedTag })
  const title =
    type === 'tags'
      ? decodedTag![0].toUpperCase() + decodedTag!.slice(1).replace(/\s+/g, '-')
      : t('all_posts')
  return (
    <ListLayout
      initialDisplayPosts={listData.initialDisplayPosts}
      pagination={listData.pagination}
      headerTitle={title}
      locale={locale as Locale}
      tagCounts={tagData[locale as Locale]}
    />
  )
}
