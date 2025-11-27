import PostDateLocalized from './PostDateLocalized'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { useTranslations } from 'next-intl'
import Balancer from 'react-wrap-balancer'
import { PostListProps } from './types'

export default function PostList({ posts, locale, maxDisplay }: PostListProps) {
  const displayPosts = maxDisplay ? posts.slice(0, maxDisplay) : posts
  const t = useTranslations('common')

  if (!displayPosts.length) {
    return <p>{t('no_posts_found')}</p>
  }

  return (
    <ul>
      {displayPosts.map((post) => {
        const { slug, date, title, summary, tags, toc, image } = post
        const href = `/${locale}/blog/${slug}`
        return (
          <li key={slug} className="py-4">
            <article>
              {image && <link rel="preload" as="image" href={image} />}
              <div className="xl:grid xl:grid-cols-4">
                <dl className="text-muted text-sm">
                  <dt className="sr-only">{t('published_on') || 'Published on: '}</dt>
                  <dd>
                    <time dateTime={date}>
                      <PostDateLocalized date={date} template="compact" />
                    </time>
                  </dd>
                </dl>
                <div className="xl:col-span-3">
                  <h2 className="text-2xl font-bold">
                    <Link href={href} className="link-hover">
                      <Balancer>{title}</Balancer>
                    </Link>
                  </h2>

                  {tags && tags.length > 0 && (
                    <div
                      className="flex flex-wrap gap-2 py-1"
                      aria-label={`${t('tags')}: ${title}`}
                    >
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} locale={locale} className="text-sm" />
                      ))}
                    </div>
                  )}

                  <div className="text-muted max-w-none py-1 text-sm">
                    {summary ? (
                      <p>{summary}</p>
                    ) : toc?.length ? (
                      <p>
                        {t('in_this_article', {
                          summary: toc
                            .filter((heading) => heading.depth === 1 || heading.depth === 2)
                            .map((heading) => heading.value)
                            .join(' · '),
                        })}
                      </p>
                    ) : (
                      <i>{title}</i>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
