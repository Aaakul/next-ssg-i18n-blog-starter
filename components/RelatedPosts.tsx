import Link from './Link'
import { RelatedPostsProps } from './types'
import { useTranslations } from 'next-intl'

export default function RelatedPosts({ relatedPosts }: RelatedPostsProps) {
  const t = useTranslations('common')
  return (
    <nav className="pt-8 opacity-90">
      <h3 className="mb-4 text-lg font-bold">{t('related_post')}</h3>
      <ul className="flex-1">
        {relatedPosts.map((post) => {
          return (
            <li key={post.title}>
              <Link
                href={`/${post.path}`}
                className="link-hover underline-2 block truncate p-2 text-sm font-semibold"
              >
                {post.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
