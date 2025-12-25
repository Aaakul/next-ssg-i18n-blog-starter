import { Blog } from 'contentlayer/generated'
import { CoreContent } from './contentlayer-utils'

export function findRelatedPosts(allBlogs: CoreContent<Blog>[], currentPost: CoreContent<Blog>) {
  if (!currentPost.categories || !currentPost.tags) return []
  const currentCategoriesSet = new Set(currentPost.categories)
  const currentTagsSet = new Set(currentPost.tags)

  const relatedPosts = allBlogs.filter((p) => {
    if (p.slug === currentPost.slug) {
      return false
    }

    const hasCommonCategory = p.categories.some((category) => currentCategoriesSet.has(category))
    const hasCommonTag = p.tags.some((tag) => currentTagsSet.has(tag))

    return hasCommonCategory && hasCommonTag
  })

  return relatedPosts.slice(0, 3)
}
