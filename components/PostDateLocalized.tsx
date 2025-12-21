'use client'

import { useMemo } from 'react'
import { PostDateProps } from './types'

const PostDateLocalized = ({ locale, date, template = 'full', srText }: PostDateProps) => {
  const formatted = useMemo(() => {
    if (!date) return ''
    if (typeof date === 'string' && Number.isNaN(Date.parse(date))) return ''

    // Handle date only strings 'YYYY-MM-DD'
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date)
    // Treat them as UTC 0:00
    const target = isDateOnly ? new Date(date + 'T00:00:00Z') : new Date(date)

    const now = new Date()
    const targetYear = target.getFullYear()
    const isThisYear = targetYear === now.getFullYear()

    const base: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
    const year: Intl.DateTimeFormatOptions = isThisYear ? {} : { year: 'numeric' }

    let opts: Intl.DateTimeFormatOptions = {}
    if (template === 'full') {
      opts = {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        ...base,
        ...year,
      }
    } else {
      opts = {
        weekday: isThisYear ? 'long' : 'short',
        ...base,
        ...year,
      }
    }

    try {
      const formatter = new Intl.DateTimeFormat(locale, opts)
      return formatter.format(target)
    } catch {
      try {
        return target.toLocaleDateString(locale, opts)
      } catch {
        return target.toString()
      }
    }
  }, [date, template, locale])

  if (!formatted) return null

  return (
    <>
      {srText && <span className="sr-only">{srText}</span>}
      <time suppressHydrationWarning dateTime={date}>
        {formatted}
      </time>
    </>
  )
}

export default PostDateLocalized
