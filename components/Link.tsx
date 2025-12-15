import Link from 'next/link'
import type { LinkProps } from 'next/link'
import React, { AnchorHTMLAttributes, isValidElement } from 'react'
import clsx from 'clsx'

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>

const CustomLink = ({ href, className = '', ...restProps }: Props) => {
  // Normalize href to a string for safe checks
  const hrefStr = typeof href === 'string' ? href : href ? String(href) : ''

  const isAnchorLink = hrefStr.startsWith('#')
  const isInternalLink = hrefStr.startsWith('/') && !isAnchorLink

  // Pull out anchor specific attributes so we can provide sensible defaults
  const { children, target, rel, ...anchorProps } = restProps

  if (isInternalLink) {
    return (
      <Link
        href={href}
        className={clsx('link-hover', 'wrap-break-word', className)}
        prefetch={false} // https://github.com/vercel/next.js/issues/85374
        {...anchorProps}
      >
        {children}
      </Link>
    )
  }

  if (isAnchorLink) {
    return (
      <a
        href={hrefStr}
        className={clsx('link-hover', 'wrap-break-word', className)}
        {...anchorProps}
      >
        {children}
      </a>
    )
  }

  // Show external-link icon class only when the link's only child is not a React component
  let showIconClass = true
  const childArray = React.Children.toArray(children)
  const onlyChild = childArray.length === 1 ? childArray[0] : undefined
  if (onlyChild && isValidElement(onlyChild) && typeof onlyChild.type === 'function') {
    showIconClass = false
  }

  return (
    <a
      href={hrefStr || undefined}
      target={target ?? '_blank'}
      rel={rel ?? 'noopener noreferrer'}
      className={clsx(
        'link-hover',
        'wrap-break-word',
        className,
        showIconClass && 'link-with-icon'
      )}
      {...anchorProps}
    >
      {children}
    </a>
  )
}

export default CustomLink
