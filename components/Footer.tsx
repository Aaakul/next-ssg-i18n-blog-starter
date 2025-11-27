import Link from './Link'
import { SiteConfig } from '@/data/siteConfig.mjs'
import SocialIcon, { components } from '@/components/social-icons'
import { useLocale } from 'next-intl'
import { Locale } from '@/i18n'

export default function Footer({ copyrightText }: { copyrightText: string }) {
  const locale = useLocale() as Locale
  return (
    <footer className="w-full pt-6 pb-2">
      <div className="mx-auto max-w-6xl px-2">
        <div className="flex-center bottom-0 flex-col space-y-2 align-middle">
          <div className="flex-center h-6 space-x-6">
            {Object.entries(SiteConfig.social)
              .filter(([_, url]) => url && typeof url === 'string' && url.trim() !== '')
              .map(([key, url]) => (
                <SocialIcon key={key} kind={key as keyof typeof components} href={url} />
              ))}
            {SiteConfig.isGenRSS && (
              <SocialIcon
                key={'rss'}
                kind={'rss'}
                href={`${SiteConfig.basePath}/${locale}/atom.xml`}
              />
            )}
          </div>
          <div className="text-muted flex space-x-2 text-sm">
            <Link href="/" className="link-hover">
              {`© `}
              {copyrightText}
            </Link>
          </div>
          <div className="text-muted text-sm">
            <Link
              href="https://github.com/Aaakul/next-ssg-i18n-blog-starter"
              className="link-hover"
            >
              Made with <strong>Next SSG i18n Blog Starter</strong>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
