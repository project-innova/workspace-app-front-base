import { defineStore } from "pinia";
import { ref } from "vue";
import { HTTP } from "../http";

interface Notification {
    id: string,
    title: string,
    message: string,
    date: string,
    action_status: boolean | null,
    url: string | null,
    link: string | null,
    item_id: string | null,
    type: string,
    event?: string,
}

export const useNotificationStore = defineStore('notificationStore', () => {

    const unreadNotifications = ref<Notification[]>([])
    const readNotifications = ref<Notification[]>([])

    const loading = ref(false)

    const moveNotifToRead = (id: string, action_status: any = null) => {
        const notif = unreadNotifications.value.findIndex((it: Notification) => it.id == id);
        unreadNotifications.value[notif].action_status = action_status;
        readNotifications.value.unshift(JSON.parse(JSON.stringify(unreadNotifications.value[notif])));
        unreadNotifications.value.splice(notif, 1);
    }

    const loadNotifications = async () => {
        if (loading.value) {
            return;
        }
        loading.value = true;
        try {
            const rst = await HTTP.get(window.$modulesUrls.main + '/api/notifications');
            unreadNotifications.value = rst.data.unread;
            readNotifications.value = rst.data.read;
        } catch (error) {

        }
        loading.value = false;
    }

    const notifAction = async (rsp: boolean, notification: Notification) => {
        try {
            await HTTP.post(notification.url!, { id: notification.item_id, response: rsp });
            await markAsRead(notification.id, rsp);
            if (notification.event) {
                const event = new CustomEvent(notification.event, { detail: { notification } });
                window.dispatchEvent(event);
            }
        } catch (error) {
            console.log("reject notif", error);
        }
    };
    const markAsRead = async (id: string, action_status: boolean | null = null) => {
        try {
            await HTTP.post(window.$modulesUrls.main + '/api/notifications/' + id + '/read', { action_status }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + window.$userToken
                },
            });
            moveNotifToRead(id, action_status);
        } catch (error) {
            console.log("reject notif", error);
        }
    };

    return {
        unreadNotifications,
        readNotifications,
        loading,
        loadNotifications,
        moveNotifToRead,
        notifAction,
        markAsRead,
    }

})
