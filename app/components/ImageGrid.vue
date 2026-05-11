<script setup lang="ts">
import { pickImageUrl } from '~/utils/wpFields'

interface FlexibleSection {
  image_left?: unknown
  image_right?: unknown
}

const props = defineProps<{
  section: FlexibleSection
}>()

const imageLeft = computed(() => (pickImageUrl(props.section.image_left) || ''))
const imageRight = computed(() => (pickImageUrl(props.section.image_right) || ''))
</script>

<template>
    <section class="pb-25">
    <div class="w-full">
      <div class="grid grid-cols-2 gap-[60px] items-stretch">
        <div class="rounded-lg overflow-hidden">
          <NuxtImg v-if="imageLeft" :src="imageLeft" sizes="100vw md:50vw" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="rounded-lg overflow-hidden">
          <NuxtImg v-if="imageRight" :src="imageRight" sizes="100vw md:50vw" alt="" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </section>
</template>
