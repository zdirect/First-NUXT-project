<script setup lang="ts">
import { pickString, pickLink } from '~/utils/wpFields'

type FlexibleSection = Record<string, unknown>

const props = defineProps<{
  section: FlexibleSection
}>()

const heading = computed(() => (
  pickString(props.section.title)
  || 'About us'
))

const text = computed(() => (
  pickString(props.section.text)
))

const link = computed(() => (
  pickLink(props.section.link)
))

</script>
<template>
  <section class="py-25">
    <div class="container mx-auto">
      <div class="flex items-center justify-center flex-col text-center">
        <h2 class="text-[#B6A591] pb-7.5">{{ heading }}</h2>
        <p class="font-thin text-4xl pb-7.5" v-html="text"></p>
        <a class="text-white border border-white rounded-lg px-4 py-2 font-thin uppercase" v-if="link" :href="link.url" :target="link.target || '_blank'">{{link.title || 'More info' }}</a>
      </div>
    </div>
  </section>
</template>