import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { writeFileSync } from 'fs'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import { remarkImgToJsx, extractTocHeadings } from './lib/pliny/mdx-plugins'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePrettyCode from 'rehype-pretty-code'
import { SocialBannerPath, SiteUrlWithBase } from './data/siteConfig.mjs'
import { generateSearchIndex, MDXBlog, sortPosts } from './lib/contentlayer-utils'
import { Locale, defaultLocale, supportedLocales } from './i18n'
import { KeySlugMappingData } from '@/app/types'

const isProduction = process.env.NODE_ENV === 'production'

const anchorIcon = fromHtmlIsomorphic(`<span class="content-header-link">#</span>`, {
  fragment: true,
})

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
}

function createItemCount(allBlogs: MDXBlog[], field: string): void {
  const itemCountByLang: Partial<Record<Locale, Record<string, number>>> = {}

  allBlogs.forEach((file) => {
    if (isProduction && file.draft === true) return

    const language: Locale = file.language || defaultLocale
    const items = (file[field] as string[] | undefined) || []

    if (!itemCountByLang[language]) {
      itemCountByLang[language] = {}
    }

    items.forEach((item: string) => {
      const formattedItem = slug(item)
      itemCountByLang[language]![formattedItem] =
        (itemCountByLang[language]![formattedItem] || 0) + 1
    })
  })

  const sortedData: Partial<Record<Locale, Record<string, number>>> = {}

  for (const [lang, itemCounts] of Object.entries(itemCountByLang)) {
    const sortedEntries = Object.entries(itemCounts!).sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB)
    )

    sortedData[lang as Locale] = Object.fromEntries(sortedEntries)
  }

  const outputPath = `./.contentlayer/generated/${field}-data.json`
  try {
    writeFileSync(outputPath, JSON.stringify(sortedData, null, 2))
    console.log(` ✓ ${field} data file generated: ${outputPath}`)
  } catch (error) {
    console.error(` ✗ Failed to write ${field} data file:`, error)
  }
}

function createSearchIndex(allBlogs: MDXBlog[]) {
  const sortedBlogs = sortPosts(allBlogs)
  const searchIndex = generateSearchIndex(sortedBlogs)
  writeFileSync(`./public/search.json`, JSON.stringify(searchIndex, null, 2))
  console.log(' ✓ Local search index generated: ./public/search.json')
}

/**
 * Generates a mapping table for article keys to their slugs in different languages.
 */
function createArticleKeySlugMapping(allBlogs: MDXBlog[]) {
  const articleMap: KeySlugMappingData = {} as KeySlugMappingData
  let hasDuplicates = false

  allBlogs.forEach((doc) => {
    const key = doc.translationKey
    const lang = doc.language as Locale
    const slug = doc.slug

    if (key && lang && slug) {
      if (!articleMap[key]) {
        articleMap[key] = {}
      }

      if (articleMap[key][lang]) {
        hasDuplicates = true
        console.warn(
          ` ⚠️ Found duplicate translationKey-language mapping: ` +
            `translationKey: "${key}", language: "${lang}  " ` +
            `Existing slug: "${articleMap[key][lang]}" Duplicate slug: "${slug}" ` +
            `Please check the frontmatter`
        )
      } else {
        articleMap[key][lang] = slug
      }
    }
  })

  writeFileSync(
    './.contentlayer/generated/key-slug-mapping.json',
    JSON.stringify(articleMap, null, 2)
  )

  if (hasDuplicates) {
    console.warn(' ⚠️ key-slug mapping generated, but duplicate detected')
  } else {
    console.log(' ✓ key-slug mapping generated: ./.contentlayer/generated/key-slug-mapping.json')
  }
}

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    mail: { type: 'string' },
    bilibili: { type: 'string' },
    youtube: { type: 'string' },
    mastodon: { type: 'string' },
    x: { type: 'string' },
    twitter: { type: 'string' },
    facebook: { type: 'string' },
    linkedin: { type: 'string' },
    threads: { type: 'string' },
    instagram: { type: 'string' },
    medium: { type: 'string' },
    bluesky: { type: 'string' },
    github: { type: 'string' },
    language: { type: 'string', required: true },
  },
  computedFields,
}))

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    translationKey: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean', default: false },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' }, default: ['default'] },
    layout: { type: 'string', default: 'PostLayout' },
    language: { type: 'string', default: defaultLocale, enum: supportedLocales },
    isCanonical: { type: 'boolean', default: false },
    categories: { type: 'list', of: { type: 'string' }, default: [] },
    enableComments: { type: 'boolean', default: true },
  },
  computedFields: {
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
    toc: { type: 'json', resolve: (doc) => extractTocHeadings(doc.body.raw) },
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary || doc.title,
        inLanguage: doc.language as Locale,
        image: doc.images ? doc.images[0] : SocialBannerPath,
        url: `${SiteUrlWithBase}/${doc.language}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export default makeSource({
  disableImportAliasWarning: true,
  contentDirPath: 'data',
  documentTypes: [Authors, Blog],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [remarkGfm, remarkMath, remarkImgToJsx, remarkAlert],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          headingProperties: {
            className: ['content-header'],
          },
          content: anchorIcon,
        },
      ],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [
        rehypePrettyCode,
        {
          defaultLang: { block: 'javascript', inline: 'ansi' },
          theme: 'github-dark-default',
        },
      ],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allBlogs } = await importData()
    createItemCount(allBlogs, 'categories')
    createItemCount(allBlogs, 'tags')
    createArticleKeySlugMapping(allBlogs)
    createSearchIndex(allBlogs)
  },
})
