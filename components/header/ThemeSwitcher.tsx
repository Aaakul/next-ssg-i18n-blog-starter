'use client'
import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useTranslations, useLocale } from 'next-intl'
import { Locale } from '@/i18n'

// From Material Icons `contrast`
const ThemeSwitcherIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="currentColor"
    className="size-6"
  >
    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
  </svg>
)

const ThemeSwitcher = () => {
  const [isMounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const locale = useLocale() as Locale

  const t = useTranslations('common')
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    document.documentElement.lang = locale
  }, [locale])

  const toggleTheme = useCallback(() => {
    if (isMounted) {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }, [isMounted, setTheme, resolvedTheme])

  return (
    <div className="flex-center">
      <button className="header-button" onClick={toggleTheme} aria-label={t('toggle_theme')}>
        <ThemeSwitcherIcon />
      </button>
    </div>
  )
}

export default ThemeSwitcher
