import Link from '@/components/Link'
import PostDateLocalized from '@/components/PostDateLocalized'
import { ClockIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Tag from '@/components/Tag'
import type React from 'react'
import Balancer from 'react-wrap-balancer'
import { FooterNavigationProps, PostHeaderProps } from './types'

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="h1-heading">
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

  // hide author details if author is default author
  const shouldShowAuthor = authorDetails.length > 1 || !authorDetails[0].slug.endsWith('/default')
  return (
    <div className="flex flex-col gap-y-2 border-b border-gray-200 py-4 md:gap-y-4 dark:border-gray-700">
      {/* Title */}
      <PageTitle>{title}</PageTitle>
      <div className="text-muted flex flex-col gap-y-2 text-sm md:flex-row md:items-center md:gap-x-6 md:gap-y-0 lg:gap-x-8">
        {/* Published Date */}
        <PostDateLocalized locale={locale} date={date} srText={t('published_on')} />

        {/* Authors */}
        {shouldShowAuthor && (
          <div className="flex">
            <span>{t('author_prefix')}</span>
            {authorDetails.map((author, index) => (
              <span key={author.slug} className="link-hover">
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
        )}
      </div>

      {/* Reading Time & Word Count */}
      <div
        className="text-muted flex flex-wrap gap-x-4 gap-y-2 text-sm"
        aria-label={t('reading_time')}
      >
        <div className="flex-center">
          <ClockIcon className="size-4" aria-hidden="true" />
          <span>
            {Math.ceil(readingTime.minutes)} {t('minutes')}
          </span>
        </div>
        <div className="flex-center">
          <LanguageIcon className="size-4" aria-hidden="true" />
          <span>
            {readingTime.words} {t('words')}
          </span>
        </div>
      </div>

      {/* Tags */}
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <Tag key={tag} text={tag} locale={locale} className="text-sm" />
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
  const previous_title = t('prev_post', { title: prev?.title ?? '' })
  const next_title = t('next_post', { title: next?.title ?? '' })
  const linkClass = 'underline-2 link-hover flex focus:ring-2 focus:outline-none'

  return (
    <nav
      aria-label={t('pagination')}
      className="mt-8 self-start text-ellipsis opacity-90 sm:self-auto"
    >
      <ul className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-8 xl:gap-y-8">
        {showPrev && (
          <li>
            <span className="flex gap-x-1">
              &larr;
              <Link
                href={`/${locale}/${prev.path}`}
                className={linkClass}
                aria-label={previous_title}
                title={previous_title}
              >
                {previous_title}
              </Link>
            </span>
          </li>
        )}
        {showNext && (
          <li className="sm:ml-auto">
            <span className="flex gap-x-1">
              <Link
                href={`/${locale}/${next.path}`}
                className={linkClass}
                aria-label={next_title}
                title={next_title}
              >
                <span className="mr-1">{next_title}</span>
              </Link>
              &rarr;
            </span>
          </li>
        )}
      </ul>
    </nav>
  )
}
