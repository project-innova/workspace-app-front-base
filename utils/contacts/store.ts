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
            const rsp = await HTTP.get($modulesUrls.contact + '/api/services');
            console.log('load contacts', rsp.data);
            contacts.value = rsp.data.data;
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

