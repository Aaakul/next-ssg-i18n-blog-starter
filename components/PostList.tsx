import PostDateLocalized from './PostDateLocalized'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { useTranslations } from 'next-intl'
import Balancer from 'react-wrap-balancer'
import { PostListProps } from './types'

export function PostList({ posts, locale, maxDisplay }: PostListProps) {
  const displayPosts = maxDisplay ? posts.slice(0, maxDisplay) : posts
  const t = useTranslations('common')

  if (!displayPosts.length) {
    return <p>{t('no_posts_found')}</p>
  }

  return (
    <ul className="space-y-4">
      {displayPosts.map((post) => {
        const { slug, date, title, summary, tags, toc } = post
        const href = `/${locale}/blog/${slug}`
        return (
          <li key={slug} className="py-4">
            <article>
              <div className="space-y-2 xl:grid xl:grid-cols-4">
                <dl className="text-sm text-gray-500 dark:text-gray-400">
                  <dt className="sr-only">{t('published_on') || 'Published on: '}</dt>
                  <dd>
                    <time dateTime={date}>
                      <PostDateLocalized date={date} template="compact" />
                    </time>
                  </dd>
                </dl>
                <div className="xl:col-span-3">
                  <h2 className="text-2xl leading-8 font-bold">
                    <Link
                      href={href}
                      className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center text-gray-900 dark:text-gray-100"
                    >
                      <Balancer>{title}</Balancer>
                    </Link>
                  </h2>

                  {tags && tags.length > 0 && (
                    <div
                      className="my-1 flex flex-wrap gap-2"
                      aria-label={`${t('tags')}: ${title}`}
                    >
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} locale={locale} />
                      ))}
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none text-gray-500 dark:text-gray-400">
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
