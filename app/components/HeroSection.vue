<script setup lang="ts">
import { pickImageUrl, pickString } from '~/utils/wpFields'

interface FlexibleSection {
  title?: unknown
  text?: unknown
  button_text?: unknown
  cta_text?: unknown
  button_url?: unknown
  cta_url?: unknown
  image?: unknown
  [key: string]: unknown
}

const props = defineProps<{
  section: FlexibleSection
}>()

const heading = computed(() => (
  pickString(props.section.title)
  || 'Hero Section'
))

const cleanHeading = computed(() => (
  heading.value.replace(/<\/?[^>]+(>|$)/g, '')
))

const text = computed(() => (
  pickString(props.section.text)
))

const ctaText = computed(() => (
  pickString(props.section.button_text)
  || pickString(props.section.cta_text)
  || 'Learn more'
))

const ctaUrl = computed(() => (
  pickString(props.section.button_url)
  || pickString(props.section.cta_url)
  || '#'
))

const backgroundImage = computed(() => (
  pickImageUrl(props.section.image)
))
</script>

<template>
  <section class="relative w-full min-h-[70vh] flex items-center justify-center text-white">
    <NuxtImg
      v-if="backgroundImage"
      :src="backgroundImage"
      :alt="cleanHeading"
      sizes="100vw"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-black/45" />

    <div class="relative z-10 container mx-auto px-6 text-center lg:text-left">
      <h1 class="lg:text-7xl text-3xl font-thin pb-8" v-html="heading" />
      <p v-if="text" class="max-w-3xl mx-auto lg:mx-0 pb-8 text-lg font-thin">
        {{ text }}
      </p>
      <a
        :href="ctaUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block text-white border border-white rounded-lg px-4 py-2 font-thin uppercase"
      >
        {{ ctaText }}
      </a>
    </div>
  </section>
</template>
