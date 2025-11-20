import { withContentlayer } from 'next-contentlayer2'
import bundleAnalyzer from '@next/bundle-analyzer'
import { SiteConfig } from './data/siteConfig.mjs'
import createNextIntlPlugin from 'next-intl/plugin'

export const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withNextIntl = createNextIntlPlugin()
const basePath = SiteConfig.basePath

/**
 * @type {import('next').NextConfig}
 */

const plugins = [withContentlayer, withBundleAnalyzer, withNextIntl]

const nextConfig = plugins.reduce((acc, next) => next(acc), {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : undefined),
  basePath: basePath,
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // productionBrowserSourceMaps: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
})

export default nextConfig
