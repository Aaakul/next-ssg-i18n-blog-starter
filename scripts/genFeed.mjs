import { Feed } from 'feed'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { allAuthors, allBlogs } from '../.contentlayer/generated/index.mjs'
import { SiteConfig, SiteUrlWithBase } from '../data/siteConfig.mjs'
import getMessageByLocale from '../lib/locale-message-utils.mjs'

export default async function generateFeeds() {
  const locales = Object.keys(SiteConfig.localeDisplayNames)

  const postsByLocale = locales.reduce((acc, locale) => {
    acc[locale] = allBlogs
      .filter((post) => !post.draft)
      .filter((post) => post.language === locale)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    return acc
  }, {})

  for (const locale of locales) {
    const message = (await getMessageByLocale(locale))?.common // todo
    if (!message) {
      console.warn(`⚠️ No 'common' field in messages for locale: ${locale}`)
      continue
    }
    const posts = postsByLocale[locale]

    if (!posts || posts.length === 0) {
      console.warn(`⚠️ No published posts found for locale: ${locale}`)
      return
    }

    const feedBaseUrl = `${SiteUrlWithBase}/${locale}`
    const feedPath = (path) => `${feedBaseUrl}${path}`

    const feed = new Feed({
      title: message?.site_title,
      description: message?.site_description,
      id: feedBaseUrl,
      link: feedBaseUrl,
      favicon: `${SiteUrlWithBase}/favicon.ico`,
      copyright: `Copyright © ${new Date().getFullYear()} ${message?.site_title}`,
      feedLinks: {
        rss2: feedPath('/feed.xml'),
        json: feedPath('/feed.json'),
        atom: feedPath('/atom.xml'),
      },
      updated: new Date(posts[0].lastmod || posts[0].date),
    })

    posts.forEach((post) => {
      const postUrl = `/blog/${post.slug}`
      const fullPostUrl = feedPath(postUrl)

      const authorList = post.authors || ['default']

      const authors = authorList
        .map((slug) => {
          const author = allAuthors.find(
            (a) =>
              a.slug === `${locale}/${slug}` ||
              a.slug === `${slug}` ||
              a.slug === `${SiteConfig.defaultLocale}/${slug}`
          )
          if (!author) return null

          return {
            name: author.name,
          }
        })
        .filter(Boolean)

      const feedAuthors =
        authors.length > 0
          ? authors
          : [
              {
                name: SiteConfig.defaultAuthorName,
              },
            ]

      feed.addItem({
        id: fullPostUrl,
        title: post.title,
        link: fullPostUrl,
        description: post.summary || post.title,
        author: feedAuthors,
        contributor: feedAuthors,
        date: new Date(post.date),
        published: new Date(post.date),
        category: post.tags.map((tag) => ({ name: tag })),
      })
    })
    const baseDir = 'out'
    const outDir = join(process.cwd(), baseDir, locale)
    mkdirSync(outDir, { recursive: true })

    writeFileSync(join(outDir, 'feed.xml'), feed.rss2())
    writeFileSync(join(outDir, 'atom.xml'), feed.atom1())
    writeFileSync(join(outDir, 'feed.json'), feed.json1())

    console.log(`✓ Generated RSS feeds for locale ${locale}: ${outDir}`)
  }
}

if (SiteConfig.isGenRSS) {
  await generateFeeds()
} else {
  console.log('RSS feed generate is skipped as SiteConfig.isGenRSS is not "true"')
}
