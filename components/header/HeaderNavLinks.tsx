'use client'

import Link from '../Link'
import { HeaderNavLinksProps } from '../types'

export default function HeaderNavLinks({
  linkClassName,
  locale,
  links,
  onLinkClick,
}: HeaderNavLinksProps) {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.title}
          href={`/${locale}${link.href}`}
          className={linkClassName}
          onClick={() => {
            onLinkClick?.()
          }}
        >
          {link.title}
        </Link>
      ))}
    </>
  )
}
