// from pliny/search/KBarModal.tsx
import {
  KBarPortal,
  KBarSearch,
  KBarAnimator,
  KBarPositioner,
  KBarResults,
  useKBar,
  useMatches,
  Action,
  useRegisterActions,
} from 'kbar'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

const KBarModal = ({ actions, isLoading }: { actions: Action[]; isLoading: boolean }) => {
  const { visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }))

  useEffect(() => {
    const isOpen = visualState === 'showing' || visualState === 'animating-in'

    if (isOpen) {
      document.body.style.overflow = ''
      document.body.style.marginRight = ''
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.marginRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.marginRight = ''
    }
  }, [visualState])

  const t = useTranslations('kbar_search')
  useRegisterActions(actions, [actions])
  return (
    <KBarPortal>
      <KBarPositioner
        className="z-80 bg-black/30 p-4 backdrop-blur backdrop-grayscale backdrop-filter dark:bg-black/50"
        style={{ WebkitBackdropFilter: 'blur(8px) grayscale(100%)' }}
      >
        <KBarAnimator className="w-full max-w-5xl">
          <div className="bg-default rounded-2xl shadow-lg">
            <div className="flex-center space-x-4 p-4">
              <span className="block size-5">
                <svg
                  className="text-muted"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <KBarSearch
                id="kbar-search-input"
                aria-label={t('site_search')}
                className={clsx(
                  'h-8 w-full rounded border border-gray-400 px-1.5 focus:outline-none dark:border-gray-500',
                  'bg-transparent placeholder-gray-500 dark:placeholder-gray-400'
                )}
                defaultPlaceholder={t('site_search')}
              />
              <kbd
                aria-label={t('close_search')}
                className={clsx(
                  'flex-center size-6 rounded px-1.5',
                  'text-muted text-xs font-medium',
                  'border border-gray-400 dark:border-gray-500'
                )}
              >
                ESC
              </kbd>
            </div>
            {!isLoading && <RenderResults />}
            {isLoading && (
              <div
                className={clsx(
                  'text-muted text-center',
                  'block border-t border-gray-200 px-4 py-8 dark:border-gray-700'
                )}
              >
                {t('loading')}
              </div>
            )}
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}

const RenderResults = () => {
  const t = useTranslations('kbar_search')
  const { results } = useMatches()
  if (!results.length) {
    return (
      <div className="text-muted border-t border-gray-200 px-4 py-8 text-center dark:border-gray-700">
        {t('no_result')}
      </div>
    )
  }
  return (
    <KBarResults
      items={results}
      onRender={({ item, active, ...itemProps }) =>
        typeof item === 'string' ? (
          <div
            className={clsx(
              'text-primary-600 text-xs font-semibold uppercase',
              'border-t border-gray-100 px-4 pt-6 pb-2 dark:border-gray-800'
            )}
          >
            {item}
          </div>
        ) : (
          <div
            {...itemProps}
            className={clsx(
              'flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 transition-colors',
              active ? 'bg-primary-600 text-gray-100' : 'bg-transparent'
            )}
          >
            <div className="space-x-2">
              {item.icon && <span className="self-center">{item.icon}</span>}
              <div>
                {item.subtitle && (
                  <div className={clsx('text-xs', active && 'text-gray-100')}>{item.subtitle}</div>
                )}
                <div>{item.name}</div>
              </div>
            </div>
            {item.shortcut?.length ? (
              <div aria-hidden className="gap-x-2">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className={clsx(
                      'size-6 rounded border text-xs font-medium',
                      active ? 'border-gray-200 text-gray-200' : 'border-gray-400 text-gray-400'
                    )}
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  )
}

export default KBarModal
