'use client'

import { ProgressProvider } from '@bprogress/next/app'
import type React from 'react'

export default function ProgressWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      // sky-500
      color={'oklch(68.5% 0.169 237.323)'}
      options={{ showSpinner: false }}
    >
      {children}
    </ProgressProvider>
  )
}
