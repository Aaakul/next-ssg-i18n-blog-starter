// Default post layout

import { FooterNavigation, PostHeader } from '@/components/PostLayoutComponents'
import type { PostLayoutProps } from './types'
import { useLocale, useTranslations } from 'next-intl'
import TableOfContents from '@/components/TableOfContents'
import PostDateLocalized from '@/components/PostDateLocalized'
import { Locale } from '@/i18n'
import Image from '@/components/Image'
import RelatedPosts from '@/components/RelatedPosts'

export default function PostLayout({
  authorDetails,
  content,
  children,
  prev,
  next,
  toc,
  lastmod,
  relatedPosts,
}: PostLayoutProps) {
  const { date, title, tags, readingTime, images } = content
  const locale = useLocale() as Locale
  const t = useTranslations('common')
  const lastMod = t('last_modified')
  const displayImage = images && images.length > 0 ? images[0] : undefined

  return (
    <article className="post-layout pt-6">
      <header>
        {displayImage && (
          <div className="banner relative z-10 mb-2 aspect-5/2">
            <Image
              src={displayImage}
              alt={t('image_of', { title })}
              fill
              className="rounded-xl object-cover"
              loading="lazy"
            />
          </div>
        )}
        <PostHeader
          authorDetails={authorDetails}
          date={date}
          title={title}
          readingTime={readingTime}
          tags={tags}
          locale={locale}
        />
      </header>
      <div className="w-full lg:grid lg:grid-cols-4 lg:gap-x-6">
        <div className="divide-y-gray lg:col-span-3 lg:row-span-2">
          {/* Main Content */}
          <div className="prose dark:prose-invert max-w-none pt-6">{children}</div>
          <div className="flex justify-end">
            {lastmod && (
              <span aria-label={`${lastMod}`} className="text-muted my-2 text-sm">
                {lastMod}
                <PostDateLocalized date={lastmod} />
              </span>
            )}
          </div>
        </div>
        {toc && toc.length > 0 && <TableOfContents toc={toc} />}
      </div>
      {relatedPosts && relatedPosts.length > 0 && <RelatedPosts relatedPosts={relatedPosts} />}
      <footer>
        <div className="flex flex-col text-base font-semibold">
          <FooterNavigation prev={prev} next={next} locale={locale} />
        </div>
      </footer>
    </article>
  )
}
