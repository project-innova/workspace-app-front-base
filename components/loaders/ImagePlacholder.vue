<template>
    <span class="inline-block overflow-hidden"
        :class="{ 'rounded-full': props.roundedFull, 'rounded-md': !props.roundedFull }"
        :style="{ width: props.width, height: props.height }">
        <div class="animated-background"></div>
    </span>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{
    width?: string
    height?: string,
    rounded?: boolean,
    roundedFull?: boolean,
}>(), {
    width: '100%',
    height: '100%',
    rounded: false,
    roundedFull: false
})
</script>