'use client'

import { useState, useRef, ReactNode, useCallback, useEffect, memo } from 'react'
import { useTranslations } from 'next-intl'

function CodeBlockWithCopyButton({ children }: { children: ReactNode }) {
  const preRef = useRef<HTMLPreElement | null>(null)
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const t = useTranslations('common')

  const clearCopiedTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearCopiedTimeout()
    }
  }, [clearCopiedTimeout])

  const fallbackCopyText = useCallback(
    (text: string) => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.top = '-9999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand('copy')
        if (successful) {
          setCopied(true)
          clearCopiedTimeout()
          timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
        } else {
          console.warn('Fallback: Copy command was unsuccessful')
        }
      } catch (err) {
        console.error('Fallback: Unable to copy', err)
      }

      document.body.removeChild(textArea)
    },
    [clearCopiedTimeout]
  )

  const onCopy = useCallback(async () => {
    const text = preRef.current?.textContent ?? ''
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearCopiedTimeout()
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch (_err) {
      // Fallback
      fallbackCopyText(text)
    }
  }, [fallbackCopyText, clearCopiedTimeout])

  return (
    <div className="group relative">
      <button
        aria-label={t('copy_code')}
        className={`absolute top-2 right-2 size-8 rounded border-2 bg-gray-700 p-1 opacity-0 transition-opacity duration-150 group-hover:opacity-80 focus:opacity-100 ${
          copied ? 'border-green-400 focus:border-green-400 focus:outline-none' : 'border-gray-300'
        }`}
        onClick={onCopy}
        aria-pressed={copied}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          className={copied ? 'text-green-400' : 'text-gray-300'}
        >
          {copied ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          )}
        </svg>
      </button>

      <span aria-live="polite" className="sr-only">
        {copied ? t('copied') : ''}
      </span>

      <pre ref={preRef}>{children}</pre>
    </div>
  )
}

export default memo(CodeBlockWithCopyButton)
