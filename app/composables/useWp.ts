type WpPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string; protected?: boolean }
  content: { rendered: string; protected?: boolean }
}

type WpMenuItem = {
  id: number
  title: string
  url: string
}

export function useWp() {
  const config = useRuntimeConfig()
  const wpBaseUrl = String(config.public.wpBaseUrl || '').trim()

  const isConfigured = computed(() => wpBaseUrl.length > 0)

  async function apiFetch<T>(path: string, options?: Parameters<typeof $fetch<T>>[1]) {
    if (!wpBaseUrl) {
      throw new Error('WP_BASE_URL_NOT_CONFIGURED')
    }

    return await $fetch<T>(path, options)
  }

  async function getPosts(params?: { perPage?: number }) {
    const perPage = params?.perPage ?? 10
    return await apiFetch<WpPost[]>('/api/wp/posts', { query: { perPage } })
  }

  async function getPostBySlug(slug: string) {
    return await apiFetch<WpPost | null>(`/api/wp/posts/${encodeURIComponent(slug)}`)
  }

  async function getMenu(params: { id: number }) {
    return await apiFetch<WpMenuItem[]>(`/api/wp/menus/${params.id}`)
  }

  return {
    isConfigured,
    getPosts,
    getPostBySlug,
    getMenu
  }
}

export type { WpMenuItem, WpPost }
