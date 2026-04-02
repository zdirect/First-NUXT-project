<template>
  <main class="max-w-[900px] mx-auto p-6">
    <section v-if="!isConfigured" class="mt-5 p-3 border border-gray-300 rounded">
      <p class="mb-2">Set the WordPress base URL to fetch posts.</p>
      <pre class="whitespace-pre-wrap m-0">runtimeConfig.public.wpBaseUrl = 'https://your-wp-site.com'</pre>
    </section>

    <section v-else class="mt-5">
      <p v-if="pending" class="m-0">Loading…</p>
      <p v-else-if="error" class="m-0">
        Error: {{ errorMessage }}
      </p>

      <div v-else>
        <p class="mb-4">Latest posts:</p>
        <ul class="grid gap-2 pl-[18px]">
          <li v-for="post in posts" :key="post.id">
            <NuxtLink :to="`/posts/${post.slug}`">
              {{ post.title.rendered }}
            </NuxtLink>
            <div class="opacity-75 text-sm text-white">
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
