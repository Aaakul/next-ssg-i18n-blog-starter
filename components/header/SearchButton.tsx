'use client'
import { useKBar } from 'kbar'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

const SearchButton = () => {
  const { query } = useKBar()
  const t = useTranslations('common')
  return (
    <button aria-label="Search" className="flex items-center" onClick={() => query.toggle()}>
      <div className="header-button" aria-label={t('open_search')}>
        <MagnifyingGlassIcon className="h-6" />
      </div>
    </button>
  )
}

export default SearchButton
