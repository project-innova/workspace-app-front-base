<template>
    <button @click="show = true" :class="btnClass">
        <slot />
    </button>
    <ConfirmationModal :show="show" :title="title" :description="message" @cancel="onResponse(false)"
        @confirm="onResponse(true)" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ConfirmationModal from './ConfirmationModal.vue';

const props = withDefaults(defineProps<{
    title?: string,
    message?: string,
    btnClass?: string,
    onConfirm: () => void,
    onCencel?: () => void,
}>(), {
    title: 'Confrimation',
    message: "Êtes vous sur de fair cette action ?"
})

const show = ref(false);

const onResponse = (rsp: boolean) => {
    if (rsp) {
        props.onConfirm();
    }
    show.value = false;
}
</script>