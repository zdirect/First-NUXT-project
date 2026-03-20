<template>
  <main style="max-width: 900px; margin: 0 auto; padding: 24px">
    <header style="display: flex; gap: 12px; align-items: baseline">
      <NuxtLink to="/">← Back</NuxtLink>
      <h1 style="margin: 0" v-html="post?.title.rendered" />
    </header>

    <section v-if="!isConfigured" style="margin-top: 20px; padding: 12px; border: 1px solid #ddd">
      <p style="margin: 0 0 8px">Set the WordPress base URL to fetch the post.</p>
      <pre style="margin: 0; white-space: pre-wrap">runtimeConfig.public.wpBaseUrl = 'https://your-wp-site.com'</pre>
    </section>

    <section v-else style="margin-top: 20px">
      <p v-if="pending" style="margin: 0">Loading…</p>
      <p v-else-if="error" style="margin: 0">Error: {{ errorMessage }}</p>
      <p v-else-if="!post" style="margin: 0">Post not found.</p>
      <article v-else>
        <div style="opacity: 0.75; font-size: 14px; margin-bottom: 12px">
          {{ new Date(post.date).toLocaleString() }}
        </div>
        <div v-html="post.content.rendered" />
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { WpPost } from '~/composables/useWp'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { isConfigured, getPostBySlug } = useWp()

const { data, pending, error } = await useAsyncData(
  () => `wp-post-${slug.value}`,
  () => getPostBySlug(slug.value),
  { watch: [slug] }
)

const post = computed(() => data.value as WpPost | null)

const errorMessage = computed(() => {
  const value = error.value
  if (!value) return ''
  if (value instanceof Error) return value.message
  return String(value)
})
</script>
