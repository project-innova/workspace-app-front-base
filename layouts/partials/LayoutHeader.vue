<template>
    <header class="grid grid-cols-3 w-full gap-2 p-2 bg-white rounded-lg">
        <div class="flex items-center gap-2">
            <component :is="$route.meta.title" />
        </div>
        <SpotLight />
        <div class="flex justify-end gap-3">
            <component :is="$route.meta.actions" />
            <NotificationModal />
            <span class="">
                <a v-if="authStore.user" href=""
                    class="inline-flex items-center justify-center overflow-hidden size-10">
                    <img class="object-cover rounded-xl" :src="authStore.user?.profile?.avatar"
                        :alt="authStore.user?.profile?.full_name" />
                </a>
            </span>
            <button @click="sideStore.toggleShow" class="app-btn icon large  z-[1000]">
                <MenuIcon class="size-4" />
            </button>
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
