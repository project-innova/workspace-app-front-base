<template>
    <AppButton class="icon primary large" :class="$attrs.class" @click="showModal">
        <Contact2Icon />
    </AppButton>
    <HeadlessModal position="top" :show="show" size="sm" contentClass="p-0">
        <template #head>
            <div class="relative w-full flex justify-center items-center">
                <h2 class="text-lg font-bold">
                    Sélèctionnez des Contacts
                </h2>

                <XIcon class="size-6 text-gray-400 hover:text-primary cursor-pointer absolute top-0 right-0"
                    @click="closeModal" />
            </div>
        </template>
        <div class="">
            <div class="mb-3">
                <DropdownSelect
                    :options="contactStore.contacts.items.map((ct) => ({ label: ct.name, value: ct.email }))"
                    v-model="contactStore.selected" multiple :maxShow="1" />
            </div>
            <table class="w-full">
                <tbody>
                    <tr v-for="(contact, i) in contacts.items.filter(ct => contactStore.selected.includes(ct.email))">
                        <td>{{ contact.name }}</td>
                        <td>{{ contact.email }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="flex w-full">
                <AppButton @click="validate" class="w-full mt-10">Valider</AppButton>
            </div>
        </div>
    </HeadlessModal>

</template>
<script setup lang="ts">
import DropdownSelect from '../../components/forms/DropdownSelect.vue';
import { onMounted, ref } from 'vue';
import { useContactSTore } from './store';
import { Contact2Icon, XIcon } from 'lucide-vue-next';
import HeadlessModal from '../../components/dialogs/HeadlessModal.vue';
const contactStore = useContactSTore();
const emit = defineEmits(['selected'])

const contacts = ref({
    items: <any[]>[],
    pagination: null
});


const show = ref(false);
const showModal = () => {
    show.value = true;
};
const closeModal = () => {
    show.value = false;
    contactStore.selected = [];
};

const validate = () => {
    emit('selected', contactStore.selected);
    closeModal();
};


onMounted(() => {
    contactStore.load();
})
</script>
