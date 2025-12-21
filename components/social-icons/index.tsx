import {
  Mail,
  Github,
  Facebook,
  Youtube,
  Bilibili,
  Linkedin,
  RSS,
  Twitter,
  X,
  Mastodon,
  Threads,
  Instagram,
  Medium,
  Bluesky,
} from './icons'
import { useTranslations } from 'next-intl'

export const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  bilibili: Bilibili,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
  medium: Medium,
  bluesky: Bluesky,
  rss: RSS,
}

export interface SocialIconProps {
  kind: keyof typeof components
  href: string | undefined
  size?: number
}

export default function SocialIcon({ kind, href, size = 6 }: SocialIconProps) {
  const t = useTranslations('common')
  if (!href) return null

  const SocialSvg = components[kind]
  const sizeClass = `size-${size}`

  return (
    <a target="_blank" rel="noopener noreferrer" href={kind === 'mail' ? `mailto:${href}` : href}>
      <span className="sr-only">{t('link_to', { title: kind })}</span>
      <SocialSvg className={`link-hover text-muted fill-current ${sizeClass}`} />
    </a>
  )
}
