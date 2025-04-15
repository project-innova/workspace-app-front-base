<template>
  <div class="flex items-center w-full">
    <div v-for="(avatar, i) in avatars"
      class="size-10 inline-block rounded-full border-2 border-gray-200 overflow-hidden"
      :style="{ 'transform': `translateX(-${i * 15}px)` }">
      <img :src="avatar" alt="avatar" class="size-full border object-cover">
    </div>
    <span :style="{ 'transform': `translateX(-${4 * 15}px)` }" class="text-sm">{{
      total > maxShow ? '+' + (total - maxShow) : '' }}</span>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  avatars: string[],
  total: number,
  maxShow?: number,
  class?: string,
}>(), {
  maxShow: 5,
  class: ''
})
</script>
