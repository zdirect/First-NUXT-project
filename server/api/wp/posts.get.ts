import { Buffer } from 'buffer'
import { createError, getQuery } from 'h3'

function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const wpBaseUrl = String(config.public.wpBaseUrl || '').trim()

  if (!wpBaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'WP_BASE_URL_NOT_CONFIGURED' })
  }

  const query = getQuery(event)
  const rawPerPage = Array.isArray(query.perPage) ? query.perPage[0] : query.perPage
  const perPage = Number(rawPerPage ?? 10)
  const safePerPage = Number.isFinite(perPage) ? Math.min(Math.max(perPage, 1), 100) : 10

  const headers: Record<string, string> = { Accept: 'application/json' }
  const user = String(config.wpBasicAuthUser || '').trim()
  const pass = String(config.wpBasicAuthPassword || '').trim()
  if (user && pass) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`
  }

  return await $fetch(joinUrl(wpBaseUrl, '/wp-json/wp/v2/posts'), {
    headers,
    query: { per_page: safePerPage }
  })
})
