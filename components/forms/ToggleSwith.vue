<template>
    <div class="toggle-switch">
        <input type="checkbox" :id="`toggle-${id}`" v-model="model">
        <label :for="`toggle-${id}`" class="toggle-switch-label">
            <span class="toggle-switch-inner"></span>
            <span class="toggle-switch-switch"></span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = defineModel();
const id = ref(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

</script>
