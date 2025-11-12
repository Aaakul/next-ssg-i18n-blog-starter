'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTranslations, useLocale } from 'next-intl'
import { IconPlaceholder } from './HeaderButtons'
import { Locale } from '@/i18n'

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const locale = useLocale() as Locale

  const t = useTranslations('common')
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    document.documentElement.lang = locale
  }, [locale])

  const toggleTheme = () => {
    if (mounted) {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }

  return (
    <div className="flex items-center">
      <button className="header-button" onClick={toggleTheme} aria-label={t('toggle_theme')}>
        {mounted ? (
          resolvedTheme === 'dark' ? (
            <MoonIcon className="h-6" />
          ) : (
            <SunIcon className="h-6" />
          )
        ) : (
          <IconPlaceholder />
        )}
      </button>
    </div>
  )
}

export default ThemeSwitcher
