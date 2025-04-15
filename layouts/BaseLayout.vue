<template>
    <div class="flex w-screen h-screen gap-2 ">
        <BaseSideBase />
        <main
            class=" h-full gap-2 overflow-y-auto rounded-lg w-[calc(100vw-4.5rem)] ml-[4.2rem] pt-2 transition-[width,margin-left]"
            :class="{ 'lg:w-[calc(100vw-360px)] lg:ml-[370px]': sideStore.show }">
            <LayoutHeader :auth-user="authStore.user!" />
            <div class="mt-3 h-[calc(100vh-90px)] overflow-y-auto">
                <component :is="$route.meta.header" :auth-user="authStore.user!" />
                <router-view>
                    <template #default="{ Component, route }">
                        <keep-alive>
                            <component :is="Component" :key="route"></component>
                        </keep-alive>
                    </template>
                </router-view>
            </div>
        </main>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import LayoutHeader from './partials/LayoutHeader.vue';
import BaseSideBase from './partials/BaseSideBase.vue';
import { useSideBar } from '../stores/sidebar';
const authStore = useAuthStore()
const sideStore = useSideBar()

onMounted(() => {
    $socket.on('notify', (notification: any) => {
        $useToast({
            type: notification.type,
            title: notification.title,
            message: notification.message,
            duration: 4000,
        })
        console.log('New notification', notification)
    })
    authStore.loadUser()
})
</script>
