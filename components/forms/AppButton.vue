<template>
    <button :disabled="disbaled" :type="type" class="app-btn primary" :class="{ icon: icon, secondary: secondary, filled: filled,'secondary cursor-not-allowed':disbaled }">
        <span v-if="!loading" class="flex gap-2 items-center">
            <slot name="label">
                {{ label }}
            </slot>
            <slot />
        </span>
        <template v-else>
            <span>{{ loadingLabel }}</span>
            <span class="app-loader-spiner !w-6 !bg-white"> </span>
        </template>
    </button>
</template>
<script setup lang="ts">
withDefaults(
    defineProps<{
        label?: string
        loadingLabel?: string
        size?: 'sm' | 'md' | 'lg'
        type?: 'submit' | 'button'
        loading?: boolean
        icon?: boolean
        secondary?: boolean
        disbaled?: boolean
        filled?: boolean
    }>(),
    {
        type: 'button',
        loadingLabel: 'Chargement...',
        loading: false,
        filled: false,
        size: 'lg',
    },
)
</script>
