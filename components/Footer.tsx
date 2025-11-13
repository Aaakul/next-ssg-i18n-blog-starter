import Link from './Link'
import { SiteConfig } from '@/data/siteConfig.mjs'
import SocialIcon, { components } from '@/components/social-icons'
import { useLocale } from 'next-intl'
import { Locale } from '@/i18n'

export default function Footer({ copyrightText }: { copyrightText: string }) {
  const locale = useLocale() as Locale
  return (
    <footer>
      <div className="bottom-0 mt-auto flex flex-col items-center space-y-1 pt-6 align-middle">
        <div className="flex h-6 items-center space-x-6">
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
        <div className="flex space-x-2 text-center text-sm text-gray-500 dark:text-gray-400">
          <div>{`©`}</div>
          <Link href="/" className="hover:text-primary-500 hover:drop-shadow-xl">
            {copyrightText}
          </Link>
        </div>
        <div className="hover:text-primary-500 mt-0 mb-2 text-sm text-gray-500 hover:drop-shadow-xl dark:text-gray-400">
          <Link href="https://github.com/Aaakul/next-ssg-i18n-blog-starter">
            Made with Next SSG i18n Blog Starter
          </Link>
        </div>
      </div>
    </footer>
  )
}
