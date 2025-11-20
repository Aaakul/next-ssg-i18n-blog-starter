import type React from 'react'
import '@/styles/global.css'
import 'remark-github-blockquote-alert/alert.css'
import { SiteConfig } from '@/data/siteConfig.mjs'
import clsx from 'clsx'

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
      <body
        className={clsx(
          'bg-neutral-100 dark:bg-gray-950',
          'no-scrollbar text-default flex min-h-screen flex-col pl-[calc(100vw-100%)] duration-300'
        )}
      >
        <div className="w-full px-2">{children}</div>
      </body>
    </html>
  )
}
