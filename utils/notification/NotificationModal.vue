<script setup lang="ts">
import {
    BellIcon,
    CheckIcon,
    XIcon,
    TrashIcon,
} from "lucide-vue-next";
import { onMounted } from "vue";
import { ref } from "vue";
import Menu from "../../components/dialogs/Menu.vue";
import { useNotificationStore } from "./notificationStore";

const notificationStore = useNotificationStore();

const notificationsMenuRef = ref<any>();

const toogleMenu = (event: MouseEvent) => {
    if (notificationStore.unreadNotifications.length > 0 || notificationStore.readNotifications.length > 0) {
        notificationsMenuRef.value.toggle(event);
    }
};

const openUrl = (url: string) => {
    window.open(url, '_blank')
}

onMounted(async () => {
    notificationStore.loadNotifications();
    $socket.on('notification', async (notif: any) => {
        // try {
        //     const audio = document.getElementById(
        //         "notification-sound"
        //     ) as HTMLAudioElement;
        //     audio.src = urlHelper.getBaseUrl('/assets/sounds/notif-3.wav');
        //     audio.load();
        //     audio.volume = 1;
        //     audio.play();
        // } catch (error) {
        //     console.warn("Erreur lors de la lecture du son:", error);
        // }
        notificationStore.unreadNotifications.unshift(notif.data);
        $useToast(
            {
                message: notif.data.message,
                title: "Nouvelle notification",
                type: "info",
                duration: 5000,
            }
        );
    }
    );
});
</script>

<template>
    <button class="relative app-icon-btn filled rounded-lg" @click="toogleMenu">
        <BellIcon class="pointer-events-none size-5" stroke-width="1.5" />
        <span v-show="notificationStore.unreadNotifications.length > 0" style="top: -10%; right: -16%"
            class="absolute inline-flex w-5 h-5 text-xs font-bold text-white rounded-full pointer-events-none flex-center bg-primary">
            {{ notificationStore.unreadNotifications.length }}
        </span>
    </button>

    <Menu position="bottomRight" ref="notificationsMenuRef" class="!w-[400px]">
        <div class="">
            <div class="p-3 pb-0">
                <div class="flex items-center gap-2">
                    <span class="text-xl font-bold text-gray-600">Centre de notifications</span>
                </div>
                <button class="app-btn small rounded-lg">
                    <TrashIcon class="text-gray-500 size-4" />
                    <span>Supprimer tout</span>
                </button>
            </div>
            <span class="border-b border-gray-200 w-full h-[1px] inline-block"></span>
            <div class="max-h-[400px] overflow-y-auto">
                <div v-for="notification in notificationStore.unreadNotifications"
                    class="flex w-full gap-4 px-3 py-3 cursor-pointer hover:bg-gray-100 relative">
                    <BellIcon class="size-6 text-primary" />

                    <button class=" absolute right-3 top-3" @click="notificationStore.markAsRead(notification.id)"
                        v-if="!notification.url">
                        <XIcon class="size-4 text-gray-400" />
                    </button>
                    <span class=" w-full">
                        <h2 class="text-base font-bold text-gray-500">{{ notification.title }}</h2>
                        <p class="text-sm text-gray-400">{{ notification.message }}</p>
                        <p class="text-sm text-gray-400">{{ notification.date }}</p>
                        <div class="flex gap-3 mt-2" v-if="notification.url && notification.item_id">
                            <button class="app-btn small success"
                                @click="notificationStore.notifAction(true, notification.url, notification.item_id, notification.id)">
                                <CheckIcon class="size-4" />
                                <span>Repondre</span>
                            </button>
                            <button class="app-btn small danger"
                                @click="notificationStore.notifAction(false, notification.url, notification.item_id, notification.id)">
                                <XIcon class="size-4" />
                                <span>Refuser</span>
                            </button>
                        </div>
                        <div class="flex gap-3 mt-2" v-else-if="notification.url">
                            <button class="app-btn small success" @click="openUrl(notification.url)">
                                <span>Ouvrir</span>
                            </button>
                        </div>

                    </span>
                </div>
                <span v-if="notificationStore.readNotifications.length > 0"
                    class="px-3 mt-5 mb-2 font-semibold text-gray-600">Notifications deja lus</span>
                <div v-for="notification in notificationStore.readNotifications"
                    class="flex w-full gap-4 px-3 py-3 cursor-pointer hover:bg-gray-100">
                    <BellIcon class="size-6 text-primary" />
                    <span class="">
                        <h2 class="text-base font-bold text-gray-500">{{ notification.title }}</h2>
                        <p class="text-sm text-gray-400">{{ notification.message }}</p>
                        <p class="text-sm text-gray-400">{{ notification.date }}</p>
                        <div class="flex gap-3 mt-1" v-if="notification.url && notification.item_id">
                            <span v-if="notification.action_status == true"
                                class="flex items-center gap-2 text-success">
                                <CheckIcon class="size-4 " />
                                <span>Accèpté</span>
                            </span>
                            <span v-else-if="notification.action_status == false"
                                class="flex items-center gap-2 text-danger">
                                <XIcon class="size-4 " />
                                <span>Refusé</span>
                            </span>
                        </div>

                    </span>
                </div>
            </div>
        </div>
    </Menu>
</template>
