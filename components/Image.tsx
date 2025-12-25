'use client'

import React, { useEffect, useRef, useState } from 'react'
import { SiteConfig } from '@/data/siteConfig.mjs'
import { OptimizedImageProps } from './types'

const BASE_PATH = SiteConfig.basePath

const Image = ({
  src,
  webpSrc,
  alt,
  width,
  height,
  showPlaceholder = false,
  placeholderWidth = 400,
  placeholderHeight = 300,
  placeholderColor = '#9ca3af',
  loading = 'lazy',
  style,
  className,
  fetchPriority = 'auto',
  ...imgProps
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  if (typeof width === 'number') placeholderWidth = width
  if (typeof height === 'number') placeholderHeight = height
  const svgPlaceholder = showPlaceholder
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${placeholderWidth}" height="${placeholderHeight}">
            <rect width="100%" height="100%" fill="${placeholderColor}" />
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="system-ui" font-size="16" fill="#d1d5db">${alt}</text>
          </svg>`
      )}`
    : undefined

  const isLocal = !src?.startsWith('http')
  const extensions = ['png', 'jpg', 'jpeg']
  const fileName = src?.split('.')
  const ext = fileName?.pop()
  webpSrc =
    isLocal && ext && extensions.includes(ext.toLocaleLowerCase()) ? fileName + '.webp' : webpSrc

  const withBasePath = (source: string) => (isLocal ? `${BASE_PATH || ''}${source}` : source)
  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    setLoaded(true)
    if (typeof imgProps.onLoad === 'function') {
      imgProps.onLoad(event)
    }
  }

  // Prevent showing placeholder if image is in cache
  useEffect(() => {
    if (!loaded && imgRef.current && imgRef.current.complete) {
      const id = window.setTimeout(() => {
        setLoaded(true)
      }, 0)
      return () => window.clearTimeout(id)
    }
  }, [src, loaded])
  return (
    <picture>
      {webpSrc && <source type="image/webp" srcSet={withBasePath(webpSrc)} />}
      <img
        ref={imgRef}
        src={withBasePath(src)}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        style={{
          background:
            svgPlaceholder && !loaded ? `url(${svgPlaceholder}) center/cover no-repeat` : undefined,
          ...style,
        }}
        className={className}
        onLoad={handleLoad}
        {...imgProps}
      />
    </picture>
  )
}

export default Image
