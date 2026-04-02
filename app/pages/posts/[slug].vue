<template>
  <main class="max-w-[900px] mx-auto p-6">
    <header class="flex gap-3 items-baseline">
      <NuxtLink to="/">← Back</NuxtLink>
      <h1 class="m-0" v-html="post?.title.rendered" />
    </header>

    <section v-if="!isConfigured" class="mt-5 p-3 border border-gray-300 rounded">
      <p class="mb-2">Set the WordPress base URL to fetch the post.</p>
      <pre class="whitespace-pre-wrap m-0">runtimeConfig.public.wpBaseUrl = 'https://your-wp-site.com'</pre>
    </section>

    <section v-else class="mt-5">
      <p v-if="pending" class="m-0">Loading…</p>
      <p v-else-if="error" class="m-0">Error: {{ errorMessage }}</p>
      <p v-else-if="!post" class="m-0">Post not found.</p>
      <article v-else>
        <div class="opacity-75 text-sm mb-3">
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
