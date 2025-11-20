'use client'

import type React from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { KBarProvider } from 'kbar'
import { KBarSearchProps } from '../types'
import type { Action } from 'kbar'
import dynamic from 'next/dynamic'
import { SearchIndexEntry } from '@/lib/contentlayer-utils'
import { SiteConfig } from '@/data/siteConfig.mjs'
import { Locale } from '@/i18n'

const KBarModal = dynamic(() => import('./KBarModal'), {
  ssr: false,
  loading: () => null,
})

const CACHE_KEY = 'kbar-search-data'

const KBarSearchProvider = ({
  children,
  kbarConfig,
}: {
  children: React.ReactNode
  kbarConfig: KBarSearchProps
}) => {
  const { defaultActions, onSearchDocumentsLoad } = kbarConfig
  const [searchActions, setSearchActions] = useState<Action[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const hasFetched = useRef(false)

  // Check if we have cached data from current session
  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const data = JSON.parse(cached)
        const actions = onSearchDocumentsLoad ? onSearchDocumentsLoad(data) : []
        setSearchActions(actions)
        setDataLoaded(true)
        hasFetched.current = true
      } catch (e) {
        console.warn('Failed to parse cached search data:', e)
      }
    }
  }, [onSearchDocumentsLoad])

  const loadSearchData = useCallback(async () => {
    if (hasFetched.current) return

    try {
      const res = await fetch(`${SiteConfig.basePath}/search.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()

      // Cache the response in session storage
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(json))

      const actions = onSearchDocumentsLoad ? onSearchDocumentsLoad(json) : []
      setSearchActions(actions)
      hasFetched.current = true
    } catch (error) {
      console.error('Failed to load search documents:', error)
    } finally {
      setDataLoaded(true)
    }
  }, [onSearchDocumentsLoad])

  // Load data when component mounts
  useEffect(() => {
    setDataLoaded(true)

    loadSearchData()
  }, [loadSearchData])

  return (
    <KBarProvider
      actions={defaultActions}
      options={{
        enableHistory: true,
        callbacks: {
          onOpen: () => {
            loadSearchData()
          },
        },
      }}
    >
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  )
}

export default function SearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const locale = useLocale() as Locale
  const t = useTranslations('common')

  const handleSearchDocumentsLoad = (json: SearchIndexEntry[]): Action[] =>
    json
      .filter((post) => post.language === locale)
      .map((post) => ({
        id: post.path,
        name: post.title,
        keywords: post.keywords,
        section: t('article') || 'Articles',
        subtitle: new Date(post.date).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        perform: () => router.push(`/${locale}/${post.path}`.replace(/\/+/g, '/')),
      }))

  return (
    <KBarSearchProvider
      kbarConfig={{
        onSearchDocumentsLoad: handleSearchDocumentsLoad,
      }}
    >
      {children}
    </KBarSearchProvider>
  )
}
