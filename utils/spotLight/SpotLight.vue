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
    <HeadlessModal :show="spotLightStore.show" size="md" position="middle" contentClass="!p-0"
        containerClass="!w-[500px]">
        <div class="sticky top-0 p-4 bg-white shadow-sm">
            <TextField type="text" placeholder="Rechercher ..." class="stoc"
                @update:model-value="spotLightStore.search($event.target.value)">
                <template #prefix>
                    <SearchIcon class="text-gray-400 size-6" />
                </template>
                <template #surfix>
                    <XIcon class="text-gray-400 cursor-pointer size-6 hover:text-primary"
                        @click="spotLightStore.show = false" />
                </template>
            </TextField>
        </div>
        <div class="w-full p-4 max-h-[60vh] overflow-y-auto">
            <template v-for="(result, index) in spotLightStore.results">
                <div v-if="result.type === 'file'" class="w-full">
                    <span class="mb-2 text-base font-bold text-gray-400">Fichiers</span>
                    <ul class="w-full">
                        <li v-for="item in result.results"
                            class="flex items-center w-full gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100">
                            <FileIcon class="text-gray-400 size-6" />
                            <span class="text-sm font-bold text-gray-500">{{
                                item.name
                                }}</span>
                            <span class="text-sm text-gray-400">{{
                                item.date
                                }}</span>
                        </li>
                    </ul>
                </div>
                <div v-else-if="result.type === 'folder'" class="w-full">
                    <span class="mb-2 text-base font-bold text-gray-400">Dossiers</span>
                    <ul class="w-full">
                        <li v-for="item in result.results"
                            class="flex items-center w-full gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100">
                            <FolderIcon class="text-gray-400 size-6" />
                            <span class="text-sm font-bold text-gray-500">{{
                                item.name
                                }}</span>
                            <span class="text-sm text-gray-400">{{
                                item.date
                                }}</span>
                        </li>
                    </ul>
                </div>
                <div v-else-if="result.type === 'user'" class="w-full">
                    <span class="mb-2 text-base font-bold text-gray-400">Utilisateurs</span>
                    <ul class="w-full">
                        <li v-for="item in result.results"
                            class="flex items-center w-full gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100">
                            <UserIcon class="text-gray-400 size-6" />
                            <span class="text-sm font-bold text-gray-500">{{
                                item.name
                                }}</span>
                            <span class="text-sm text-gray-400">{{
                                item.matricule
                                }}</span>
                        </li>
                    </ul>
                </div>
                <span v-if="index < spotLightStore.results.length - 1"
                    class="flex w-full my-2 border-b border-gray-200"></span>
            </template>
        </div>
    </HeadlessModal>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import HeadlessModal from "../../components/dialogs/HeadlessModal.vue";
import { useSpotLightStore } from "./store";
import { FileIcon, FolderIcon, SearchIcon, UserIcon, XIcon } from "lucide-vue-next";
const spotLightStore = useSpotLightStore();

onMounted(() => {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault(); // Empêche le comportement par défaut
            spotLightStore.show = true;
        }
    })

})
</script>
