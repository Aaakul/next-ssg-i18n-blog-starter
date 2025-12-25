import type React from 'react'
import { ThemeProvider } from 'next-themes'
import { SiteConfig } from '@/data/siteConfig.mjs'

export default function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={SiteConfig.defaultTheme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
