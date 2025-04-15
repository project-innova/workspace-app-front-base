<template>
    <HeadlessModal :show="show" size="wrap" position="middle" contentClass="p-0">
        <div class="flex flex-col items-center justify-center h-full w-[400px] relative">
            <XIcon class="size-6 text-gray-400 hover:text-primary cursor-pointer absolute top-0 right-0"
                @click="$emit('cancel')" />
            <h3 class="text-lg font-medium text-color">{{ title }}</h3>
            <p class="text-sm text-color-secondary my-5">{{ description }}</p>
            <div class="grid grid-cols-2 gap-2 mt-4 w-full">
                <button class="app-btn py-2 px-4 w-full flex " @click="$emit('cancel')">{{ cancelText }}</button>
                <button class="app-btn py-2 px-4 w-full flex !bg-danger text-white" @click="$emit('confirm')">{{
                    confirmText }}</button>
            </div>
        </div>
    </HeadlessModal>
</template>
<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';
import HeadlessModal from './HeadlessModal.vue';
withDefaults(defineProps<{
    title?: string;
    description: string;
    icon?: string;
    show: boolean;
    cancelText?: string;
    confirmText?: string;
}>(), {
    title: 'Demande de confirmation',
    cancelText: 'Annuler',
    confirmText: 'Confirmer',
});
</script>
