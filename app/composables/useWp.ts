type WpPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string; protected?: boolean }
  content: { rendered: string; protected?: boolean }
}

function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}

export function useWp() {
  const config = useRuntimeConfig()
  const wpBaseUrl = String(config.public.wpBaseUrl || '').trim()

  const isConfigured = computed(() => wpBaseUrl.length > 0)

  async function wpFetch<T>(path: string, options?: Parameters<typeof $fetch<T>>[1]) {
    if (!wpBaseUrl) {
      throw new Error('WP_BASE_URL_NOT_CONFIGURED')
    }

    return await $fetch<T>(joinUrl(wpBaseUrl, path), {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options?.headers || {})
      }
    })
  }

  async function getPosts(params?: { perPage?: number }) {
    const perPage = params?.perPage ?? 10
    const query = new URLSearchParams({ per_page: String(perPage) })
    return await wpFetch<WpPost[]>(`/wp-json/wp/v2/posts?${query.toString()}`)
  }

  async function getPostBySlug(slug: string) {
    const query = new URLSearchParams({ slug })
    const result = await wpFetch<WpPost[]>(`/wp-json/wp/v2/posts?${query.toString()}`)
    return result[0] ?? null
  }

  return {
    isConfigured,
    getPosts,
    getPostBySlug
  }
}

export type { WpPost }
