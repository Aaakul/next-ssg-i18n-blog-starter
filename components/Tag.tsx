import Link from './Link'
import { slug } from 'github-slugger'
import { TagProps } from './types'

const Tag = ({ text, locale, rest, className }: TagProps) => {
  return (
    <Link
      href={`/${locale}/tags/${slug(text)}`}
      className={`text-primary-500 dark:text-primary-600 link-hover mr-2 uppercase ${className}`}
      {...rest}
    >
      {`# ${text.split(' ').join('-')}`}
    </Link>
  )
}

export default Tag
