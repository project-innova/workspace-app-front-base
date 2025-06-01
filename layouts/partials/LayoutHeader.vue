<template>
    <header class="grid grid-cols-3 w-full gap-2 p-2 items-center bg-white rounded-lg border border-secondary-100">
        <div class="flex items-center gap-2 w-35">
            <component :is="$route.meta.title" />
        </div>
        <SpotLight />
        <div class="flex justify-end gap-3 w-full">
            <component :is="$route.meta.actions" />
            <NotificationModal />
            <a v-if="authStore.user" :href="`${$modulesUrls.dashboard}/mon-compte`"
                class="inline-flex items-center justify-center overflow-hidden size-10">
                <img class="object-cover rounded-lg" :src="authStore.user?.profile?.avatar"
                    :alt="authStore.user?.profile?.full_name" />
            </a>
            <!-- <button @click="sideStore.toggleShow" class="app-btn icon large  z-[1000]">
                <MenuIcon class="size-4" />
            </button> -->
        </div>
    </header>
</template>
<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import SpotLight from '../../utils/spotLight/SpotLight.vue';
import NotificationModal from '../../utils/notification/NotificationModal.vue';
import { MenuIcon } from 'lucide-vue-next';
import { useSideBar } from '../../stores/sidebar';
const authStore = useAuthStore()
const sideStore = useSideBar()
</script>
