// Default post layout
import { FooterNavigation, PostHeader } from '@/components/PostLayoutComponents'
import type { PostLayoutProps } from './types'
import { useLocale, useTranslations } from 'next-intl'
import TableOfContents from '@/components/TableOfContents'
import PostDateLocalized from '@/components/PostDateLocalized'
import { Locale } from '@/i18n'
import Image from '@/components/Image'
import RelatedPosts from '@/components/RelatedPosts'
import Comment from '@/components/Comment'

export default function PostLayout({
  authorDetails,
  content,
  children,
  prev,
  next,
  toc,
  lastmod,
  relatedPosts,
  showComments,
}: PostLayoutProps) {
  const { date, title, tags, readingTime, image } = content
  const locale = useLocale() as Locale
  const t = useTranslations('common')
  const lastMod = t('last_modified')

  return (
    <article className="post-layout">
      <header className="pt-4">
        {image && (
          <div className="banner relative mt-4 mb-2 aspect-5/2 overflow-hidden rounded-xl drop-shadow-md ring-inset">
            <Image
              src={image}
              alt={t('image_of', { title })}
              className="h-full w-full rounded-xl object-cover"
              loading="eager"
              fetchPriority="high"
              showPlaceholder={true}
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
          <div className="prose dark:prose-invert max-w-full py-4">{children}</div>
          <div className="flex justify-end">
            {lastmod && (
              <span className="text-muted my-4 text-sm">
                {lastMod}
                <PostDateLocalized locale={locale} date={lastmod} />
              </span>
            )}
          </div>
        </div>
        {toc && toc.length > 0 && <TableOfContents toc={toc} />}
      </div>
      {relatedPosts && relatedPosts.length > 0 && (
        <RelatedPosts relatedPosts={relatedPosts} locale={locale} />
      )}
      <footer>
        <div className="flex flex-col text-base font-semibold">
          <FooterNavigation prev={prev} next={next} locale={locale} />
        </div>
        {showComments && (
          <div className="my-12 min-h-171 rounded-2xl bg-white p-4 drop-shadow-md ring-inset sm:min-h-127.25 dark:bg-gray-900">
            <Comment
              shortname={process.env.DISQUS_SHORT_NAME as string}
              siteName={process.env.DISQUS_SITE_NAME}
              api={process.env.DISQUS_API_URL}
              apikey={process.env.DISQUS_API_KEY as string}
              admin={process.env.DISQUS_ADMIN_NAME}
              adminLabel={process.env.DISQUS_ADMIN_LABEL}
            />
          </div>
        )}
      </footer>
    </article>
  )
}
