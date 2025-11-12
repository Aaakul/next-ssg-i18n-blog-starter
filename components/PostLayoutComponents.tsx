import Link from '@/components/Link'
import PostDateLocalized from '@/components/PostDateLocalized'
import { ClockIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Tag from '@/components/Tag'
import type React from 'react'
import Balancer from 'react-wrap-balancer'
import { FooterNavigationProps, PostHeaderProps } from './types'

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl leading-10 font-bold text-gray-900 sm:text-4xl md:text-5xl md:leading-14 dark:text-gray-100">
      <Balancer>{children}</Balancer>
    </h1>
  )
}
export function PostHeader({
  date,
  title,
  readingTime,
  tags,
  locale,
  authorDetails,
}: PostHeaderProps) {
  const t = useTranslations('common')
  return (
    <div className="space-y-1 border-b border-gray-200 pb-4 md:space-y-2 dark:border-gray-700">
      <div className="flex flex-col items-center justify-center gap-1 md:flex-row md:gap-2">
        {/* Published Date */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <dl className="sr-only">
            <dt>{t('published_on') || 'Published on: '}</dt>
            <dd>{date}</dd>
          </dl>
          <PostDateLocalized date={date} />
        </div>

        {/* Authors */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span>{t('author_prefix')}</span>
          {authorDetails.map((author, index) => (
            <span key={author.slug} className="hover:text-primary-600 dark:hover:text-primary-400">
              <Link
                href={
                  author.slug?.endsWith('/default')
                    ? `/${locale}/about`
                    : `/${locale}/about/${author.slug?.split('/')[1]}`
                }
              >
                {author.name}
              </Link>
              {index < authorDetails.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <PageTitle>{title}</PageTitle>
      </div>

      {/* Reading Time & Word Count */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-4" aria-hidden="true" />
          <span>
            {Math.ceil(readingTime.minutes)} {t('minutes')}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <LanguageIcon className="w-4" aria-hidden="true" />
          <span>
            {readingTime.words} {t('words')}
          </span>
        </div>
      </div>

      {/* Tags */}
      {tags && (
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((tag: string) => (
            <Tag key={tag} text={tag} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FooterNavigation({ prev, next, locale }: FooterNavigationProps) {
  const t = useTranslations('common')
  const showPrev = prev && prev.path
  const showNext = next && next.path

  if (!showPrev && !showNext) return null
  const previous_title =
    t('prev_post', { title: prev?.title ?? '' }) || `Previous post: ${prev?.title ?? ''}`
  const next_title =
    t('next_post', { title: next?.title ?? '' }) || `Next post: ${next?.title ?? ''}`

  return (
    <nav aria-label={t('pagination')} className="mt-8 self-start text-ellipsis sm:self-auto">
      <ul className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-8 xl:gap-y-8">
        {showPrev && (
          <li>
            <Link
              href={`/${locale}/${prev.path}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center focus:rounded focus:ring-2 focus:outline-none"
              aria-label={previous_title}
              title={previous_title}
            >
              &larr; <span className="ml-1">{prev.title}</span>
            </Link>
          </li>
        )}
        {showNext && (
          <li className="sm:ml-auto">
            <Link
              href={`/${locale}/${next.path}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center focus:rounded focus:ring-2 focus:outline-none"
              aria-label={next_title}
              title={next_title}
            >
              <span className="mr-1">{next.title}</span> &rarr;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
