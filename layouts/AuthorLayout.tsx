// About page
import Image from '@/components/Image'
import { useTranslations } from 'next-intl'
import { AuthorLayoutProps } from './types'

export default function AuthorLayout({ children, content }: AuthorLayoutProps) {
  const t = useTranslations('common')
  const { name, avatar, occupation, company, mail, twitter, bluesky, linkedin, github } = content
  return (
    <article className="divide-y-gray m-auto">
      <header className="space-y-2 pt-6 pb-4 md:space-y-4">
        <h1 className="text-3xl font-bold sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          {t('about') || 'About'}
        </h1>
      </header>
      {/* Avatar and personal information */}
      <section className="items-start space-y-2 pt-8 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
        <div className="flex flex-col items-center space-y-4">
          {avatar && (
            <Image
              src={avatar}
              alt={name ? `Avatar of ${name}` : 'User profile image'}
              width={128}
              height={128}
              className="rounded-full object-cover shadow-sm"
            />
          )}
          <h2 className="pt-4 pb-2 text-2xl leading-8 font-bold">{name}</h2>
          <dl className="text-muted">
            <div>
              <dt className="sr-only">{t('occupation')}</dt>
              <dd>{occupation}</dd>
            </div>
            <div>
              <dt className="sr-only">{t('company')}</dt>
              <dd>{company}</dd>
            </div>
            <div>
              <dt className="sr-only">Email</dt>
              <dd>{mail}</dd>
            </div>
            <div>
              <dt className="sr-only">Twitter</dt>
              <dd>{twitter}</dd>
            </div>
            <div>
              <dt className="sr-only">Bluesky</dt>
              <dd>{bluesky}</dd>
            </div>
            <div>
              <dt className="sr-only">Linkedin</dt>
              <dd>{linkedin}</dd>
            </div>
            <div>
              <dt className="sr-only">Github</dt>
              <dd>{github}</dd>
            </div>
          </dl>
        </div>
        {/* Description */}
        <div className="prose dark:prose-invert pb-8 xl:col-span-2 xl:max-w-none">{children}</div>
      </section>
    </article>
  )
}
