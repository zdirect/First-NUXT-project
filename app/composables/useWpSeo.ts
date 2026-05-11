import type { WpSeoMeta, WpPage, WpPost } from '~/composables/useWp'

/**
 * A composable to easily set SEO meta tags based on Headless WordPress data.
 */
export function useWpSeo(data: Ref<WpPage | WpPost | null | undefined> | WpPage | WpPost | null | undefined) {
  // Use watchEffect or computed to update tags dynamically if data is reactive
  watchEffect(() => {
    const item = unref(data)
    if (!item) return

    // Extract SEO properties or fallback to page title/excerpt
    const title = item.seo?.title || item.title?.rendered || ''
    const description = item.seo?.description || (item as WpPost).excerpt?.rendered || ''
    const ogImage = item.seo?.ogImage || ''
    const robots = item.seo?.robots || 'index, follow'

    // Remove HTML tags from description if it comes from excerpt
    const plainDescription = description.replace(/<[^>]*>?/gm, '').trim()

    useSeoMeta({
      title: title,
      ogTitle: title,
      description: plainDescription,
      ogDescription: plainDescription,
      ogImage: ogImage,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: plainDescription,
      twitterImage: ogImage,
      robots: robots
    })
  })
}
