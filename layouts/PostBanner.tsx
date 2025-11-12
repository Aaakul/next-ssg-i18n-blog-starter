import Image from '@/components/Image'
import ScrollTop from '@/components/ScrollTop'
import type { PostLayoutProps } from './types'
import { useLocale, useTranslations } from 'next-intl'
import { FooterNavigation, PostHeader } from '@/components/PostLayoutComponents'
import PostDateLocalized from '@/components/PostDateLocalized'
import { Locale } from '@/i18n'

export default function PostBanner({
  authorDetails,
  content,
  next,
  prev,
  children,
  lastmod,
}: PostLayoutProps) {
  const locale = useLocale() as Locale
  const t = useTranslations('common')
  const lastMod = t('last_modified')
  const { title, date, images, readingTime, tags } = content
  const displayImage = images && images.length > 0 ? images[0] : '/static/images/twitter-card.png'
  return (
    <article className="PostBanner no-scrollbar">
      <ScrollTop />
      <div className="mx-auto mt-6 max-w-4xl">
        {/* Banner */}
        <div className="space-y-2 border-gray-200 pb-4 text-center dark:border-gray-700">
          <div className="Banner z-10 w-full">
            <div className="-mx-2">
              <div className="relative aspect-5/2 w-full">
                <Image
                  src={displayImage}
                  alt={`${title} - Banner`}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Post header */}
        <header className="pt-2">
          <PostHeader
            authorDetails={authorDetails}
            date={date}
            title={title}
            readingTime={readingTime}
            tags={tags}
            locale={locale}
          />
        </header>
        {/* Main text */}
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
        {/* Footer Navigation */}
        <footer>
          <div className="flex flex-col text-sm font-medium sm:text-base">
            <FooterNavigation prev={prev} next={next} locale={locale} />
          </div>
        </footer>
      </div>
    </article>
  )
}
