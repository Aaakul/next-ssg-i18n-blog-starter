import { withContentlayer } from 'next-contentlayer2'
import bundleAnalyzer from '@next/bundle-analyzer'
import { SiteConfig } from './data/siteConfig.mjs'
import createNextIntlPlugin from 'next-intl/plugin'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

export const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withNextIntl = createNextIntlPlugin()
const basePath = SiteConfig.basePath

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const adapterPath = join(__dirname, 'lib', 'build-adapter.mjs')

/**
 * @type {import('next').NextConfig}
 */

const plugins = [withContentlayer, withBundleAnalyzer, withNextIntl]

const nextConfig = plugins.reduce((acc, next) => next(acc), {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    adapterPath: adapterPath,
    globalNotFound: true,
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
    config.cache = true
    return config
  },
})

export default nextConfig
