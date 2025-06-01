<template>
    <div class="w-full">
        <button class="w-full btn-search" @click="spotLightStore.show = true">
            <div class="flex items-center gap-3">
                <SearchIcon class="size-6 group-hover:text-orange-500" />
                <span>Rechercher ... </span>
            </div>
            <span
                class="px-1 py-0.5 text-xs font-bold tracking-normal text-gray-400 rounded border dark:border-slate-200 dark:border-opacity-5 dark:text-gray-600">
                ⌘+K
            </span>
        </button>
    </div>
    <HeadlessModal :show="spotLightStore.show" size="md" position="top" contentClass="!p-0" containerClass="!w-[500px]">
        <div class="sticky top-0 bg-white ">
            <TextField ref="searchFieldRef" id="global-search-field" type="text" placeholder="Rechercher ..."
                class="stoc" v-model="spotLightStore.searchQuery">
                <template #prefix>
                    <SearchIcon class="text-gray-400 size-6" />
                </template>
                <template #surfix>
                    <XIcon class="text-gray-400 cursor-pointer size-6 hover:text-primary"
                        @click="spotLightStore.show = false" />
                </template>
            </TextField>
        </div>
        <div class="w-full max-h-[60vh] overflow-y-auto "
            :class="{ 'mt-5': spotLightStore.availableGroups.length > 0 }">
            <template v-for="(result, index) in spotLightStore.results">
                <div class="w-full ">
                    <Divider align="left" class="my-0!"><span class="">{{ types[index] ?? index }}</span>
                    </Divider>
                    <ul class="w-full">
                        <li v-for="item in result">
                            <a class="flex  flex-col w-full  p-2 rounded-lg cursor-pointer hover:bg-primary/10"
                                :href="item.url">
                                <span class="text-sm text-gray-500" v-html="item.label"></span>
                                <span v-if="item.description" class="text-sm text-gray-400"
                                    v-html="item.description"></span>
                                <span v-else-if="index == 'file'" class="text-sm text-gray-400">
                                    Date {{ item.metadata.created_since }}, Type {{ item.metadata.infos.type }}, Taille
                                    {{ formatFileSize(item.metadata.infos.size) }}
                                </span>
                                <span v-else-if="index == 'file'" class="text-sm text-gray-400">
                                    Date {{ item.metadata.created_since }}, Sous-dossiers {{
                                        item.metadata.infos.children_count }}
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>

            </template>
        </div>
        <div class="flex justify-between mt-3">
            <div class="flex gap-3 text-xs">
                <span class="flex-center gap-2">
                    <span class="flex-center gap-1 bg-secondary-100 rounded p-1 h  -5">
                        <CornerDownLeft class="size-3" />
                        Entrer
                    </span>
                    <span> Sélectionner</span>
                </span>
                <span class="flex-center gap-2">
                    <span class="flex-center bg-secondary-100 rounded p-1 size-5">
                        <ArrowDown class="size-3" />
                    </span>
                    <span class="flex-center bg-secondary-100 rounded p-1 size-5">
                        <ArrowUp class="size-3" />
                    </span>
                    <span>Naviguer</span>
                </span>
            </div>
            <div class="text-xs">
                <span class="flex-center gap-2">
                    <span class="flex-center gap-1 bg-secondary-100 rounded p-1 h  -5">
                        Esc
                    </span>
                    <span>Fermer</span>
                </span>
            </div>
        </div>
    </HeadlessModal>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import HeadlessModal from "../../components/dialogs/HeadlessModal.vue";
import { useSpotLightStore } from "./store";
import { ArrowDown, ArrowDownLeft, ArrowUp, CornerDownLeft, FileIcon, FolderIcon, SearchIcon, UserIcon, XIcon } from "lucide-vue-next";
import Divider from "primevue/divider";
import { formatFileSize } from "../helpers";
const spotLightStore = useSpotLightStore();
const searchFieldRef = ref()
onMounted(() => {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault(); // Empêche le comportement par défaut
            if (!spotLightStore.show) {
                spotLightStore.show = true;
                setTimeout(() => {
                    const inp = document.getElementById('global-search-field');
                    inp?.focus();
                }, 500)
            }
        }
        else if (e.key == 'Escape') {
            if (spotLightStore.show) {
                spotLightStore.show = false;
            }
        }
    })

})

const types: any = {
    meet: 'Reunions',
    contact: 'Contacts et collaborateurs',
    drive: 'Fichiers et dossier',
    team: 'Équipes',
    event: 'Évenements',
    folder: 'Dossiers',
    file: 'Fichiers',
}
</script>
