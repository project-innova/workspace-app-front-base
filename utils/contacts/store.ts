import { defineStore } from "pinia";
import { ref } from "vue";
import { HTTP } from "../http";

export const useContactSTore = defineStore('contactStore', () => {
    const contacts = ref({
        items: <any[]>[],
        pagination: null
    });

    const selected = ref()
    const loading = ref(false)

    const load = async () => {
        loading.value = true;
        try {
            const rsp = await HTTP.get($modulesUrls.contact + '/api/services/contacts');
            contacts.value = rsp.data;
        } catch (error) {
            console.error('Load contacts error:', error);
        } finally {
            loading.value = false;
        }
    }

    return {
        contacts,
        selected,
        load,
    }
})

