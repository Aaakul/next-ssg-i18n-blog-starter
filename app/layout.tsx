import type React from 'react'
import '@/styles/global.css'
import { SiteConfig } from '@/data/siteConfig.mjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning>
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
        <style>{`body{background-color:'#fafafa';&:is(.dark *){background-color:#030712;}}`}</style>
      </head>
      <body
        style={{
          scrollBehavior: 'smooth',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          minHeight: ' 100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 'calc(100vw - 100%)',
          transitionDuration: '300ms',
        }}
      >
        {children}
      </body>
    </html>
  )
}
