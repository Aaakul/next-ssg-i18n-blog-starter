'use client'
import { useState, useRef, ReactNode } from 'react'
import { useTranslations } from 'next-intl'

export default function CodeBlockWithCopyButton({ children }: { children: ReactNode }) {
  const textInput = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const t = useTranslations('common')

  const onEnter = () => {
    setHovered(true)
  }
  const onExit = () => {
    setHovered(false)
    setCopied(false)
  }

  const onCopy = () => {
    if (!textInput.current) return

    const text = textInput.current.textContent ?? ''

    // Modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        },
        (err) => {
          console.error('Failed to copy: ', err)
          fallbackCopyText(text)
        }
      )
    } else {
      fallbackCopyText(text)
    }
  }

  function fallbackCopyText(text: string) {
    const textArea = document.createElement('textarea') // Hidden element
    textArea.value = text
    textArea.style.position = 'fixed' // Prevent from scrolling
    textArea.style.top = '-9999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        console.warn('Fallback: Copy command was unsuccessful')
      }
    } catch (err) {
      console.error('Fallback: Unable to copy', err)
    }

    document.body.removeChild(textArea)
  }

  return (
    <div ref={textInput} onMouseEnter={onEnter} onMouseLeave={onExit} className="relative">
      {hovered && (
        <button
          aria-label={t('copy_code')}
          className={`absolute top-2 right-2 h-8 w-8 rounded border-2 bg-gray-700 p-1 dark:bg-gray-800 ${
            copied
              ? 'border-green-400 focus:border-green-400 focus:outline-none'
              : 'border-gray-300'
          }`}
          onClick={onCopy}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            className={copied ? 'text-green-400' : 'text-gray-300'}
          >
            {copied ? (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </>
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </>
            )}
          </svg>
        </button>
      )}

      <pre>{children}</pre>
    </div>
  )
}
