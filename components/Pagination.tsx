import clsx from 'clsx'
import Link from './Link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import { PaginationButtonProps } from './types'
import type React from 'react'

type ButtonContentProps = Pick<PaginationButtonProps, 'label' | 'pageLabel'> & {
  iconComponent?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}

const renderButtonContent = ({
  iconComponent: Icon,
  label = '',
  pageLabel,
}: ButtonContentProps) => {
  if (Icon) {
    return (
      <>
        <Icon className="size-6" aria-hidden={true} />
        <span className="sr-only">{label}</span>
      </>
    )
  }
  return pageLabel ?? label
}

function PaginationButton({
  isEnabled,
  label = '',
  pageLabel,
  href,
  icon,
  className = '',
  isCurrentPage = false,
}: PaginationButtonProps) {
  const baseClasses = 'flex-center size-10 rounded-md'
  const enabledClasses =
    'link-hover-primary bg-default opacity-90 drop-shadow-md ring-inset focus:ring-2 focus:outline-none'

  if (isEnabled && href) {
    return (
      <Link
        href={href}
        aria-label={label}
        className={clsx(baseClasses, enabledClasses, className)}
        scroll={false}
      >
        {renderButtonContent({ iconComponent: icon, label, pageLabel })}
      </Link>
    )
  }

  return (
    <button
      className={clsx(
        baseClasses,
        {
          [enabledClasses]: isEnabled,
          'cursor-not-allowed': !isEnabled,
          'text-muted bg-transparent font-bold': isCurrentPage,
        },
        className
      )}
      disabled={!isEnabled}
      aria-label={label}
      {...(isCurrentPage ? { 'aria-current': 'page' } : {})}
    >
      {renderButtonContent({ iconComponent: icon, label, pageLabel })}
    </button>
  )
}

const Ellipsis = ({ className = '' }) => (
  <span className={clsx('flex-center px-1 py-2', className)} aria-hidden="true">
    &hellip;
  </span>
)

interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
}

export default function Pagination({ totalPages, currentPage, basePath }: PaginationProps) {
  const t = useTranslations('common')

  if (totalPages <= 1) {
    return null
  }

  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  const getPageHref = (page: number): string => {
    if (page === 1) return basePath
    return `${basePath}/page/${page}`
  }

  const renderPageButtons = () => {
    const buttons = []
    const shouldShowEllipsis = totalPages >= 6

    if (!shouldShowEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <PaginationButton
            key={i}
            isEnabled={currentPage !== i}
            pageLabel={i.toString()}
            href={getPageHref(i)}
            isCurrentPage={currentPage === i}
          />
        )
      }
      return buttons
    }

    const pagesToShow = new Set<number>()

    pagesToShow.add(1)
    pagesToShow.add(totalPages)

    if (currentPage > 1) {
      pagesToShow.add(currentPage - 1)
    }
    pagesToShow.add(currentPage)
    if (currentPage < totalPages) {
      pagesToShow.add(currentPage + 1)
    }

    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b)

    for (let i = 0; i < sortedPages.length; i++) {
      const pageNum = sortedPages[i]

      buttons.push(
        <PaginationButton
          key={pageNum}
          isEnabled={currentPage !== pageNum}
          pageLabel={pageNum.toString()}
          href={getPageHref(pageNum)}
          isCurrentPage={currentPage === pageNum}
        />
      )

      if (i < sortedPages.length - 1) {
        const nextExpectedPage = pageNum + 1
        const actualNextPage = sortedPages[i + 1]

        if (nextExpectedPage !== actualNextPage) {
          buttons.push(<Ellipsis key={`ellipsis`} />)
        }
      }
    }

    return buttons
  }

  return (
    <div className="mx-auto w-full py-6">
      <nav className="flex items-center justify-between gap-2" aria-label={t('pagination')}>
        <PaginationButton
          isEnabled={hasPrevPage}
          label={t('prev_page')}
          href={hasPrevPage ? getPageHref(currentPage - 1) : undefined}
          icon={ChevronLeftIcon}
          className={clsx(!hasPrevPage && 'invisible')}
        />

        <div className="flex-center grow gap-1 sm:gap-2">{renderPageButtons()}</div>

        <PaginationButton
          isEnabled={hasNextPage}
          label={t('next_page')}
          href={hasNextPage ? getPageHref(currentPage + 1) : undefined}
          icon={ChevronRightIcon}
          className={clsx(!hasNextPage && 'invisible')}
        />
      </nav>
    </div>
  )
}
