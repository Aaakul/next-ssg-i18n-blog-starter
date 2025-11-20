import Link from '@/components/Link'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export default function NotFound() {
  return (
    <main className="flex-center min-h-screen flex-col px-4">
      <div
        className={clsx(
          'flex flex-col items-start justify-start md:flex-row md:items-center',
          'w-full max-w-4xl md:space-x-6'
        )}
      >
        <section className="py-8 md:space-y-8">
          <h1
            className={clsx(
              'text-center text-5xl leading-8 font-bold',
              'md:border-r-2 md:px-6 md:text-8xl md:leading-14'
            )}
            aria-label="Page not found"
          >
            404
          </h1>
        </section>
        <div className="mt-4 mb-8 max-w-md space-y-4 text-left md:mt-0">
          <p>
            We're sorry, but the page you're trying to access might not exist, has been removed, or
            is not yet available in a localized version.
          </p>
          <p>非常抱歉，您尝试访问的页面可能不存在、已被移除或尚未提供本地化版本。</p>
          <p>
            申し訳ありませんが、お探しのページは存在しないか、削除されたか、またはまだローカライズ版が用意されていません。
          </p>
        </div>
      </div>
      <button className="button-primary mt-6 px-20 py-3">
        <Link href="/" aria-label="home">
          <ArrowUturnLeftIcon className="icon-size" />
          <span className="sr-only">Home page</span>
        </Link>
      </button>
    </main>
  )
}
