import Link from './Link'
import { slug } from 'github-slugger'
import { TagProps } from './types'

const Tag = ({ text, locale }: TagProps) => {
  return (
    <Link
      href={`/${locale}/tags/${slug(text)}`}
      className="text-primary-500 dark:text-primary-600 link-hover mr-2 text-sm uppercase"
    >
      {`# ${text.split(' ').join('-')}`}
    </Link>
  )
}

export default Tag
