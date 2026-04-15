<script setup lang="ts">
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

import type { WpPage } from '~/composables/useWp'

const heroSlides = [
  {
    type: 'image',
    desktopSrc: '/images/img-hero-banner-01.webp',
    mobileSrc: '/images/img-hero-banner-01.webp',
    alt: 'Hero banner slide 1'
  },
  {
    type: 'image',
    desktopSrc: '/images/img-hero-banner-01.webp',
    mobileSrc: '/images/img-hero-banner-01.webp',
    alt: 'Hero banner slide 2'
  },
  {
    type: 'video',
    src: '/videos/video-hero-banner-01.mp4'
  }
] as const

type AcfFlexibleItem = Record<string, unknown> & { acf_fc_layout?: string }
type SectionComponent = 'HeroSection' | null

const homePageSlug = 'home'
const { isConfigured, getPageBySlug } = useWp()

const { data, pending, error } = await useAsyncData('wp-home-page', () => getPageBySlug(homePageSlug))

const homePage = computed(() => data.value as WpPage | null)
const sections = computed(() => {
  const rootSection = homePage.value?.section
  const acf = homePage.value?.acf as Record<string, unknown> | undefined
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

function getSectionComponent(section: AcfFlexibleItem): SectionComponent {
  const normalizedLayout = getLayoutName(section).toLowerCase().replace(/-/g, '_')
  if (normalizedLayout === 'hero_section' || normalizedLayout === 'hero') {
    return 'HeroSection'
  }
  return null
}
</script>
<template>
  <section v-if="!isConfigured" class="mt-5 p-3 border border-gray-300 rounded max-w-[900px] mx-auto">
    <p class="mb-2">Set the WordPress base URL to fetch homepage sections.</p>
    <pre class="whitespace-pre-wrap m-0">runtimeConfig.public.wpBaseUrl = 'https://your-wp-site.com'</pre>
  </section>

  <section v-else-if="pending" class="max-w-[900px] mx-auto p-6">Loading…</section>
  <section v-else-if="error" class="max-w-[900px] mx-auto p-6">Error: {{ errorMessage }}</section>

  <template v-else-if="sections.length">
    <section
      v-for="(section, index) in sections"
      :key="`${getLayoutName(section)}-${index}`"
      class="py-10"
    >
      <component
        :is="getSectionComponent(section) || 'div'"
        v-bind="getSectionComponent(section) ? { section } : {}"
      >
        <template v-if="!getSectionComponent(section)">
          <div class="container mx-auto">
            <div class="text-sm opacity-75 mb-3">Section: {{ getLayoutName(section) }}</div>
            <pre class="text-xs whitespace-pre-wrap leading-relaxed">{{ JSON.stringify(section, null, 2) }}</pre>
          </div>
        </template>
      </component>
    </section>
  </template>

  <template v-else>
  <section class="position-relative overflow-hidde w-full flex items-center justify-center min-h-dvh">
    <figcaption class="position-relative">
      <div class="absolute top-1/2 lg:left-15 z-10 left-20 text-center lg:text-left">
        <h1 class="lg:text-7xl font-thin pb-8 text-3xl">UK Specialist<br>
        Brick, Cast Stone <br>
        & Tile Systems</h1>
        <a href="#" target="_blank" class="text-white border border-white rounded-lg px-4 py-2 font-thin uppercase">Explore our range</a>
      </div>
    </figcaption>
    <div class="hero-banner-slideshow w-full">
      <Swiper
        :modules="[Autoplay]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        class="swiper-container"
      >
        <SwiperSlide
          v-for="slide in heroSlides"
          :key="slide.type === 'video' ? slide.src : slide.desktopSrc" class="swiper-slide">
          <div class="hero-banner-image w-full h-full">
            <template v-if="slide.type === 'image'">
              <picture>
                <source media="(max-width: 991px)" :srcset="slide.mobileSrc" />
                <img
                  :src="slide.desktopSrc"
                  loading="lazy"
                  :alt="slide.alt"
                  class="w-full h-full object-cover"
                />
              </picture>
            </template>
            <video
              v-else
              loop
              muted
              playsinline
              autoplay
              class="w-full h-full object-cover"
            >
              <source :src="slide.src" type="video/mp4" />
            </video>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
  <section class="py-25">
    <div class="container mx-auto">
      <div class="flex items-center justify-center flex-col text-center">
        <h2 class="text-[#B6A591] pb-7.5">About us</h2>
        <p class="font-thin text-4xl pb-7.5">At European Building Materials, we believe building is about trust and lasting value. We are here to offer honest guidance, responsible sourcing, and expert support. Whether residential or commercial, self-build or large-scale development we empower our clients to build with confidence and craftsmanship. </p>
        <a href="#" target="_blank" class="text-white border border-white rounded-lg px-4 py-2 font-thin uppercase">More info</a>
      </div>
    </div>
  </section>
  <section class="pb-25">
    <div class="w-full">
      <div class="grid grid-cols-2 gap-[60px] items-stretch">
        <div class="rounded-lg overflow-hidden">
          <img src="/images/image-column-1.jpg" alt="" class="w-full h-full object-cover">
        </div>
        <div class="rounded-lg overflow-hidden">
          <img src="/images/image-column-2.jpg" alt="" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
  </section>
  </template>
</template>
