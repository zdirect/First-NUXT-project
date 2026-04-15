type WpPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string; protected?: boolean }
  content: { rendered: string; protected?: boolean }
}

type WpPage = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  content: { rendered: string; protected?: boolean }
  acf?: Record<string, unknown>
  section?: unknown
}

type WpMenuItem = {
  id: number
  title: string
  url: string
}

type WpGlobalSettings = Record<string, unknown>

export function useWp() {
  const config = useRuntimeConfig()
  const wpBaseUrl = String(config.public.wpBaseUrl || '').trim()

  const isConfigured = computed(() => wpBaseUrl.length > 0)

  /**
   * Fetch data from WordPress API.
   */
  async function apiFetch<T>(path: string, options?: Parameters<typeof $fetch<T>>[1]) {
    if (!wpBaseUrl) {
      throw new Error('WP_BASE_URL_NOT_CONFIGURED')
    }

    return await $fetch<T>(path, options)
  }

  async function getPosts(params?: { perPage?: number }) {
    const perPage = params?.perPage ?? 10
    return await apiFetch<WpPost[]>('/api/wp/posts', {
      query: { perPage } 
    })
  }

  /**
   * Get a post by slug.
   */
  async function getPostBySlug(slug: string) {
    return await apiFetch<WpPost | null>(`/api/wp/posts/${encodeURIComponent(slug)}`)
  }

  async function getPageBySlug(slug: string) {
    return await apiFetch<WpPage | null>(`/api/wp/pages/${encodeURIComponent(slug)}`)
  }

  /**
   * Get a menu by ID.
   */
  async function getMenu(params: { id: number }) {
    return await apiFetch<WpMenuItem[]>(`/api/wp/menus/${params.id}`)
  }

  /**
   * Get global settings.
   */
  async function getGlobalSettings() {
    return await apiFetch<WpGlobalSettings>('/api/wp/global-settings')
  }

  return {
    isConfigured,
    getPosts,
    getPostBySlug,
    getPageBySlug,
    getMenu,
    getGlobalSettings
  }
}

export type { WpGlobalSettings, WpMenuItem, WpPage, WpPost }
