<script setup lang="ts">
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

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
</script>
<template>
  <section class="position-relative overflow-hidde w-full flex items-center justify-center min-h-dvh">
    <figcaption class="position-relative top-1/2 left-1/2">
        <h1>UK Specialist<br>
        Brick, Cast Stone <br>
        & Tile Systems</h1>
        <a href="#" target="_blank">Explore our range</a>
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
</template>
