import { Locale } from '@/i18n'
import { useLocale } from 'next-intl'

type Template = 'full' | 'compact'

const PostDateLocalized = ({ date, template = 'full' }: { date: string; template?: Template }) => {
  const locale = useLocale() as Locale

  const targetDate = new Date(date)
  const now = new Date()

  const isThisYear = targetDate.getFullYear() === now.getFullYear()

  const baseOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  }

  const yearOption: Intl.DateTimeFormatOptions = isThisYear ? {} : { year: 'numeric' }

  let dateTemplate: Intl.DateTimeFormatOptions = {}

  if (template === 'full') {
    dateTemplate = {
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long',
      ...baseOptions,
      ...yearOption,
    }
  } else {
    dateTemplate = {
      weekday: 'short',
      ...baseOptions,
      ...yearOption,
      ...(isThisYear ? { weekday: 'long' } : {}),
    }
  }

  return <span>{targetDate.toLocaleDateString(locale, dateTemplate)}</span>
}

export default PostDateLocalized
