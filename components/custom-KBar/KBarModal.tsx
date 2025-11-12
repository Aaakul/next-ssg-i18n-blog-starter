// from pliny/search/KBarModal.tsx
import {
  KBarPortal,
  KBarSearch,
  KBarAnimator,
  KBarPositioner,
  KBarResults,
  useMatches,
  Action,
  useRegisterActions,
} from 'kbar'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

const KBarModal = ({ actions, isLoading }: { actions: Action[]; isLoading: boolean }) => {
  const t = useTranslations('kbar_search')
  useRegisterActions(actions, [actions])
  return (
    <KBarPortal>
      <KBarPositioner
        className="z-80 bg-black/30 p-4 backdrop-blur backdrop-grayscale backdrop-filter dark:bg-black/50"
        style={{ WebkitBackdropFilter: 'blur(8px) grayscale(100%)' }}
      >
        <KBarAnimator className="w-full max-w-xl">
          <div className="overflow-hidden rounded-2xl bg-gray-50 shadow-lg dark:bg-gray-800">
            <div className="flex items-center space-x-4 p-4">
              <span className="block w-5">
                <svg
                  className="text-gray-500 dark:text-gray-300"
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
                className="h-8 w-full bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none dark:text-gray-200 dark:placeholder-gray-400"
                defaultPlaceholder={t('site_search')}
              />
              <kbd
                aria-label={t('close_search')}
                className="inline-flex h-6 items-center justify-center rounded border border-gray-400 px-1.5 text-xs leading-none font-medium text-gray-500 dark:border-gray-500 dark:text-gray-400"
              >
                ESC
              </kbd>
            </div>
            {!isLoading && <RenderResults />}
            {isLoading && (
              <div className="block border-t border-gray-200 px-4 py-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
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
      <div className="border-t border-gray-200 px-4 py-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
        {t('no_result')}
      </div>
    )
  }
  return (
    <KBarResults
      items={results}
      onRender={({ item, active, ...itemProps }) =>
        typeof item === 'string' ? (
          <div className="text-primary-600 border-t border-gray-100 px-4 pt-6 pb-2 text-xs font-semibold uppercase dark:border-gray-800">
            {item}
          </div>
        ) : (
          <div
            {...itemProps}
            className={clsx(
              'flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 transition-colors',
              active
                ? 'bg-primary-600 text-gray-200'
                : 'bg-transparent text-gray-700 dark:text-gray-100'
            )}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <span className="self-center">{item.icon}</span>}
              <div>
                {item.subtitle && (
                  <div className={clsx('text-xs', active ? 'text-gray-200' : 'text-gray-400')}>
                    {item.subtitle}
                  </div>
                )}
                <div>{item.name}</div>
              </div>
            </div>
            {item.shortcut?.length ? (
              <div aria-hidden className="flex items-center gap-x-2">
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className={clsx(
                      'flex h-6 w-6 items-center justify-center rounded border text-xs font-medium',
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
