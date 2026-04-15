<script setup lang="ts">
type FlexibleSection = Record<string, unknown>

const props = defineProps<{
  section: FlexibleSection
}>()

function pickString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function pickImageUrl(value: unknown) {
  if (!value || typeof value !== 'object') return ''
  const maybeObject = value as Record<string, unknown>
  return pickString(maybeObject.url)
}

const heading = computed(() => (
  pickString(props.section.heading)
  || pickString(props.section.title)
  || 'Hero Section'
))

const text = computed(() => (
  pickString(props.section.text)
  || pickString(props.section.description)
  || pickString(props.section.subtitle)
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
  pickString(props.section.background_image_url)
  || pickImageUrl(props.section.background_image)
  || pickImageUrl(props.section.image)
))
</script>

<template>
  <section class="relative w-full min-h-[70vh] flex items-center justify-center text-white">
    <img
      v-if="backgroundImage"
      :src="backgroundImage"
      :alt="heading"
      class="absolute inset-0 w-full h-full object-cover"
    >
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
