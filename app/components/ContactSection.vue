<script setup lang="ts">
import { pickString } from '~/utils/wpFields'
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#app'

interface FlexibleSection {
  [key: string]: unknown
  text?: string
  title?: string
  phone?: unknown
  email?: unknown
}

const props = defineProps<{
  section?: FlexibleSection
}>()

const title = computed(() => pickString(props.section?.title) || '')
const text = computed(() => pickString(props.section?.text) || '')
const phone = computed(() => pickLink(props.section?.phone) || '')
const email = computed(() => pickLink(props.section?.email) || '')

const config = useRuntimeConfig()

// Form State
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  profession: '',
  company: '',
  projectLocation: '',
  subject: '',
  inquiry: '',
  acceptPrivacy: false,
  receiveUpdates: false,
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    // Call the Nuxt server route which will securely proxy to WP with Basic Auth
    const endpoint = `/api/wp/contact`

    const response: any = await $fetch(endpoint, {
      method: 'POST',
      // Send data as JSON
      body: formData.value,
    })

    if (response.success) {
      submitSuccess.value = true
      // Clear form
      formData.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        profession: '',
        company: '',
        projectLocation: '',
        subject: '',
        inquiry: '',
        acceptPrivacy: false,
        receiveUpdates: false,
      }
    } else {
      submitError.value = response.message || 'An error occurred while sending.'
    }
  } catch (error: any) {
    console.error('Form submission error:', error)
    submitError.value = 'Failed to submit the form. Please try again later.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="text-white py-20 px-6 md:px-12 lg:px-24 bg-[#1c1c1c] w-full min-h-screen">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
      <!-- Left column -->
      <div class="flex flex-col">
        <h1 class="text-5xl md:text-6xl lg:text-[4rem] font-light mb-8 text-[#e8e8e8] tracking-tight" v-if="title">
          {{ title }}
        </h1>
        
        <div class="text-[#b3b3b3] space-y-6 mb-12 text-sm md:text-base leading-relaxed max-w-lg font-light tracking-wide" v-if="text" v-html="text"></div>

        <div class="space-y-4 text-[#e8e8e8] font-light">
          <div class="flex items-center gap-4" v-if="email">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <a :href="email.url" class="hover:underline text-sm md:text-base" :target="email.target || '_self'">{{ email.title }}</a>
          </div>
          <div class="flex items-center gap-4" v-if="phone">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.436-4.136-7.032-7.032l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            <a :href="phone.url" class="hover:underline text-sm md:text-base" :target="phone.target || '_self'">{{ phone.title }}</a>
          </div>
        </div>
      </div>

      <!-- Right column (Form) -->
      <div>
        <form @submit.prevent="submitForm" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input v-model="formData.firstName" type="text" placeholder="FIRST NAME*" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors" required />
            <input v-model="formData.lastName" type="text" placeholder="LAST NAME*" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors" required />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input v-model="formData.email" type="email" placeholder="E-MAIL*" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors" required />
            <input v-model="formData.phone" type="tel" placeholder="PHONE*" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors" required />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input v-model="formData.profession" type="text" placeholder="PROFESSION*" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors" required />
            <input v-model="formData.company" type="text" placeholder="COMPANY*" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors" required />
          </div>

          <input v-model="formData.projectLocation" type="text" placeholder="PROJECT LOCATION" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors" />
          
          <input v-model="formData.subject" type="text" placeholder="SUBJECT*" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors" required />

          <textarea v-model="formData.inquiry" placeholder="INQUIRY*" rows="5" class="w-full bg-transparent border border-[#4d4d4d] text-white px-4 py-3 rounded-md focus:outline-none focus:border-white placeholder:text-[#808080] placeholder:text-xs placeholder:tracking-wider transition-colors resize-none" required></textarea>

          <div class="space-y-4 pt-4">
            <label class="flex items-start gap-3 cursor-pointer group">
              <div class="relative flex items-center justify-center mt-0.5">
                <input v-model="formData.acceptPrivacy" type="checkbox" class="peer appearance-none w-5 h-5 border border-[#4d4d4d] rounded-sm bg-transparent checked:bg-white checked:border-white transition-all cursor-pointer" required />
                <svg class="absolute w-3.5 h-3.5 text-[#1c1c1c] opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span class="text-[#b3b3b3] text-sm group-hover:text-white transition-colors">
                I have read and accepted the <a href="#" class="underline hover:text-white">Privacy Policy</a>.*
              </span>
            </label>

            <label class="flex items-start gap-3 cursor-pointer group">
              <div class="relative flex items-center justify-center mt-0.5">
                <input v-model="formData.receiveUpdates" type="checkbox" class="peer appearance-none w-5 h-5 border border-[#4d4d4d] rounded-sm bg-transparent checked:bg-white checked:border-white transition-all cursor-pointer" />
                <svg class="absolute w-3.5 h-3.5 text-[#1c1c1c] opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span class="text-[#b3b3b3] text-sm group-hover:text-white transition-colors">
                I would like to receive e-mail updates from EBM.
              </span>
            </label>
          </div>

          <div v-if="submitSuccess" class="p-4 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm">
            Thank you! Your message has been sent successfully.
          </div>
          
          <div v-if="submitError" class="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {{ submitError }}
          </div>

          <div class="pt-6">
            <button :disabled="isSubmitting" type="submit" class="bg-white text-[#1c1c1c] text-xs font-bold px-6 py-2.5 rounded hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isSubmitting">SENDING...</span>
              <span v-else>SUBMIT</span>
              <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
              <!-- Loading spinner -->
              <svg v-else class="animate-spin h-4 w-4 text-[#1c1c1c]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
