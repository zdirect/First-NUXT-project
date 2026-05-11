import { Buffer } from 'buffer'
import { createError, readBody } from 'h3'

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

  const headers: Record<string, string> = { 
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const user = String(config.wpBasicAuthUser || '').trim()
  const pass = String(config.wpBasicAuthPassword || '').trim()
  if (user && pass) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`
  }

  const path = '/wp-json/custom/v1/contact'
  const body = await readBody(event)

  try {
    const response = await $fetch(joinUrl(wpBaseUrl, path), { 
      method: 'POST',
      headers,
      body
    })
    return response
  } catch (err: any) {
    console.error('WP Contact API Error:', err.message)
    throw createError({ statusCode: 502, statusMessage: 'WP_CONTACT_FETCH_FAILED' })
  }
})
