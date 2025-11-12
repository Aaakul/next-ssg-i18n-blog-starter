import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'

const CustomLink = ({
  href,
  className,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isAnchorLink = href ? href.startsWith('#') : false

  const isInternalLink = href ? href.startsWith('/') && !isAnchorLink : false

  if (isInternalLink) {
    return (
      <Link
        href={href}
        className={className ? `wrap-break-word ${className}` : 'wrap-break-word'}
        prefetch={false} // https://github.com/vercel/next.js/issues/85374
        {...rest}
      />
    )
  }

  if (isAnchorLink) {
    return (
      <a
        href={href}
        className={className ? `wrap-break-word ${className}` : 'wrap-break-word'}
        {...rest}
      />
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? `wrap-break-word ${className}` : 'wrap-break-word'}
      {...rest}
    />
  )
}

export default CustomLink
