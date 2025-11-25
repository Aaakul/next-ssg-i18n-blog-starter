'use client'

import dynamic from 'next/dynamic'
import { SiteConfig } from '@/data/siteConfig.mjs'
import { DisqusJSConfig } from '@/lib/disqusjs/react'
import '@/lib/disqusjs/react/styles/disqusjs.css'

const DynamicDisqusJS = dynamic(() => import('@/lib/disqusjs/react'), {
  ssr: false,
  loading: () => null,
})

export default function Comment(props: DisqusJSConfig) {
  if (SiteConfig.isEnableDisqusJS) return <DynamicDisqusJS {...props} className="dsqjs" />
}
