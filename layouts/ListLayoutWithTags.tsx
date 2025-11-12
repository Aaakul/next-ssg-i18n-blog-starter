import { slug } from 'github-slugger'
import Link from '@/components/Link'
import type { PaginationProps, ListLayoutProps, PaginationButtonProps } from './types'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { PostList } from '@/components/PostList'
import { useTranslations } from 'next-intl'

function PaginationButton({ isEnabled, label, href, icon: Icon }: PaginationButtonProps) {
  const buttonClasses =
    'h-12 w-12 flex items-center justify-center rounded-md ' +
    (isEnabled ? 'hover:text-primary-500 dark:hover:text-primary-400' : 'cursor-default opacity-25')

  if (!isEnabled) {
    return (
      <button className={buttonClasses} disabled aria-disabled aria-label={label}>
        <Icon className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </button>
    )
  }

  return (
    <button className={buttonClasses}>
      <Link
        href={href!}
        rel={label === 'prev_page' ? 'prev' : 'next'}
        aria-label={label}
        className="flex h-full w-full items-center justify-center"
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </Link>
    </button>
  )
}

function Pagination({ totalPages, currentPage, basePath }: PaginationProps) {
  const hasPrevPage = currentPage - 1 > 0
  const hasNextPage = currentPage + 1 <= totalPages
  const t = useTranslations('common')

  return (
    <div className="mx-auto w-full space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between" aria-label={t('pagination')}>
        <PaginationButton
          isEnabled={hasPrevPage}
          label={t('prev_page')}
          href={
            hasPrevPage
              ? currentPage - 1 === 1
                ? basePath
                : `${basePath}/page/${currentPage - 1}`
              : undefined
          }
          icon={ChevronLeftIcon}
        />
        <span className="font-semibold">
          {currentPage} / {totalPages}
        </span>
        <PaginationButton
          isEnabled={hasNextPage}
          label={t('next_page')}
          href={hasNextPage ? `${basePath}/page/${currentPage + 1}` : undefined}
          icon={ChevronRightIcon}
        />
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  headerTitle,
  initialDisplayPosts = [],
  pagination,
  locale,
  tagCounts,
}: ListLayoutProps) {
  const t = useTranslations('common')
  return (
    <main className="PostsListWithTagsPanel pt-6">
      <header>
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          {headerTitle}
        </h1>
      </header>
      <div className="flex sm:space-x-12">
        {/* sider */}
        <aside className="sticky hidden h-full w-72 rounded-lg p-4 shadow-md md:top-20 md:block dark:bg-gray-900/90">
          <ul className="tag-list flex flex-col">
            {Object.keys(tagCounts).map((tag: keyof typeof tagCounts) => {
              return (
                <li key={tag} className="w-full">
                  {pagination?.basePath &&
                  decodeURI(pagination.basePath.split(`/tags/`)[1]) === slug(tag) ? (
                    <span className="text-primary-500 block truncate px-2 py-2 font-bold uppercase">
                      {`${tag} (${tagCounts[tag]})`}
                    </span>
                  ) : (
                    <Link
                      href={`/${locale}/tags/${slug(tag)}`}
                      className="hover:text-primary-500 dark:hover:text-primary-500 block truncate px-2 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                      aria-label={t('view_posts_tagged', { tag: tag })}
                    >
                      {`${tag} (${tagCounts[tag]})`}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </aside>
        {/* Post list */}
        <section className="w-full">
          <PostList posts={initialDisplayPosts} locale={locale} />
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              basePath={pagination.basePath}
            />
          )}
        </section>
      </div>
    </main>
  )
}
