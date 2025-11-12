// Default post layout

import { FooterNavigation, PostHeader } from '@/components/PostLayoutComponents'
import ScrollTop from '@/components/ScrollTop'
import type { PostLayoutProps } from './types'
import { useLocale, useTranslations } from 'next-intl'
import TableOfContents from '@/components/TableOfContents'
import PostDateLocalized from '@/components/PostDateLocalized'
import { Locale } from '@/i18n'

export default function PostLayout({
  authorDetails,
  content,
  children,
  prev,
  next,
  toc,
  lastmod,
}: PostLayoutProps) {
  const { date, title, tags, readingTime } = content
  const locale = useLocale() as Locale
  const t = useTranslations('common')
  const lastMod = t('last_modified')
  return (
    <article className="DefaultPostLayout">
      <ScrollTop />
      <header className="pt-6">
        <PostHeader
          authorDetails={authorDetails}
          date={date}
          title={title}
          readingTime={readingTime}
          tags={tags}
          locale={locale}
        />
      </header>
      <div className="max-w-full grid-rows-[auto_1fr] xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
        <div className="xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
          {/* Main Content */}
          <div className="prose dark:prose-invert pt-6 xl:max-w-none">{children}</div>
          <div className="flex justify-end">
            {lastmod && (
              <span
                aria-label={`${lastMod}`}
                className="my-2 text-sm text-gray-500 dark:text-gray-400"
              >
                {lastMod}
                <PostDateLocalized date={lastmod} />
              </span>
            )}
          </div>
        </div>
        <aside className="mt-6 hidden md:sticky md:top-20 md:col-span-1 md:block">
          {toc && toc.length > 0 && <TableOfContents toc={toc} />}
        </aside>
      </div>
      <footer>
        <div className="flex flex-col text-sm font-medium sm:text-base">
          <FooterNavigation prev={prev} next={next} locale={locale} />
        </div>
      </footer>
    </article>
  )
}
