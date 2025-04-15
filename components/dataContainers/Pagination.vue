<template>
  <VueAwesomePaginate
    :total-items="totalItems"
    :items-per-page="itemsPerPage"
    :max-pages-shown="5"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :show-ending-buttons="true"
    :show-breakpoint-buttons="false"
    @click="$emit('paginate', $event)"
  >
    <template #prev-button>
      <ChevronLeftIcon />
    </template>
    <template #next-button>
      <ChevronRightIcon />
    </template>
    <template #first-page-button>
      <ChevronLeftIcon />
    </template>
    <template #last-page-button>
      <ChevronRightIcon />
    </template>
  </VueAwesomePaginate>
</template>
<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

defineProps({
  totalItems: {
    type: Number,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    default: 0,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
})
</script>
<style lang="scss">
.pagination-container {
  display: flex;

  column-gap: 10px;
}

.paginate-buttons {
  @apply rounded-lg;
  height: 30px;
  min-width: 30px;
  padding: 0px 5px;
  cursor: pointer;
  transition: background-color;
  transition-duration: var(--lvp-transition-duration);
  transition-timing-function: var(--lvp-transition-timing-function);
  background-color: white;
  border: 1px solid rgb(234, 234, 234);
  color: black;
}

.paginate-buttons:hover {
  background-color: #ebebeb;
}

.active-page {
  background-color: var(--lvp-color-primary);

  border: 1px solid var(--lvp-color-primary);

  color: white;
}

.active-page:hover {
  background-color: var(--lvp-color-primary-hover);
}

.paginate-buttons {
  &.back-button,
  &.next-button {
  }
}
</style>
