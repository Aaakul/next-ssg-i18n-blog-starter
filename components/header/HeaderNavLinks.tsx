import Link from '../Link'
import { HeaderNavLinksProps } from '../types'

export default function HeaderNavLinks({ linkClassName, locale, links }: HeaderNavLinksProps) {
  return (
    <>
      {links
        .filter((link) => link.href !== '/')
        .map((link) => (
          <Link key={link.title} href={`/${locale}${link.href}`} className={linkClassName}>
            {link.title}
          </Link>
        ))}
    </>
  )
}
