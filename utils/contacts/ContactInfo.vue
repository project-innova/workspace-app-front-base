<template>
    <div v-if="contactInfoStore.show" class="w-[300px] h-[calc(100vh-90px)] bg-white border rounded-lg p-3">
        <div class="flex flex-col items-center gap-3 relative">
            <button class=" absolute right-0 top-0" @click="contactInfoStore.closeSidebar()">
                <XIcon class="size-4" />
            </button>
            <span class="size-20 flex rounded-full overflow-hidden">
                <img :src="contactInfoStore.contact?.avatar" alt="" class=" object-cover">
            </span>
            <div class="">
                <h3 class="font-semibold line-clamp-1 text-center">{{ contactInfoStore.contact?.full_name }}</h3>
                <h5 class="font-semibold line-clamp-1 text-center text-sm">{{ contactInfoStore.contact?.email }}</h5>
                <h5 class="font-semibold line-clamp-1 text-center text-sm">{{ contactInfoStore.contact?.phone }}</h5>
            </div>
            <div class="flex gap-3 justify-center">
                <button class="hover:text-primary bg-primary/10 rounded-full size-8 flex-center"
                    v-tooltip.bottom="'Envoyez un email'">
                    <MailIcon class="size-4" />
                </button>
                <button @click="showFilePicker()" class="hover:text-primary bg-primary/10 rounded-full size-8 flex-center"
                    v-tooltip.bottom="'Envoyez des document'">
                    <Share2Icon class="size-4" />
                </button>
                <button v-if="contactInfoStore.contact?.user_id" class="hover:text-primary bg-primary/10 rounded-full size-8 flex-center"
                    v-tooltip.bottom="'Discuter'">
                    <MessageSquareIcon class="size-4" />
                </button>
                <button v-if="contactInfoStore.contact?.user_id" class="hover:text-primary bg-primary/10 rounded-full size-8 flex-center"
                    v-tooltip.bottom="'Ajouter à une équipe'">
                    <UsersIcon class="size-4" />
                </button>
                <button class="hover:text-primary bg-primary/10 rounded-full size-8 flex-center"
                    v-tooltip.bottom="'Démarrer une reunion'">
                    <VideoIcon class="size-4" />
                </button>
                <button class="hover:text-primary bg-primary/10 rounded-full size-8 flex-center"
                    v-tooltip.bottom="'Planifié un événement'">
                    <CalendarIcon class="size-4" />
                </button>
            </div>
        </div>
        <div class="h-[calc(100%-220px)] overflow-y-auto mt-5 hiddle-scroll">
            <div class="rounded-lg bg-gray-100 border p-2">
                <div class="flex justify-between">
                    <div class="flex gap-2">
                        <File class="size-5" />
                        <h3>Fichiers partagés</h3>
                    </div>
                    <span class="text-sm">{{ 137 }}</span>

                </div>
                <div class="mt-3">
                    <ul>
                        <li v-for="(file, index) in 3" class="flex gap-2 mb-3">
                            <span class="size-10 flex">
                                <img src="https://drive.dgiws.test/assets/ic/ZIP.svg" alt="" class=" bg-cover">
                            </span>
                            <div class="">
                                <h3 class="text-sm">Fichier {{ file }}</h3>
                                <h5 class="text-xs">Lundi 2 avril 2025 à 10:20</h5>
                            </div>
                        </li>
                    </ul>
                    <button class="mt-4 text-center w-full text-sm hover:text-primary">Voir plus</button>

                </div>
            </div>
            <div class="rounded-lg bg-gray-100 border p-2 mt-3">
                <div class="flex justify-between">
                    <div class="flex gap-2">
                        <CalendarIcon class="size-5" />
                        <h3>Événements</h3>
                    </div>
                    <span class="text-sm">{{ 137 }}</span>
                </div>
                <div class="mt-3">
                    <ul>
                        <li v-for="(file, index) in 3" class="flex gap-2 mb-3">
                            <div class="">
                                <h3 class="text-sm">Reunion {{ index }}</h3>
                                <h5 class="text-xs">Lundi 2 avril 2025 à 10:20</h5>
                            </div>
                        </li>
                    </ul>
                    <button class="mt-4 text-center w-full text-sm hover:text-primary">Voir plus</button>
                </div>
            </div>
            <div v-if="contactInfoStore.contact?.user_id" class="rounded-lg bg-gray-100 border p-2 mt-3">
                <div class="flex justify-between">
                    <div class="flex gap-2">
                        <UsersIcon class="size-5" />
                        <h3>Équipes en commun</h3>
                    </div>
                    <span class="text-sm">{{ 137 }}</span>
                </div>
                <div class="mt-3">
                    <ul>
                        <li v-for="(file, index) in 3" class="flex gap-2 mb-3">
                            <div class="">
                                <h3 class="text-sm">Équipe {{ index }}</h3>
                            </div>
                        </li>
                    </ul>
                    <button class="mt-4 text-center w-full text-sm hover:text-primary">Voir plus</button>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
import { CalendarIcon, CameraIcon, File, HardDriveIcon, MailIcon, MailsIcon, MessageCircleIcon, MessageSquareIcon, PlusIcon, Share2Icon, ShareIcon, UserPlus2Icon, UsersIcon, VideoIcon, XIcon } from 'lucide-vue-next';
import { useContactInfoStore } from './store';

const contactInfoStore = useContactInfoStore();

const showFilePicker = ()=>{
    console.log('showFilePicker fs');
    const ev = new CustomEvent('showFilePicker', {
        detail: {
            multiple: true,
            accept: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
            onValidate: (files: File[]) => {
                console.log('Selected files',files);
                //TODO: validate files
                return true;
            }
        },
    });
    document.dispatchEvent(ev);
}
</script>
