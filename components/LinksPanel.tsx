import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Link from './Link'
import { slug } from 'github-slugger'
import { LinksPanelProps } from './types'

const FIELD_TAGS = 'tags' as const
const FIELD_CATEGORIES = 'categories' as const

export default function LinksPanel({
  fieldCount,
  basePath,
  locale,
  linksPanelClass,
  field,
}: LinksPanelProps) {
  const t = useTranslations('common')
  const title =
    field === FIELD_TAGS
      ? t('featured_tags')
      : field === FIELD_CATEGORIES
        ? t('categories')
        : undefined

  const getAriaLabel = (item: string): string | undefined => {
    if (field === FIELD_TAGS) {
      return t('view_posts_tagged', { tag: item })
    }
    if (field === FIELD_CATEGORIES) {
      return t('view_posts_categorized', { category: item })
    }
    return undefined
  }

  const isActiveLink = (item: string): boolean => {
    if (!basePath) return false

    let pathSegmentToCheck
    try {
      const parts = basePath.split(`/${field}/`)
      if (parts.length > 1) {
        pathSegmentToCheck = parts[1]
      } else {
        return false
      }
    } catch (e) {
      console.warn(`Invalid basePath format for active link check: ${basePath}`, e)
      return false
    }

    if (!pathSegmentToCheck) return false

    try {
      const decodedPathSegment = decodeURIComponent(pathSegmentToCheck)
      const itemSlug = slug(item)
      return decodedPathSegment === itemSlug
    } catch (decodeError) {
      console.error(`Failed to decode path segment: ${pathSegmentToCheck}`, decodeError)
      return false
    }
  }

  return (
    <aside
      className={clsx('bg-default rounded-lg drop-shadow-md ring-inset lg:pt-6', linksPanelClass)}
    >
      {title && <h3 className="text-md mb-4 px-2 font-bold">{title}</h3>}
      <ul className="tag-list grid grid-cols-2 gap-0 md:grid-cols-3 lg:grid-cols-1">
        {fieldCount &&
          Object.keys(fieldCount).map((item) => {
            const count = fieldCount[item]
            const isCurrentItemActive = isActiveLink(item)
            return (
              <li key={item} className="w-full">
                {isCurrentItemActive ? (
                  <span
                    className="text-primary-500 block truncate px-2 py-2 font-bold uppercase"
                    aria-current="page"
                  >
                    {`${item} (${count})`}
                  </span>
                ) : (
                  <Link
                    href={`/${locale}/${field}/${slug(item)}`}
                    className="link-hover text-muted block truncate p-2 text-sm font-semibold uppercase"
                    aria-label={getAriaLabel(item)}
                  >
                    {`${item} (${count})`}
                  </Link>
                )}
              </li>
            )
          })}
      </ul>
    </aside>
  )
}
