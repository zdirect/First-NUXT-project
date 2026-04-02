import { Buffer } from 'buffer'
import { createError, getRouterParam } from 'h3'

function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}

function normalizeItems(items: unknown) {
  if (!Array.isArray(items)) return []

  return items
    .map((item: any) => {
      const title = String(item?.title?.rendered ?? item?.title ?? item?.name ?? '').trim()
      const url = String(item?.url ?? item?.link ?? '').trim()
      const id = Number(item?.id ?? item?.ID ?? 0)

      return title && url ? { id: Number.isFinite(id) ? id : 0, title, url } : null
    })
    .filter(Boolean) as Array<{ id: number; title: string; url: string }>
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const wpBaseUrl = String(config.public.wpBaseUrl || '').trim()

  if (!wpBaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'WP_BASE_URL_NOT_CONFIGURED' })
  }

  const rawId = String(getRouterParam(event, 'id') || '').trim()
  const menuId = Number(rawId)
  if (!Number.isFinite(menuId) || menuId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'MENU_ID_INVALID' })
  }

  const headers: Record<string, string> = { Accept: 'application/json' }
  const user = String(config.wpBasicAuthUser || '').trim()
  const pass = String(config.wpBasicAuthPassword || '').trim()
  if (user && pass) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`
  }

  const path = `/wp-json/nuxt/v1/menu/${menuId}`

  try {
    const result: unknown = await $fetch(joinUrl(wpBaseUrl, path), { headers })
    const items = normalizeItems(result)
    return items
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'WP_MENU_FETCH_FAILED' })
  }
})
