import Pagination from '@/components/Pagination'
import type { ListLayoutProps } from './types'
import { PostList } from '@/components/PostList'
import LinksPanel from '@/components/LinksPanel'

export default function ListLayoutWithTags({
  headerTitle,
  initialDisplayPosts = [],
  pagination,
  locale,
  tagCount,
  categoryCount,
}: ListLayoutProps) {
  return (
    <main className="PostsListWithTagsPanel pt-6">
      <header>
        {headerTitle && <h1 className="text-center text-3xl font-bold">{headerTitle}</h1>}
      </header>
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        {/* Sider */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:space-y-6">
          <div className="lg:sticky lg:top-20">
            {/* Categories Panel*/}
            <LinksPanel
              linksPanelClass="w-full p-4"
              locale={locale}
              fieldCount={categoryCount}
              basePath={pagination?.basePath}
              field="categories"
            />
          </div>
          {/* Featured Tags Panel*/}
          <div className="lg:sticky lg:top-20">
            <LinksPanel
              linksPanelClass="w-full p-4"
              locale={locale}
              fieldCount={tagCount}
              basePath={pagination?.basePath}
              field="tags"
            />
          </div>
        </div>
        {/* Post list */}
        <section className="w-full">
          <PostList posts={initialDisplayPosts} locale={locale} />
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              basePath={pagination.basePath}
            />
          )}
          {/* Mobile */}
          <LinksPanel
            linksPanelClass="mt-6 block w-full p-4 lg:hidden"
            locale={locale}
            fieldCount={categoryCount}
            basePath={pagination?.basePath}
            field="categories"
          />
          <LinksPanel
            linksPanelClass="mt-6 block w-full p-4 lg:hidden"
            locale={locale}
            fieldCount={tagCount}
            basePath={pagination?.basePath}
            field="tags"
          />
        </section>
      </div>
    </main>
  )
}
