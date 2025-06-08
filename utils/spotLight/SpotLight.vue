<template>
  <div class="w-full">
    <button class="w-full btn-search" @click="spotLightStore.show = true">
      <div class="flex items-center gap-3">
        <SearchIcon v-show="!spotLightStore.searchIng" class="size-6 group-hover:text-orange-500" />
        <RefreshCcwIcon v-show="spotLightStore.searchIng" class="size-6 group-hover:text-orange-500 spin" />
        <span>Rechercher ... </span>
      </div>
      <span
        class="px-1 py-0.5 text-xs font-bold tracking-normal text-gray-400 rounded border dark:border-slate-200 dark:border-opacity-5 dark:text-gray-600 transition">
        ⌘+K
      </span>
    </button>
  </div>
  <HeadlessModal :show="spotLightStore.show" size="md" position="top" contentClass="!p-0" containerClass="!w-[500px]">
    <div class="sticky top-0 bg-white ">
      <div class="flex items-center justify-between w-full bg-secondary-100 rounded-lg p-2 h-12">
        <div class="flex items-center gap-2 w-full">
          <span class="">
            <SearchIcon v-show="!spotLightStore.searchIng" class="text-gray-400 size-6" />
            <RefreshCcwIcon v-show="spotLightStore.searchIng" class="text-gray-400 size-6 spin" />
          </span>
          <input type="serach" ref="searchFieldRef" id="global-search-field" placeholder="Rechercher ..."
            class="flex border-none! p-0! outline-none! w-full h-full" v-model="spotLightStore.searchQuery">
        </div>
        <span class="">
          <XIcon class="text-gray-400 cursor-pointer size-6 hover:text-primary" @click="spotLightStore.show = false" />
        </span>
      </div>
    </div>
    <div class="w-full max-h-[60vh] overflow-y-auto " :class="{ 'mt-5': spotLightStore.availableGroups.length > 0 }">
      <template v-for="(result, index) in spotLightStore.results">
        <div class="w-full ">
          <Divider align="left" class="my-0! ">
            <div class="flex gap-1" v-if="types[index]">
              <span>
                <component :is="types[index].icon" class="size-5" />
              </span>
              <span class="">{{ types[index].name }}</span>
            </div>
            <div class="flex gap-1" v-else>
              <span>
                <InfoIcon class="size-5" />
              </span>
              <span class="capitalize">{{ types[index] }}</span>
            </div>

          </Divider>
          <ul class="w-full">
            <li v-for="item in result">
              <button :data-spotlight-index="item.index"
                class="flex items-start spot-ligth-item flex-col w-full p-2 rounded-lg cursor-pointer hover:bg-primary/10"
                @click="handleSeletedItem(item)">
                <span class="text-sm text-gray-500" v-html="item.label"></span>

                <span v-if="index == 'file'" class="text-sm text-gray-400">
                  Créé {{ dateHummanFormat(item.metadata.created_at) }}, Type : {{
                    item.metadata.infos.type
                  }}, Taille :
                  {{ formatFileSize(item.metadata.infos.size) }}
                </span>
                <span v-else-if="index == 'folder'" class="text-sm text-gray-400">
                  Créé {{ dateHummanFormat(item.metadata.created_at) }}, {{
                    item.metadata.infos.files }} Fichier{{ item.metadata.infos.files > 1 ? 's' : '' }},
                  {{
                    item.metadata.infos.sub_folders }} Sous-dossier{{ item.metadata.infos.sub_folders >
                    1 ?
                    's' : ''
                  }}
                </span>
                <span v-else-if="item.description" class="text-sm text-gray-400" v-html="item.description"></span>
              </button>
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
import { ArrowDown, ArrowDownLeft, ArrowUp, Calendar1Icon, CornerDownLeft, FileIcon, FilesIcon, FolderIcon, FoldersIcon, icons, InfoIcon, RefreshCcwIcon, SearchIcon, UserIcon, Users2Icon, VideoIcon, XIcon } from "lucide-vue-next";
import Divider from "primevue/divider";
import { formatFileSize } from "../helpers";
import { format, parse, isToday, isYesterday, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { isCurrentDomain } from '../../utils/helpers'
import { useRouter } from "vue-router";

const router = useRouter();
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
    } else if (spotLightStore.show && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      // Supposons que vous avez une variable selectedIndex dans votre store ou composant
      // et une liste d'éléments filtrés : spotLightStore.results
      // À adapter selon votre logique réelle
      const groups = spotLightStore.availableGroups;
      let totalItems = 0;
      // On aplatit les résultats pour la navigation
      totalItems = spotLightStore.resultsItems.length;
      if (totalItems === 0) return;
      let newSelected = 0;
      if (e.key === 'ArrowDown') {
        if (spotLightStore.selectedIndex == null) {
          newSelected = 0;
        } else if (spotLightStore.selectedIndex < totalItems - 1) {
          // On ne dépasse pas le dernier élément
          newSelected = spotLightStore.selectedIndex + 1;
          document.querySelector(`[data-spotlight-index="${spotLightStore.selectedIndex}"]`)?.classList.remove('bg-primary/20');
        } else {
          // On est déjà sur le dernier, on ne fait rien
          return;
        }
      } else if (e.key === 'ArrowUp') {
        if (spotLightStore.selectedIndex == null) {
          newSelected = 0;
        } else if (spotLightStore.selectedIndex > 0) {
          newSelected = spotLightStore.selectedIndex - 1;
          document.querySelector(`[data-spotlight-index="${spotLightStore.selectedIndex}"]`)?.classList.remove('bg-primary/20');
        } else {
          // On est déjà sur le premier, on ne fait rien
          return;
        }
      }
      // Debug : affiche l'index sélectionné
      // console.log('newSelected', newSelected);
      console.log('spotLightStore.selectedIndex', e.key, newSelected, spotLightStore.selectedIndex);
      spotLightStore.selectedIndex = newSelected;

      // Optionnel : faire défiler jusqu'à l'élément sélectionné
      // if (spotLightStore.selectedIndex > 0) {
      //     document.querySelector(`[data-spotlight-index="${spotLightStore.selectedIndex - 1}"]`)?.classList.remove('bg-primary/12');
      // }


      setTimeout(() => {
        const el = document.querySelector(`[data-spotlight-index="${spotLightStore.selectedIndex}"]`);
        el?.classList.add('bg-primary/20');
        el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 10);
    }
    else if (spotLightStore.show && e.key === 'Enter' && spotLightStore.selectedIndex != null) {
      const selectedItem = spotLightStore.resultsItems[spotLightStore.selectedIndex];
      handleSeletedItem(selectedItem)
    } else if (spotLightStore.show) {
      console.log('Selected key', e.key);
    }

  })

})

const handleSeletedItem = (selectedItem: any) => {
  if (isCurrentDomain(selectedItem.url)) {
    const path = new URL(selectedItem.url).pathname;
    spotLightStore.show = false;
    router.push(path);
  } else {
    window.location.href = selectedItem.url;
  }
}

const folderInfo = (item: any) => {
  console.log('item', item.metadata);
}

const types: any = {
  meet: {
    name: 'Reunions',
    icon: VideoIcon,
  },
  contact: {
    name: 'Contacts et collaborateurs',
    icon: UserIcon,
  },
  drive: 'Fichiers et dossier',
  team: {
    name: 'Équipes',
    icon: Users2Icon
  },
  event: {
    name: 'Évenements',
    icon: Calendar1Icon,
  },
  folder: {
    name: 'Dossiers',
    icons: FoldersIcon,
  },
  file: {
    name: 'Fichiers',
    icon: FilesIcon,
  },
}

const dateHummanFormat = (dateString: string) => {

  if (!dateString) return '';

  const _date = new Date();
  let date;
  try {
    date = parse(dateString, 'yyyy-MM-dd HH:mm:ss', _date);
    if (isNaN(date.getTime())) throw new Error('Date invalide');
  } catch (e) {
    // Si le parse échoue, on tente de parser en ISO ou timestamp
    date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
  }

  if (isToday(date)) {
    return `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
  }

  if (isYesterday(date)) {
    return `Hier à ${format(date, 'HH:mm', { locale: fr })}`;
  }

  return `${format(date, 'EEEE', { locale: fr })} à ${format(date, 'HH:mm', { locale: fr })}`;
};
</script>
