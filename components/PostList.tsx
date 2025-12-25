import PostDateLocalized from './PostDateLocalized'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { useTranslations } from 'next-intl'
import Balancer from 'react-wrap-balancer'
import { PostListProps } from './types'
import clsx from 'clsx'

export default function PostList({ posts, locale, maxDisplay, template = 'full' }: PostListProps) {
  const t = useTranslations('common')
  const displayPosts = maxDisplay ? posts.slice(0, maxDisplay) : posts

  if (!displayPosts.length) {
    return (
      <h2>
        <i>{t('no_posts_found')}</i>
      </h2>
    )
  }

  return (
    <ul>
      {displayPosts.map((post) => {
        const { slug, date, title, summary, tags, toc, image } = post
        const href = `/${locale}/blog/${slug}`
        return (
          <li key={slug} className="flow-root py-4">
            <article>
              {image && <link rel="prefetch" as="image" href={image} fetchPriority="low" />}
              <div className="xl:grid xl:grid-cols-4">
                {template === 'full' && (
                  <div className="text-muted flex items-center text-sm">
                    <PostDateLocalized
                      locale={locale}
                      date={date}
                      template="compact"
                      srText={t('published_on')}
                    />
                  </div>
                )}

                <div className="xl:col-span-3">
                  <h2
                    className={clsx('font-bold', template === 'full' ? 'text-2xl' : 'opacity-80')}
                  >
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

                  <div className="text-muted py-1 text-sm">
                    {summary ? (
                      <p>{summary}</p>
                    ) : toc?.length ? (
                      <p>
                        {t('toc_with_contents', {
                          contents: toc
                            .filter((heading) => heading.depth === 1 || heading.depth === 2)
                            .map((heading) => heading.value)
                            .join(' · '),
                        })}
                      </p>
                    ) : (
                      <p>
                        <i>{title}</i>
                      </p>
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
