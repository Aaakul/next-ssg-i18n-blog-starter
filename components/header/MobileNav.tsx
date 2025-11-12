'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Fragment, useState, useEffect, useRef } from 'react'
import HeaderNavLinks from '@/components/header/HeaderNavLinks'
import { Bars4Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { MobileNavProps } from '../types'
import { useTranslations } from 'next-intl'

const MobileNav = ({ locale, links }: MobileNavProps) => {
  const [navShow, setNavShow] = useState(false)
  const navRef = useRef(null)
  const t = useTranslations('common')

  // Toggle the navigation visibility.
  const onToggleNav = () => {
    setNavShow((prev) => !prev)
  }

  const handleLinkClick = () => {
    setNavShow(false)
  }

  useEffect(() => {
    const currentNav = navRef.current

    if (navShow && currentNav) {
      // Disable scrolling when the mobile nav is shown.
      disableBodyScroll(currentNav)
    } else if (!navShow && currentNav) {
      // Enable scrolling when the mobile nav is hidden.
      enableBodyScroll(currentNav)
    }

    // Cleanup function to enable scrolling and clear all locks when the component unmounts or nav closes.
    return () => {
      if (currentNav) {
        enableBodyScroll(currentNav)
        clearAllBodyScrollLocks()
      }
    }
  }, [navShow, navRef])

  const closeButton = (
    <button
      className="hover:text-primary-500 dark:hover:text-primary-400 absolute top-4 right-4 z-80 h-16 w-16 p-4 text-gray-900 dark:text-gray-100"
      aria-label={t('close_nav')}
      onClick={(e) => {
        e.preventDefault()
        onToggleNav()
      }}
    >
      <XMarkIcon />
    </button>
  )
  const openButton = (
    <div className="sm:pointer-events-none sm:invisible">
      <button
        aria-label={t('open_nav')}
        onClick={onToggleNav}
        className="header-button block sm:hidden"
      >
        <Bars4Icon className="h-6" />
      </button>
    </div>
  )

  return (
    <>
      {openButton}
      <Transition appear show={navShow} as={Fragment} unmount={true}>
        <Dialog as="div" onClose={onToggleNav}>
          <TransitionChild
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 z-80"
          >
            <div className="fixed inset-0 flex h-full w-full items-start justify-center">
              <DialogPanel className="h-full w-full overflow-hidden bg-gray-50 shadow-lg dark:bg-gray-800">
                <div className="absolute -top-2 right-0 z-90">{closeButton}</div>
                <nav ref={navRef} className="max-h-screen overflow-y-auto p-6 pt-18">
                  <HeaderNavLinks
                    locale={locale}
                    links={links}
                    onLinkClick={handleLinkClick}
                    linkClassName="block py-3 pr-4 text-2xl font-medium text-gray-800 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400"
                  />
                </nav>
              </DialogPanel>
            </div>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
