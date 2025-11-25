import Link from './Link'
import { slug } from 'github-slugger'
import { TagProps } from './types'

const Tag = ({ text, locale, rest, className }: TagProps) => {
  return (
    <Link
      href={`/${locale}/tags/${slug(text)}`}
      className={`text-muted link-hover underline-2 mr-2 rounded-xl uppercase ${className}`}
      {...rest}
    >
      {`# ${text.split(' ').join('-')}`}
    </Link>
  )
}

export default Tag
