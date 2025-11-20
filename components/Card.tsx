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
      <p className="text-muted mb-3 max-w-none">{description}</p>
    </div>
  )

  const renderImage = () => {
    if (!imgSrc) return null

    const imageProps = {
      alt: title,
      src: imgSrc,
      className: 'object-cover object-center md:h-36 lg:h-48',
      width: 544,
      height: 306,
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
    <div className="p-4 md:w-1/2 md:max-w-[544px]">
      <div
        className={clsx(
          imgSrc && 'h-full',
          'bg-gray-100/50 dark:bg-gray-900/50',
          'overflow-hidden rounded-md shadow-lg'
        )}
      >
        {renderImage()}
        {renderContent()}
      </div>
    </div>
  )
}

export default Card
