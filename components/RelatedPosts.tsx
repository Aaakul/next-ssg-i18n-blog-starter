import { RelatedPostsProps } from './types'
import PostList from './PostList'
import { useTranslations } from 'next-intl'

export default function RelatedPosts({ relatedPosts, locale }: RelatedPostsProps) {
  const t = useTranslations('common')
  return (
    <nav className="pt-4 pb-2">
      <h3 className="text-lg font-bold opacity-80">{t('related_post')}</h3>
      <PostList posts={relatedPosts} locale={locale} template="compact" />
    </nav>
  )
}
