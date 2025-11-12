import ScrollTop from '@/components/ScrollTop'
import { useLocale, useTranslations } from 'next-intl'
import { PostLayoutProps } from './types'
import { FooterNavigation, PostHeader } from '@/components/PostLayoutComponents'
import PostDateLocalized from '@/components/PostDateLocalized'
import { Locale } from '@/i18n'

export default function PostLayout({
  content,
  next,
  prev,
  children,
  lastmod,
  authorDetails,
}: PostLayoutProps) {
  const locale = useLocale() as Locale
  const t = useTranslations('common')
  const lastMod = t('last_modified')
  const { date, title, readingTime, tags } = content

  return (
    <article className="PostSimple">
      <ScrollTop />
      <header className="pt-6">
        <PostHeader
          date={date}
          title={title}
          readingTime={readingTime}
          tags={tags}
          locale={locale}
          authorDetails={authorDetails}
        />
      </header>

      <div className="prose dark:prose-invert pt-6 xl:max-w-none">{children}</div>
      <div className="flex justify-end">
        {lastmod && (
          <span aria-label={`${lastMod}`} className="my-2 text-sm text-gray-500 dark:text-gray-400">
            {lastMod}
            <PostDateLocalized date={lastmod} />
          </span>
        )}
      </div>

      <footer>
        <div className="flex flex-col text-sm font-medium sm:text-base">
          <FooterNavigation prev={prev} next={next} locale={locale} />
        </div>
      </footer>
    </article>
  )
}
