<template>
    <HeadlessModal :show="_show" size="lg">
        <template #head>
            <div class="grid grid-cols-5 gap-3">
                <div class="flex justify-start items-center">
                    <h2>Choissiez des fichiers</h2>
                </div>
                <div class="flex justify-center col-span-3">
                    <TextField type="text" placeholder="Recherche ..." class="w-full">
                        <template #prefix>
                            <SearchIcon />
                        </template>
                    </TextField>
                </div>
                <div class="flex justify-end items-center">
                    <button class=" hover:text-primary">
                        <XIcon @click="close" />
                    </button>
                </div>
            </div>
        </template>
        <div class="h-[500px]">
            <ResizableTable id="media-table" :columns="columns" :data-collection="medias.items"
                :loading="medias.loading" @selected="onSelected" @open="onOpen"
                tr-class="border-y-1 border-dashed border-transparent"
                :item-class-condition="(item: any, index: number) => selectedFiles.includes(item.id) ? 'bg-primary/10! text-primary!' : ''">
                <template #cell-icon="{ item }">
                    <span class="w-10 h-10 flex-center rounded-full" :class="{}">
                        <span v-if="item.type != 'FILE'" class="text-2xl text-gray-500">
                            <img :src="getIcon('folder')" alt="">
                        </span>
                        <span v-else class=" text-gray-500 flex-center inline-flex"
                            :class="{ 'h-10': !item.meta.thumbnail }">
                            <img class="object-cover h-full"
                                :src="item.meta.thumbnail ? item.meta.thumbnail : getIcon(item.meta.extension)" alt="">
                        </span>
                    </span>
                </template>
                <template #cell-type="{ item }">
                    <span class="text-gray-500 line-clamp-1 capitalize">
                        {{ item.type != 'FILE' ? 'Dossier' : item.meta.type + ' ' + item.meta.extension }}
                    </span>
                </template>
                <template #cell-size="{ item }">
                    <span class="text-gray-500 line-clamp-1">
                        {{ item.type == 'FILE' ? formatFileSize(item.meta.size) : getFolderSizeInfo(item) }}
                    </span>
                </template>
                <template #cell-owner="{ item }">
                    <div v-if="item.owner" class="flex-center gap-2 w-fit">
                        <div class="flex-center inline-flex size-7 aspect-square">
                            <img class="h-full object-cover rounded-full" :src="item.owner.avatar" alt="">
                        </div>
                        <span class="text-gray-500 line-clamp-1 !text-xs">
                            {{ item.owner.name }}
                        </span>
                    </div>
                </template>
                <template #cell-updated_date="{ item }">
                    <span class="text-gray-500 line-clamp-1">
                        {{ item.updated_date }}
                    </span>
                </template>
                <template #cell-created_date="{ item }">
                    <span class="text-gray-500 line-clamp-1">
                        {{ item.created_date }}
                    </span>
                </template>
                <template #cell-name="{ item }">
                    <span class="text-gray-500 line-clamp-1 w-full">
                        {{ item.name }}
                    </span>
                </template>
                <template #cell-actions="{ item }">
                    <!-- <AppMenu :menus="getMenu(item)" position="right" :wd="250">
                <span class="w-10 h-8 flex-center">
                    <MoreHorizontalIcon class="size-4" />
                </span>
            </AppMenu> -->
                </template>
            </ResizableTable>
        </div>
        <template #foot>
            <div class="flex justify-between border-t pt-2 items-center">
                <div class="flex gap-2">
                    <button class=" hover:text-primary">
                        <XIcon @click="wipeSelectedFiles" />
                    </button>
                    <span>{{ selectedFiles.length }}
                        {{ selectedFiles.length > 1 ? ' éléments sélectionnés' : ' élément sélectionné' }}
                    </span>
                </div>
                <div class="flex justify-end gap-2">
                    <AppButton size="md" class="filled" label="Ajouter en que fichier" />
                    <AppButton size="md" class="filled" label="Ajouter en que lien" />
                </div>
            </div>
        </template>
    </HeadlessModal>
</template>
<script setup lang="ts">
import HeadlessModal from '@/appBase/components/dialogs/HeadlessModal.vue';
import { SearchIcon, XIcon } from 'lucide-vue-next';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { HTTP } from '../http';
import { DriveModuleUrl } from '@/env';
import { computed } from 'vue';
import type { TableColumn } from '@/appBase/types';
import { getIcon } from "./Icons/file_icons";
import { formatFileSize, getFolderSizeInfo } from './helpers';

const _show = ref(false);
const show = () => {
    _show.value = true;
}
const close = () => {
    _show.value = false;
    wipeSelectedFiles()
}
const selectedFiles = ref<{ id: string, name: string, type: string, meta: Record<string, any> }[]>([]);
const wipeSelectedFiles = () => {
    selectedFiles.value = [];
}

var _onValidate: (files: any[]) => void = () => { };
const _acceptedFiles = ref([])
const _multiple = ref(false);
const validate = (onValidate: (files: any[]) => void) => {
    onValidate(selectedFiles.value);
    close();
}
const medias = ref({
    items: [],
    loading: false,
    pagination: {
        page: 1,
        per_page: 10,
        total: 0,
    },
})

const onSelected = (files: any[]) => {

}
const loadFiles = async (files: any[]) => {
    if (medias.value.loading) {
        return;
    }
    medias.value.loading = true;
    try {
        const rsp = await HTTP.get(DriveModuleUrl + '/api/media-picker', {
            params: {
                current_folder: 'ROOT',
                page: medias.value.pagination.page,
                per_page: medias.value.pagination.per_page,
            }
        })
        medias.value.items = rsp.data.medias;
    } catch (error) {
        $useToast({
            message: 'Erreur lors du chargement des fichiers',
            type: 'error',
            title: 'Erreur',
        })
    } finally {
        medias.value.loading = false;
    }
}
const columns = computed<TableColumn[]>(() => [
    {
        label: 'Icon',
        key: 'icon',
        width: 50,

    },
    {
        label: 'Nom',
        key: 'name',
        width: 400,
    },
    {
        label: 'Propriétaire',
        key: 'owner',
    },
    {
        label: 'Type',
        key: 'type',
        width: 80,

    }, {
        label: 'Taille',
        key: 'size',
        colspan: 2,
        width: 80,
    },
    {
        label: 'Dernière modification',
        key: 'updated_date',
        width: 120,

    },
    {
        label: 'Date de création',
        key: 'created_date',
        width: 120,
    },
    {
        label: 'Actions',
        key: 'actions',
        align: 'right',
        width: 70,

    },
]);
const onOpen = (item: any) => {
    if (item.type == 'FILE') {
        return;
    }
    // @ts-ignore
}
defineExpose({
    show,
    close,
    validate,
})

onMounted(() => {
    // @ts-ignore
    document.addEventListener('showFilePicker', (e: CustomEvent) => {
        console.log('showFilePicker', e.detail);
        _onValidate = e.detail.onValidate;
        _acceptedFiles.value = e.detail.accept;
        _multiple.value = e.detail.multiple;
        show();
    })
})
</script>
