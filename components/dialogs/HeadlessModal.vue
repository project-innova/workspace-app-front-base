<template>
    <Transition name="fade">
        <Teleport to="body">
            <div class="fixed inset-0 bg-black opacity-40 w-screen h-screen z-50" v-if="show == true"
                @click="emit('update:show', false)">
            </div>
        </Teleport>

    </Transition>

    <Transition name="slide-fade">
        <Teleport to="body">
            <div v-if="show == true" class="fixed z-50 inset-0 overflow-y-auto flex justify-center"
                :class="[{ 'top-[30px]': position === 'top', 'items-center': position === 'middle' }]">
                <div class="bg-white inset-0 rounded-xl overflow-y-auto shadow-xl h-fit p-3"
                    :style="{ width: size === 'sm' ? '500px' : size === 'md' ? '700px' : size === 'wrap' ? 'fit-content' : '900px' }"
                    :class="[containerClass]">

                    <div v-if="$slots.head" class="p-2 mb-2">
                        <slot name="head" />
                    </div>
                    <div class="p-2 h-fit max-h-[80vh] overflow-y-auto" :class="contentClass">
                        <slot></slot>
                    </div>
                    <div v-if="$slots.foot" class="p-2">
                        <slot name="foot" />
                    </div>
                </div>
            </div>
        </Teleport>
    </Transition>
</template>
<script setup lang="ts">

defineProps<{
    show: boolean,
    size: 'sm' | 'md' | 'lg' | 'wrap',
    position: 'top' | 'middle',
    contentClass?: string,
    containerClass?: string,
}>()

const emit = defineEmits(['close', 'update:show'])
</script>
