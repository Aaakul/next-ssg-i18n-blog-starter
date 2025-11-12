import Link from '@/components/Link'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-gray-900 dark:text-gray-100">
      <div className="flex w-full max-w-4xl flex-col items-start justify-start md:flex-row md:items-center md:space-x-6">
        <section className="py-8 md:space-y-8">
          <h1
            className="text-center text-5xl leading-8 font-bold text-gray-900 md:border-r-2 md:px-6 md:text-8xl md:leading-14 dark:text-gray-100"
            aria-label="Page not found"
          >
            404
          </h1>
        </section>
        <div className="mt-4 mb-8 max-w-md space-y-4 text-left md:mt-0">
          <p className="whitespace-pre-wrap">
            We're sorry, but the page you're trying to access might not exist, has been removed, or
            is not yet available in a localized version.
          </p>
          <p className="whitespace-pre-wrap">
            非常抱歉，您尝试访问的页面可能不存在、已被移除或尚未提供本地化版本。
          </p>
          <p className="whitespace-pre-wrap">
            申し訳ありませんが、お探しのページは存在しないか、削除されたか、またはまだローカライズ版が用意されていません。
          </p>
        </div>
      </div>
      <button className="bg-primary-400 hover:bg-primary-600 mt-6 inline-flex w-auto items-center rounded-lg px-16 py-2 text-center text-sm font-medium text-gray-50 shadow-sm transition-colors duration-150">
        <Link href="/" aria-label="home">
          <ArrowUturnLeftIcon className="h-6" />
          <span className="sr-only">Home page</span>
        </Link>
      </button>
    </main>
  )
}
