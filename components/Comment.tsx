'use client'

import dynamic from 'next/dynamic'
import { SiteConfig } from '@/data/siteConfig.mjs'
import { DisqusJSConfig } from '@/lib/disqusjs/react'
import { useEffect, useRef, useState } from 'react'

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
        observerRef.current.observe(commentContainerRef.current)
      }
    }
    // hack
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
    const inlineStyles = `#dsqjs{display:flex;flex-direction:column;height:100%;min-height:45vh}#dsqjs *,#dsqjs *::before,#dsqjs *::after{box-sizing:border-box}#dsqjs *{margin:0;padding:0}#dsqjs a{color:#0ea5e9;text-decoration:none}#dsqjs a:hover{text-decoration:underline}#dsqjs #dsqjs-msg{text-align:center;margin:4px 0;font-size:1rem}#dsqjs .dsqjs-msg-btn{cursor:pointer}#dsqjs .dsqjs-bullet{margin:0 2px;line-height:1.4}#dsqjs .dsqjs-bullet::after{color:#6a7282;content:'·';font-weight:700}#dsqjs .dsqjs-clearfix::after{clear:both;content:'';display:table}#dsqjs .dsqjs-nav{border-bottom:2px solid #d1d5dc;margin:0 0 20px;position:relative}#dsqjs ol,#dsqjs ul{list-style:none}#dsqjs .dsqjs-no-comment{text-align:center;margin-bottom:6px;font-size:1rem;line-height:1.5}#dsqjs .dsqjs-nav-tab{float:left;text-transform:capitalize;margin:0 15px 0 0;padding:12px 8px;font-size:1rem;font-weight:700;line-height:1;transition:color 0.2s ease-in-out;position:relative}#dsqjs .dsqjs-tab-active > span::after{content:'';height:2px;display:block;position:absolute;bottom:-5px;left:0;right:0;background-color:#076dd0}#dsqjs .dsqjs-post-list .dsqjs-post-item{margin-bottom:16px;position:relative}#dsqjs .dsqjs-post-list .dsqjs-post-item .dsqjs-post-avatar{float:left;background:#dbdfe4;border-radius:4px;margin-right:10px}#dsqjs .dsqjs-post-list .dsqjs-post-item .dsqjs-post-avatar img{border-radius:4px;width:44px;height:44px;display:block}#dsqjs .dsqjs-post-list .dsqjs-post-item .dsqjs-post-header{margin-bottom:3px;font-size:0.875rem;line-height:1}#dsqjs .dsqjs-post-list .dsqjs-post-item .dsqjs-post-header .dsqjs-post-author{color:#656c7a;font-weight:700}#dsqjs .dsqjs-post-list .dsqjs-post-item .dsqjs-post-header .dsqjs-admin-badge{color:#fff;background:#687a86;border-radius:3px;margin-left:4px;padding:1px 3px;font-size:0.8rem;font-weight:700;line-height:1;display:inline-block;position:relative;top:-1px}#dsqjs .dsqjs-post-list .dsqjs-post-item .dsqjs-post-header .dsqjs-meta{color:#64778b;font-size:0.875rem;display:inline-block}#dsqjs .dsqjs-post-body{word-wrap:break-word;font-size:1rem;line-height:1.5}#dsqjs .dsqjs-post-body:not(pre) > code{color:#405363;background:#e6e8ee;border-radius:3px;padding:0.2em 0.4em;font-size:85%}#dsqjs .dsqjs-post-body pre{background:#f5f5f5;border-radius:3px;margin:0.5em 0;padding:0.5em;font-size:85%;line-height:1.45;overflow:auto}#dsqjs .dsqjs-post-body blockquote{color:#6a737d;border-left:0.25em solid #e3e6eb;margin:0.5em 0;padding:0 0.8em}#dsqjs .dsqjs-post-body p:last-child{margin:0}#dsqjs > div:not(.dsqjs-footer-container){flex:1;overflow-y:auto}#dsqjs .dsqjs-post-list.dsqjs-children > li{margin-left:30px}#dsqjs .dsqjs-post-list.dsqjs-children > li .dsqjs-post-avatar img{width:38px;height:38px}#dsqjs .dsqjs-load-more{color:#fff;cursor:pointer;text-align:center;background:#687a86;margin:0 0 24px;padding:11px 14px;font-size:0.875rem;display:block}#dsqjs .dsqjs-load-more.is-error{background:#dc222f}#dsqjs .dsqjs-load-more.is-error:hover{opacity:0.8}#dsqjs .dsqjs-footer-container{color:#555;text-align:right;border-top:2px solid #e6e8ee;margin-top:12px;padding:10px 10px 0 0;font-size:1rem;font-weight:700;line-height:1.5}#dsqjs .dsqjs-footer{color:#64778b}#dsqjs .dsqjs-disqus-logo{background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 438 80'%3E%3Cpath fill='%23575b5d' d='M30.2 1.6H1v76h28.9C57 77.6 73 61.3 73 39.4v-.2c0-22-15.7-37.6-42.9-37.6zm21.3 38.1c0 12.3-8.4 19.3-21 19.3H22V20.3h8.5c12.6 0 21 7 21 19.2zm35.6 38h21.2V1.5H87.1v76zm70-47.4c-10.4-2.4-13-4-13-7.4v-.2c0-2.7 2.4-5 7.6-5 6.7 0 14.3 2.7 21.2 7.6l10.6-14.9A47.9 47.9 0 0 0 152.2.3c-18.3 0-29.4 10.2-29.4 24.3v.2c0 15.7 12.4 20.3 28.6 24 10.4 2.3 12.9 4 12.9 7.2v.2c0 3.3-3 5.2-8.7 5.2-8.8 0-17.2-3.1-24.7-9l-11.7 14a53.1 53.1 0 0 0 35.6 12.5c18.5 0 30.7-9.2 30.7-24.7V54c0-14.3-10.8-20-28.3-23.7zm120.7 9.3v-.2A39.5 39.5 0 0 0 236.9.1c-23.4 0-41 17.7-41 39.5v.2a39.5 39.5 0 0 0 40.8 39.4c8.7 0 16.6-2.5 23.1-6.8l8.4 7.5L279 68.1l-7.9-6.6a38 38 0 0 0 6.8-21.9zm-21.4.5c0 2.6-.5 5-1.3 7.3l-10.4-9.3-10.6 12 10.5 9a21.7 21.7 0 0 1-7.7 1.4c-11.6 0-19.4-9.7-19.4-20.7v-.2c0-11 7.7-20.5 19.2-20.5 11.7 0 19.7 9.7 19.7 20.7zm83.5 4.3c0 10.6-5.5 15.6-14 15.6s-14-5.2-14-16.1V1.6h-21.4v42.7C290.5 68 304 79 325.7 79s35.6-10.8 35.6-35.3V1.5h-21.4v42.8zm68.9-14.1c-10.6-2.4-13.2-4-13.2-7.4v-.2c0-2.7 2.5-5 7.6-5 6.8 0 14.4 2.7 21.3 7.6l10.6-14.9A47.9 47.9 0 0 0 403.8.3c-18.3 0-29.5 10.2-29.5 24.3v.2c0 15.7 12.5 20.3 28.7 24 10.3 2.3 12.8 4 12.8 7.2v.2c0 3.3-3 5.3-8.7 5.3-8.8 0-17.1-3.2-24.6-9.2l-11.7 14A53.1 53.1 0 0 0 406.4 79c18.5 0 30.7-9.2 30.7-24.7V54c0-14.3-10.8-20-28.3-23.7'/%3E%3C/svg%3E");background-position:50%;background-repeat:no-repeat;width:65.7px;height:12px;display:inline-block}#dsqjs .dsqjs-order{float:right;align-items:center;margin:10px 0 12px;display:flex}#dsqjs .dsqjs-order-radio{display:none}#dsqjs .dsqjs-order-radio:checked + .dsqjs-order-label{color:#0ea5e9;text-decoration:underline;text-underline-offset:4px;font-weight:700;text-decoration-thickness:2px}#dsqjs .dsqjs-order-label{cursor:pointer;border-radius:4px;margin-right:10px;padding:0 6px;font-size:small}#dsqjs .dsqjs-has-more{margin:0 0 24px 48px;font-size:0.85rem;line-height:15px}@media (min-width:769px){#dsqjs .dsqjs-post-list.dsqjs-children > li{margin-left:48px}#dsqjs .dsqjs-post-list .dsqjs-post-avatar{margin-right:12px}#dsqjs .dsqjs-post-list .dsqjs-post-item{margin-bottom:20px}}@media (min-width:1024px){#dsqjs .dsqjs-post-list.dsqjs-children > li{margin-left:60px}}`
    return (
      <>
        <style>{inlineStyles}</style>
        <DynamicDisqusJS {...props} />
      </>
    )
  }

  return <div ref={commentContainerRef} className="h-full w-full" aria-busy={true} />
}
