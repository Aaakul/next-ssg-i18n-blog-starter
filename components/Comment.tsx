'use client'

import dynamic from 'next/dynamic'
import { SiteConfig } from '@/data/siteConfig.mjs'
import { DisqusJSConfig } from '@/lib/disqusjs/react'
import { useEffect, useRef, useState } from 'react'
import '@/lib/disqusjs/react/styles/disqusjs.css'

const DynamicDisqusJS = dynamic(() => import('@/lib/disqusjs/react'), {
  ssr: false,
})

export default function Comment(props: DisqusJSConfig) {
  // https://blog.skk.moe/post/prevent-disqus-from-slowing-your-site/
  const [shouldLoad, setShouldLoad] = useState(false)
  const commentContainerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const runningOnBrowser = typeof window !== 'undefined'
    if (!runningOnBrowser || !SiteConfig.isEnableDisqusJS) {
      return
    }

    const isBot =
      !('onscroll' in window) ||
      (typeof navigator !== 'undefined' &&
        /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent))

    const supportsIntersectionObserver = 'IntersectionObserver' in window

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting) {
        setShouldLoad(true)
        if (observerRef.current) {
          observerRef.current.disconnect()
          observerRef.current = null
        }
      }
    }

    const setupObserver = () => {
      if (isBot || !supportsIntersectionObserver) {
        setShouldLoad(true)
        return
      }

      if (commentContainerRef.current) {
        observerRef.current = new IntersectionObserver(handleIntersection, {
          threshold: [0],
          rootMargin: '48px',
        })
        // hack
        observerRef.current.observe(commentContainerRef.current)
      }
    }

    const timerId = setTimeout(setupObserver, 1)

    return () => {
      clearTimeout(timerId)
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  if (!SiteConfig.isEnableDisqusJS) {
    return null
  }

  if (shouldLoad) {
    return <DynamicDisqusJS {...props} className="dsqjs" />
  }

  return <div ref={commentContainerRef} className="h-full w-full" aria-busy={true} />
}
