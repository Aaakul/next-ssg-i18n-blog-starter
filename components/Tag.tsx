import Link from './Link'
import { slug } from 'github-slugger'
import { TagProps } from './types'

const Tag = ({ text, locale }: TagProps) => {
  return (
    <Link
      href={`/${locale}/tags/${slug(text)}`}
      className="text-primary-500/90 hover:text-primary-600 dark:hover:text-primary-400 mr-2 text-sm font-medium uppercase"
    >
      {`# ${text.split(' ').join('-')}`}
    </Link>
  )
}

export default Tag
