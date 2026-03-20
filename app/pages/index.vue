<template>
  <main style="max-width: 900px; margin: 0 auto; padding: 24px">
    <header style="display: flex; gap: 12px; align-items: baseline; justify-content: space-between">
      <h1 style="margin: 0">Nuxt + Headless WordPress</h1>
      <a href="https://nuxt.com" target="_blank" rel="noreferrer">Nuxt</a>
    </header>

    <section v-if="!isConfigured" style="margin-top: 20px; padding: 12px; border: 1px solid #ddd">
      <p style="margin: 0 0 8px">Set the WordPress base URL to fetch posts.</p>
      <pre style="margin: 0; white-space: pre-wrap">runtimeConfig.public.wpBaseUrl = 'https://your-wp-site.com'</pre>
    </section>

    <section v-else style="margin-top: 20px">
      <p v-if="pending" style="margin: 0">Loading…</p>
      <p v-else-if="error" style="margin: 0">
        Error: {{ errorMessage }}
      </p>

      <div v-else>
        <p style="margin: 0 0 16px">Latest posts:</p>
        <ul style="display: grid; gap: 10px; padding-left: 18px">
          <li v-for="post in posts" :key="post.id">
            <NuxtLink :to="`/posts/${post.slug}`">
              {{ post.title.rendered }}
            </NuxtLink>
            <div style="opacity: 0.75; font-size: 14px">
              {{ new Date(post.date).toLocaleString() }}
            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { WpPost } from '~/composables/useWp'

const { isConfigured, getPosts } = useWp()

const { data, pending, error } = await useAsyncData('wp-posts', () => getPosts({ perPage: 10 }))

const posts = computed(() => (data.value ?? []) as WpPost[])

const errorMessage = computed(() => {
  const value = error.value
  if (!value) return ''
  if (value instanceof Error) return value.message
  return String(value)
})
</script>
