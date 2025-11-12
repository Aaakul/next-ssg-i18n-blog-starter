import { SiteConfig } from '@/data/siteConfig.mjs'
import NextImage, { ImageProps } from 'next/image'

const basePath = SiteConfig.basePath

const Image = ({ src, ...rest }: ImageProps) => (
  <NextImage src={`${basePath || ''}${src}`} {...rest} placeholder="empty" />
)

export default Image
