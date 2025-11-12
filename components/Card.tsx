import clsx from 'clsx'
import Image from './Image'
import Link from './Link'
import { CardProps } from './types'
import { useTranslations } from 'next-intl'

const Card = ({ title, description, imgSrc, href }: CardProps) => {
  const t = useTranslations('common')
  const renderContent = () => (
    <div className="p-6">
      <h2 className="mb-3 text-2xl leading-8 font-bold">
        {href ? (
          <Link href={href} aria-label={t('link_to', { title })}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
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
          'border-opacity-50 overflow-hidden rounded-md border border-gray-500/50 shadow-lg dark:bg-gray-900/50'
        )}
      >
        {renderImage()}
        {renderContent()}
      </div>
    </div>
  )
}

export default Card
