'use client'

import { useKBar } from 'kbar'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

const SearchButton = () => {
  const { query } = useKBar()
  const t = useTranslations('common')
  return (
    <button aria-label={t('open_search')} className="header-button" onClick={() => query.toggle()}>
      <div>
        <MagnifyingGlassIcon className="size-6" />
      </div>
    </button>
  )
}

export default SearchButton
