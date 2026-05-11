<script setup lang="ts">
import type { Component } from 'vue'

import type { WpPage } from '~/composables/useWp'
import HeroSection from '~/components/HeroSection.vue'
import TextSection from '~/components/TextSection.vue'
import ImageGrid from '~/components/ImageGrid.vue'
import PartnersSection from '~/components/PartnersSection.vue'
import ContactSection from '~/components/ContactSection.vue'

type AcfFlexibleItem = Record<string, unknown> & { acf_fc_layout?: string }

const sectionComponentByLayout: Record<string, Component> = {
  hero: HeroSection,
  text: TextSection,
  imagegrid: ImageGrid,
  partners: PartnersSection,
  contact: ContactSection, // Maps to 'contact' layout in ACF
  contact_section: ContactSection, // Alternative layout name just in case
}

const route = useRoute()
const { isConfigured, getPageBySlug } = useWp()

// Extract the slug from the [...slug] route parameter
const pageSlug = computed(() => {
  const slugParam = route.params.slug
  if (Array.isArray(slugParam)) {
    return slugParam[slugParam.length - 1] || '' // Typically use the last part for WP, or join them
  }
  return slugParam || ''
})

const { data, pending, error } = await useAsyncData(`wp-page-${pageSlug.value}`, () => getPageBySlug(pageSlug.value))

const pageData = computed(() => data.value as WpPage | null)

// Apply SEO meta tags based on the WordPress page data
useWpSeo(pageData)

const sections = computed(() => {
  const rootSection = pageData.value?.section
  const acf = pageData.value?.acf as Record<string, unknown> | undefined
  const raw = Array.isArray(rootSection) ? rootSection : acf?.section
  return Array.isArray(raw) ? (raw as AcfFlexibleItem[]) : []
})

const errorMessage = computed(() => {
  const value = error.value
  if (!value) return ''
  if (value instanceof Error) return value.message
  return String(value)
})

function getLayoutName(section: AcfFlexibleItem) {
  return typeof section.acf_fc_layout === 'string' && section.acf_fc_layout.trim()
    ? section.acf_fc_layout.trim()
    : 'unknown'
}

function normalizeLayoutName(layoutName: string) {
  return layoutName.toLowerCase().replace(/-/g, '_')
}

const resolvedSections = computed(() => (
  sections.value.map((section, index) => {
    const rawLayout = getLayoutName(section)
    const normalizedLayout = normalizeLayoutName(rawLayout)
    const component = sectionComponentByLayout[normalizedLayout] ?? null
    return {
      key: `${normalizedLayout}-${index}`,
      section,
      rawLayout,
      normalizedLayout,
      component
    } as const
  })
))
</script>

<template>
  <section v-if="!isConfigured" class="mt-5 p-3 border border-gray-300 rounded max-w-[900px] mx-auto">
    <p class="mb-2">Set the WordPress base URL to fetch homepage sections.</p>
    <pre class="whitespace-pre-wrap m-0">runtimeConfig.public.wpBaseUrl = 'https://your-wp-site.com'</pre>
  </section>

  <section v-else-if="pending" class="max-w-[900px] mx-auto p-6">Loading…</section>
  <section v-else-if="error" class="max-w-[900px] mx-auto p-6">Error: {{ errorMessage }}</section>
  <section v-else-if="!pageData" class="max-w-[900px] mx-auto p-6">Page not found</section>

  <template v-else-if="sections.length">
    <template v-for="item in resolvedSections" :key="item.key">
      <component
        v-if="item.component"
        :is="item.component"
        :section="item.section"
      />

      <section v-else class="py-10">
        <div class="container mx-auto">
          <div class="text-sm opacity-75 mb-3">Section: {{ item.rawLayout }}</div>
          <pre class="text-xs whitespace-pre-wrap leading-relaxed">{{ JSON.stringify(item.section, null, 2) }}</pre>
        </div>
      </section>

    </template>
  </template>
  
  <template v-else>
    <main class="max-w-[900px] mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">{{ pageData.title?.rendered || 'Untitled Page' }}</h1>
      <div v-html="pageData.content?.rendered" class="prose prose-lg max-w-none"></div>
    </main>
  </template>
</template>
