import clsx from 'clsx'
import Image from './Image'
import Link from './Link'
import { CardProps } from './types'
import { useTranslations } from 'next-intl'

const Card = ({ title, description, imgSrc, href }: CardProps) => {
  const t = useTranslations('common')
  const renderContent = () => (
    <div className="p-6">
      <h2 className="mb-3 text-2xl font-bold">
        {href ? (
          <Link href={href} aria-label={t('link_to', { title })}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      <p className="text-muted mb-3">{description}</p>
    </div>
  )

  const renderImage = () => {
    if (!imgSrc) return null

    const imageProps = {
      alt: title,
      src: imgSrc,
      className: 'object-cover object-center',
      width: 544,
      height: 306,
      showPlaceholder: true,
      loading: 'eager' as const,
      fetchPriority: 'high' as const,
    }

    return href ? (
      <Link href={href} aria-label={t('link_to', { title })}>
        <Image {...imageProps} alt={t('image_of', { title })} />
      </Link>
    ) : (
      <Image {...imageProps} alt={t('image_of', { title })} />
    )
  }

  return (
    <div className="max-w-4xl p-4">
      <div
        className={clsx(
          imgSrc && 'h-full',
          'bg-default',
          'overflow-hidden rounded-lg drop-shadow-md ring-inset'
        )}
      >
        {imgSrc && (
          <div className="relative aspect-video h-full w-full overflow-hidden">{renderImage()}</div>
        )}
        {renderContent()}
      </div>
    </div>
  )
}

export default Card
