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

    const load = async (type:'collaborators'|'contacts'|'all'='all') => {
        loading.value = true;
        try {
            const rsp = await HTTP.get($modulesUrls.contact + '/api/services/contacts',{
                params:{
                    type:type
                }
            });
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


interface Contact {
    id: string;
    user_id?: string;
    pseudo: string;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar: string;
    created_date: string;
    last_update: string;
}
export const useContactInfoStore = defineStore('infoStore', () => {
    const contact = ref<Contact | null>(null);
    const show = ref<boolean>(false);

    const selectContact = (ct: Contact) => {
        console.log('contact',ct);
        contact.value = ct;
        show.value = true;
    }
    const closeSidebar = () => {
        show.value = false;
        contact.value = null;
    }
    return {
        selectContact,
        contact,
        show,
        closeSidebar
    }
});
