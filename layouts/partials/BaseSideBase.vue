<template>
    <div class="flex bg-color flex-col items-center justify-between w-16 h-screen fixed left-0 z-[21] pb-3">
        <div class="mb-2">
            <div class="overflow-hidden w-[50px] h-[50px] inline-flex items-center justify-center">
                <img class="object-cover rounded-xl" :src="$url('/assets/logos/DGI-WORKSPACE-logo-short.png')"
                    alt="Short logo" />
            </div>
            <div class="flex flex-col items-center gap-3 h-full">
                <a :href="$modulesUrls.dashboard"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.dashboard ?? '') }">
                    <HomeIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.drive"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.drive ?? '') }">
                    <HardDriveIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.chat"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.chat ?? '') }">
                    <MessageSquareIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.meet"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.meet ?? '') }">
                    <VideoIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.team"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.team ?? '') }">
                    <UsersIcon class="size-6" />
                </a>
                <a :href="$modulesUrls.contact"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.contact ?? '') }">
                    <ContactIcon class="size-6" />
                </a>
                <a :href="$modulesUrls.ai"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.ai ?? '') }">
                    <BotIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.mail"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.mail ?? '') }">
                    <MailIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.calendar"
                    class="app-icon-btn py-5 transition-all duration-300 ease-in-out hover:!bg-gray-300"
                    :class="{ 'active': getCurrentDomain() === getUrlDomain($modulesUrls.calendar ?? '') }">
                    <CalendarIcon class="size-6" stroke-width="1.5" />
                </a>

            </div>
        </div>
        <AppButton @click="showLogoutModal = true" icon secondary :filled="false">
            <LogOutIcon class="size-5" stroke-width="1.5" />
        </AppButton>
    </div>

    <Transition name="side-bar-left">
        <div v-show="sideStore.show" class="w-[360px] pl-20 fixed z-[20] bg-white h-screen">
            <div class="h-full overflow-y-auto bg-white rounded-lg ">
                <component :is="$route.meta.sidebar" />
            </div>
        </div>
    </Transition>
    <Transition name="fade">
        <div v-if="sideStore.show" class="w-screen h-screen bg-black/50 fixed lg:hidden"></div>
    </Transition>
    <ConfirmationModal :show="showLogoutModal" title="Déconnexion" description="Souhaitez vous vous déconnecter ?"
        @cancel="onLogoutResponse(false)" @confirm="onLogoutResponse(true)" />
</template>
<script setup lang="ts">
import ConfirmationModal from '../../components/dialogs/ConfirmationModal.vue'

import { useAuthStore } from "../../stores/auth";
import { useSideBar } from '../../stores/sidebar';
import { BotIcon, CalendarIcon, ContactIcon, HardDriveIcon, HomeIcon, LogOutIcon, MailIcon, MessageSquareIcon, UsersIcon, VideoIcon } from 'lucide-vue-next'
import { ref } from 'vue'
const authStore = useAuthStore()
const sideStore = useSideBar()

const showLogoutModal = ref(false)
const onLogoutResponse = (resp: boolean) => {
    showLogoutModal.value = false
    if (resp) {
        authStore.logout()
    }
}

const getCurrentDomain = () => (
    getUrlDomain(document.location.href)
)

const getUrlDomain = (url: string) => (
    url.match(/http[s]?:\/\/([^\/]+)/)?.[1] || ''
)
</script>
