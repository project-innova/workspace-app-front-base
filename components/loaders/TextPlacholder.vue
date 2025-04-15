<template>
    <span class="h-2.5 rounded-full inline-block overflow-hidden" :style="{ width: props.width }">
        <div class="animated-background"></div>
    </span>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{
    width: string
}>(), {
    width: '100%'
})
</script>