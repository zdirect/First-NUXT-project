export function pickString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function pickImageUrl(value: unknown) {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const maybeObject = value as Record<string, unknown>
  return pickString(maybeObject.url)
}

export function pickLink(value: unknown) {
  if (typeof value === 'string') {
    const url = value.trim()
    return url ? { title: '', url, target: '' } : null
  }
  if (!value || typeof value !== 'object') return null

  const maybeObject = value as Record<string, unknown>
  const url = pickString(maybeObject.url)
  if (!url) return null

  return {
    title: pickString(maybeObject.title),
    url,
    target: pickString(maybeObject.target)
  }
}
