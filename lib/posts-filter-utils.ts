import { Blog } from 'contentlayer/generated'

export function findRelatedPosts(
  allBlogs: Blog[],
  currentPost: Blog
): { title: string; path: string }[] {
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

  return relatedPosts
    .map((p) => ({
      title: p.title,
      path: p.language + '/blog/' + p.slug,
    }))
    .slice(0, 3)
}
