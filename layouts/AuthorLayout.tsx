// About page

import Image from '@/components/Image'
import { useTranslations } from 'next-intl'
import { AuthorLayoutProps } from './types'
import SocialIcon, { components } from '@/components/social-icons'

export default function AuthorLayout({ children, content }: AuthorLayoutProps) {
  const t = useTranslations('common')
  const {
    name,
    avatar,
    occupation,
    company,
    mail,
    bilibili,
    youtube,
    mastodon,
    x,
    twitter,
    facebook,
    linkedin,
    threads,
    instagram,
    medium,
    bluesky,
    github,
  } = content
  const social = {
    mail,
    bilibili,
    youtube,
    mastodon,
    x,
    twitter,
    facebook,
    linkedin,
    threads,
    instagram,
    medium,
    bluesky,
    github,
  }
  return (
    <article className="divide-y-gray">
      <header className="space-y-2 py-6">
        <h1 className="h1-heading">{t('about') || 'About'}</h1>
      </header>
      {/* Avatar and personal information */}
      <section className="w-full lg:grid lg:grid-cols-3 lg:gap-x-4 lg:pt-6">
        <div className="flex-center flex-col space-y-2">
          {avatar && (
            <Image
              src={avatar}
              alt={name || t('image_of', { title: name })}
              width={128}
              height={128}
              className="m-0 rounded-full object-cover shadow-md"
              showPlaceholder={true}
              loading="eager"
            />
          )}

          <h2 className="text-3xl font-bold">{name}</h2>
          <h3 className="text-muted my-0 text-lg">
            <dt className="sr-only">{t('occupation')}</dt>
            <dd>{occupation}</dd>
          </h3>
          <h3 className="text-muted text-lg">
            <dt className="sr-only">{t('company')}</dt>
            <dd>{company}</dd>
          </h3>
          <div className="text-muted my-2 flex flex-wrap justify-center gap-4 lg:my-0 lg:flex-col lg:items-center lg:gap-2 lg:space-y-2">
            {Object.entries(social)
              .filter((entry): entry is [string, string] => {
                const [, url] = entry
                return typeof url === 'string' && url.trim() !== ''
              })
              .map(([key, url]) => (
                <SocialIcon key={key} kind={key as keyof typeof components} href={url} />
              ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="prose dark:prose-invert border-t border-gray-300 pt-6 lg:col-span-2 lg:border-0 lg:pt-0 dark:border-gray-700">
          {children}
        </div>
      </section>
    </article>
  )
}
