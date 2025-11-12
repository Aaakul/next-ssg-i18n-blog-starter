import type React from 'react'
import '@/styles/global.css'
import 'remark-github-blockquote-alert/alert.css'
import { SiteConfig } from '@/data/siteConfig.mjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className="scroll-smooth antialiased"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="apple-touch-icon"
          type="image/png"
          href={`${SiteConfig.basePath}/apple-icon.png`}
          sizes="180x180"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href={`${SiteConfig.basePath}/favicon.ico`}
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href={`${SiteConfig.basePath}/apple-icon.png`}
        />
        <link
          rel="icon"
          type="image/svg+xml"
          sizes="any"
          href={`${SiteConfig.basePath}/favicon.svg`}
        />
        <link
          rel="mask-icon"
          type="image/svg+xml"
          href={`${SiteConfig.basePath}/favicon.svg`}
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      </head>
      <body className="no-scrollbar to-primary-300/30 flex min-h-screen flex-col bg-linear-to-b from-neutral-100/95 pl-[calc(100vw-100%)] text-gray-900 dark:bg-linear-to-b dark:from-gray-950 dark:to-gray-900 dark:text-gray-100">
        <div className="w-full px-2">{children}</div>
      </body>
    </html>
  )
}
