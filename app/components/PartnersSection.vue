<script setup lang="ts">
import { pickString, pickImageUrl } from '~/utils/wpFields'

interface FlexibleSection {
  title?: unknown
  content?: unknown
  logo?: unknown
  link?: unknown
}

const props = defineProps<{
  section?: FlexibleSection
}>()

const title = computed(() => pickString(props.section?.title) || 'Our Partners')

const partnersList = computed(() => {
  if (Array.isArray(props.section?.content) && props.section.content.length > 0) {
    return props.section.content.map((item: any) => ({
      logo: pickImageUrl(item.logo) || '',
      link_url: item.link.url || '#',
      link_target: item.link.target || '_self',
    }))
  }
  return []
})
</script>

<template>
  <section class="w-full py-16 flex flex-col items-center justify-center">
    <!-- Section Title -->
    <h2 class="text-[#B6A591] text-[14px] uppercase tracking-[0.42px] font-normal mb-[46px] text-center font-['Haas_Grot_Disp_Trial',_sans-serif]">
      {{ title }}
    </h2>

    <!-- Logos Container -->
    <div v-if="partnersList.length > 0" class="flex flex-col md:flex-row items-center justify-center gap-y-12 md:gap-x-[80px] w-full max-w-[1183px] mx-auto px-6">
      <a 
        v-for="(partner, idx) in partnersList" 
        :key="idx"
        :href="partner.link_url" 
        :target="partner.link_target" 
        class="block transition-opacity hover:opacity-80"
      >
        <img 
          v-if="partner.logo"
          :src="partner.logo" 
          alt="Partner Logo" 
          class="max-h-[73px] max-w-[378px] w-auto object-contain"
        />
      </a>
    </div>
  </section>
</template>
