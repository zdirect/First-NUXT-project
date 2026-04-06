<template>
  <div class="min-h-screen flex flex-col">
    <header class="h-[147px] flex items-center justify-center">
      <div class="w-full px-4 sm:px-6 lg:px-24">
        <div class="flex items-center justify-between">
          <div class="logo" v-if="logoSrc">
            <NuxtLink to="/">
              <img :src="logoSrc" alt="Nuxt + Headless WordPress" />
            </NuxtLink>
          </div>
          <div class="header-top-right flex items-center">
            <ul class="flex gap-11 text-white text-sm">
              <li v-for="item in headerMenu" :key="item.key">
                <component
                  :is="item.isExternal ? 'a' : NuxtLink"
                  :href="item.isExternal ? item.href : undefined"
                  :to="item.isExternal ? undefined : item.href"
                  :target="item.isExternal ? '_blank' : undefined"
                  :rel="item.isExternal ? 'noreferrer' : undefined"
                  class="group relative px-1 py-1"
                >
                  {{ item.label }}
                  <span class="absolute left-1/2 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </component>
              </li>
              <li class="relative">
                <NuxtLink
                  to="/search"
                  class="group relative px-1 py-1 after:content-[url('/images/search-icon.svg')] after:absolute after:top-[7px] after:translate-y-[-50%] after:right-[-19px] after:w-[13px] after:h-[13px] hover:after:opacity-100 after:transition-opacity after:duration-300"
                >
                  Search
                  <span class="absolute left-1/2 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </NuxtLink>
              </li>
            </ul>
            <div class="header-top-link" v-if="link_contact">
              <NuxtLink
                :to="link_contact.url"
                :target="link_contact.target || null"
                :rel="link_contact.target === '_blank' ? 'noopener noreferrer' : null"
                class="text-white bg-[#866949] rounded-lg flex items-center justify-center ml-11 uppercase p-4 text-sm h-[41px] w-[153px]"
              >
                {{ link_contact.title }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1">
        <slot />
    </main>

    <footer class="bg-[#866949] text-white p-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-24">
        <div class="flex items-center justify-center pb-12">
          <img src="/images/logo-footer.svg" alt="Nuxt + Headless WordPress" />
        </div>
        <div class="flex flex-col gap-10 md:flex-row md:items-start md:justify-between text-center">
          <div class="md:flex-1 text-base">
            <address class="mb-4" v-if="address" v-html="address"></address>
            <div class="flex flex-col">
              <a
                v-for="l in contact_links"
                :key="l.key"
                :href="l.url"
                :target="l.target"
              >
                {{ l.title }}
              </a>
            </div>
          </div>
          <div class="md:flex-1">
            <ul>
              <li><NuxtLink to="/" class="text-base">FAQs</NuxtLink></li>
              <li><NuxtLink to="/" class="text-base">Cookies Policy</NuxtLink></li>
              <li><NuxtLink to="/" class="text-base">Privacy Policy</NuxtLink></li>
            </ul>
            <div class="flex gap-3 justify-center pt-5">
              <a href="#" aria-label="LinkedIn" class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="#" aria-label="Instagram" class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
                <i class="fa-brands fa-instagram"></i>
              </a>
            </div>
            <p class="text-xs leading-5 pt-5">
              All copyrights reserved © {{ year }} EBM <br />
              Designed by Creative Affairs
            </p>
          </div>
          <div class="md:flex-1">
            <h4 class="text-xs mb-5">Recognition:</h4>
            <div class="flex justify-center flex-col items-center">
              <img src="/images/riba-logo-png-transparent.svg" alt="" class="mb-5 max-w-[100px]" />
              <img src="/images/bda-landscape-logo-600.svg" alt="" class="mb-5 max-w-[100px]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { NuxtLink } from '#components'
  import type { WpGlobalSettings } from '~/composables/useWp'

  const year = new Date().getFullYear()

  const { getGlobalSettings, getMenu } = useWp()

  async function fetchHeaderMenu() {
    try {
      return await getMenu({ id: 40 }) 
    } catch {
      return [] 
    }
  }

  const { data: wpMenu } = await useAsyncData('wp-menu-40', fetchHeaderMenu)

  async function fetchGlobalSettings() {
    try {
      return await getGlobalSettings()
    } catch {
      return {} as WpGlobalSettings
    }
  }

  const { data: wpGlobal } = await useAsyncData('wp-global-settings', fetchGlobalSettings)

  const logoSrc = computed(() => {
    const logo = (wpGlobal.value as any)?.logo?.url ?? null
    if (logo) {
      return logo
    }
    return '/images/logo2.svg'
  })

  const link_contact =  computed(() => {
    const link = (wpGlobal.value as any)?.link_contact ?? null
    if (link) {
      return link
    }
    return ''
  })

  const address =  computed(() => {
    const addr = (wpGlobal.value as any)?.address ?? null
    if (addr) {
      return addr
    }
    return ''
  })

  const contact_links = computed(() => {
    const raw = (wpGlobal.value as any)?.contact_links

    if (!Array.isArray(raw)) return []

    return raw.flatMap((row: any) => {
        const link = row?.link
        if (!link) return []

        const title = String(link?.title ?? '').trim()
        const url = String(link?.url ?? '').trim()
        const target = String(link?.target ?? '').trim()

        if (!title || !url) return []

        return [
          {
            key: `${url}`,
            title,
            url,
            target: target || undefined
          }
        ]
      })
  })

  const headerMenu = computed(() => {
    const items = wpMenu.value ?? []
    return items.map((item, index) => {
      const href = item.url.trim()
      const isExternal = /^https?:\/\//.test(href)
      return {
        key: `${item.id || index}-${href}`,
        label: item.title,
        href,
        isExternal
      }
    })
  })
</script>
