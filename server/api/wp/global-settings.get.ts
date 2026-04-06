import { Buffer } from 'buffer'
import { createError } from 'h3'

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

  const headers: Record<string, string> = { Accept: 'application/json' }
  const user = String(config.wpBasicAuthUser || '').trim()
  const pass = String(config.wpBasicAuthPassword || '').trim()
  if (user && pass) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`
  }

  const path = '/wp-json/nuxt/v1/global-settings'

  try {
    return await $fetch(joinUrl(wpBaseUrl, path), { headers })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'WP_GLOBAL_SETTINGS_FETCH_FAILED' })
  }
})
