<template>
    <AppButton class="icon primary large filled" :class="$attrs.class" @click="showModal">
        <Contact2Icon />
    </AppButton>
    <HeadlessModal position="top" :show="show" size="sm" contentClass="p-0">
        <template #head>
            <div class="relative w-full flex justify-center items-center">
                <h2 class="text-lg font-bold">
                    Sélectionner des Contacts
                </h2>
                <XIcon class="size-6 text-gray-400 hover:text-primary cursor-pointer absolute top-0 right-0"
                    @click="closeModal" />
            </div>
        </template>
        <div class="">
            <div class="mb-3">
                <DropdownSelect label="Type de contacts"
                    :options="[{ label: 'Collaborateurs', value: 'collaborators' }, { label: 'Contacts', value: 'contacts' }]"
                    v-model="currentType" @update:model-value="() => contactStore.load(currentType)" />
            </div>
            <div class="mb-3">
                <DropdownSelect label="Sélectionner des contacts"
                    :options="contactStore.contacts.items.map((ct) => ({ label: ct.full_name, value: ct.email }))"
                    v-model="contactStore.selected" multiple :maxShow="1" filter />
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
                <AppButton @click="validate" class="w-full mt-10 filled">Valider</AppButton>
            </div>
        </div>
    </HeadlessModal>

</template>
<script setup lang="ts">
import DropdownSelect from '../../components/forms/DropdownSelect.vue';
import { onMounted, ref, watch } from 'vue';
import { useContactSTore } from './store';
import { Contact2Icon, XIcon } from 'lucide-vue-next';
import HeadlessModal from '../../components/dialogs/HeadlessModal.vue';
const props = defineProps<{
    type?: 'all' | 'collaborators' | 'contacts'
}>()
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
const currentType = ref(props.type);
const validate = () => {
    console.log('contactStore.selected', contactStore.selected);
    emit('selected', contactStore.selected);
    closeModal();
};

onMounted(() => {
    contactStore.load(props.type);
})
</script>
