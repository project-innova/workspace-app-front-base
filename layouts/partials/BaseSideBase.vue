<template>
    <div class="flex bg-color flex-col items-center justify-between w-16 h-screen fixed left-0 z-[49] pb-3">
        <div class="mb-2">
            <div class="overflow-hidden size-[50px]! inline-flex items-center justify-center">
                <img class="object-cover rounded-xl" :src="$url('/assets/logos/DGI-WORKSPACE-logo-short.png')"
                    alt="Short logo" />
            </div>
            <div class="flex flex-col items-center gap-3 h-full">
                <button
                    v-if="$drawerPages != '!*' && ($drawerPages == '*' || $drawerPages.includes($route.name as string))"
                    v-tooltip.right="'Fermer'" @click="sideStore.toggleShow" class="aside-nav-btn">
                    <ChevronLeftIcon class="size-6 transition-transform" :class="{ 'rotate-180': sideStore.show }"
                        stroke-width="1.5" />
                </button>
                <a :href="$modulesUrls.dashboard" class="aside-nav-btn" v-tooltip.right="'Tableau de bord'"
                    :class="{ 'active': isCurrentDomain($modulesUrls.dashboard ?? '') }">
                    <HomeIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.drive" class="aside-nav-btn" v-tooltip.right="'Drive'"
                    :class="{ 'active': isCurrentDomain($modulesUrls.drive ?? '') }">
                    <HardDriveIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.chat" class="aside-nav-btn"
                    :class="{ 'active': isCurrentDomain($modulesUrls.chat ?? '') }" v-tooltip.right="'Chat'">
                    <MessageSquareIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.meet" class="aside-nav-btn"
                    :class="{ 'active': isCurrentDomain($modulesUrls.meet ?? '') }" v-tooltip.right="'Réunion'">
                    <VideoIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.team" class="aside-nav-btn"
                    :class="{ 'active': isCurrentDomain($modulesUrls.team ?? '') }" v-tooltip.right="'Equipe'">
                    <UsersIcon class="size-6" />
                </a>
                <a :href="$modulesUrls.contact" class="aside-nav-btn"
                    :class="{ 'active': isCurrentDomain($modulesUrls.contact ?? '') }" v-tooltip.right="'Contacts'">
                    <ContactIcon class="size-6" />
                </a>
                <a :href="$modulesUrls.ai" class="aside-nav-btn"
                    :class="{ 'active': isCurrentDomain($modulesUrls.ai ?? '') }" v-tooltip.right="'IA'">
                    <BotIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.mail" class="aside-nav-btn"
                    :class="{ 'active': isCurrentDomain($modulesUrls.mail ?? '') }" v-tooltip.right="'Mail'">
                    <MailIcon class="size-6" stroke-width="1.5" />
                </a>
                <a :href="$modulesUrls.calendar" class="aside-nav-btn"
                    :class="{ 'active': isCurrentDomain($modulesUrls.calendar ?? '') }" v-tooltip.right="'Calendrier'">
                    <CalendarIcon class="size-6" stroke-width="1.5" />
                </a>

            </div>
        </div>
        <AppButton @click="logout" icon secondary :filled="false" v-tooltip.right="'Déconnexion'">
            <LogOutIcon class="size-5" stroke-width="1.5" />
        </AppButton>
    </div>
    <template v-if="$drawerPages != '!*' && ($drawerPages == '*' || $drawerPages.includes($route.name as string))">
        <Transition name="side-bar-left">
            <div v-show="sideStore.show" class="w-[360px] pl-16 pr-2 fixed z-[48] h-screen py-2 bg-gray-100">
                <div class="h-full overflow-y-auto bg-white rounded-lg border border-secondary-100">
                    <component :is="$route.meta.sidebar" />
                </div>
            </div>
        </Transition>
    </template>

    <Transition name="fade">
        <div v-if="sideStore.show" class="w-screen h-screen bg-black/50 fixed lg:hidden z-[47]"></div>
    </Transition>
    <ConfirmationModal :show="confirmationModal.show" :title="confirmationModal.title"
        :description="confirmationModal.message" @cancel="onConfirmationResponse(false)"
        @confirm="onConfirmationResponse(true)" />
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import ConfirmationModal from '../../components/dialogs/ConfirmationModal.vue'

import { useAuthStore } from "../../stores/auth";
import { useSideBar } from '../../stores/sidebar';
import { handleConfirmation, getUrlDomain, getCurrentDomain, isCurrentDomain } from '../../utils/helpers'
import { BotIcon, CalendarIcon, ChevronLeftIcon, ContactIcon, HardDriveIcon, HomeIcon, LogOutIcon, MailIcon, MessageSquareIcon, UsersIcon, VideoIcon } from 'lucide-vue-next'
import { ref } from 'vue';
import { SSOServerLogoutUrl } from '@/env';
const authStore = useAuthStore()
const sideStore = useSideBar()

const showLogoutModal = ref(false)
const onLogoutResponse = (resp: boolean) => {
    showLogoutModal.value = false
    if (resp) {
        authStore.logout()
    }
}


const confirmationModalFiedls = {
    title: 'Demande de confirmation',
    message: 'Etes vous sur de cette action',
    show: false,
    onConfirm: () => { },
    onCancel: () => { },
}
const confirmationModal = ref(confirmationModalFiedls)

const onConfirmationResponse = (rsp: boolean) => {
    confirmationModal.value.show = false;
    if (rsp) {
        confirmationModal.value.onConfirm()
    } else {
        confirmationModal.value.onCancel()
    }
}
const logout = () => {
    handleConfirmation({
        title: 'Déconnexion',
        message: 'Souhaitez vous vous déconnecter ?',
        onConfirm() {
            authStore.logout()
        }, onCancel() {

        },
    })
}
onMounted(() => {
    //@ts-ignore
    document.addEventListener('show-confirmation', (e: CustomEvent) => {
        const details = e.detail;
        confirmationModal.value.message = details.message;
        confirmationModal.value.title = details.title;
        confirmationModal.value.onConfirm = details.onConfirm;
        confirmationModal.value.onCancel = details.onCancel;

        confirmationModal.value.show = true;
    })
})
</script>
