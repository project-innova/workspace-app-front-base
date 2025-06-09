<template>
    <div class="flex flex-col " @keydown.stop="">
        <label v-if="label" :for="id" class="block text-sm"> {{ label
            }} <span class="text-red-500 ml-1" v-if="required">*</span></label>
        <div class="flex rounded-lg outline-0 ring-primary bg-secondary-100 items-center gap-3"
            :class="[inputContainerClass, { 'py-2 gap-2 px-2': size === 'sm', 'py-3 px-3': size == 'md', 'py-4 px-4': size == 'lg' }]">
            <template v-if="type == 'textarea'">
                <textarea ref="field" :name="name" :id="id" :placeholder="placeholder" v-model="model"
                    class="focus:outline-none w-full outline-0 ring-0 bg-transparent h-full resize-none" :readonly="readonly"
                    :rows="row"></textarea>
            </template>
            <template v-else>
                <slot name="prefix" />
                <input ref="field" :id="id" v-model="model" :type="type" :name="name"
                    class="focus:outline-none w-full outline-0 ring-0 bg-transparent" :placeholder="placeholder"
                    :readonly="readonly" />
                <slot name="surfix" />
            </template>
        </div>
        <span v-if="error" class="pt-2 text-xs dark:text-rose-600 text-rose-600">
            {{ error }}
        </span>
        <small v-if="helper" class="block pt-2 text-xs leading-4 dark:text-gray-500 text-gray-500"
            v-html="helper"></small>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

withDefaults(defineProps<{
    label?: string,
    error?: string,
    helper?: string,
    id?: string,
    name?: string,
    readonly?: boolean,
    required?: boolean,
    inputContainerClass?: string,
    row?: number,
    size?: 'sm' | 'md' | 'lg',
    placeholder?: string,
    type?: 'text' | 'password' | 'number' | 'email' | 'textarea',
}>(), {
    type: 'text',
    size: 'md',
    row: 8,
});
const model = defineModel() as any

const keyEvent = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key == 'a') {
            e.preventDefault();
            model.value = model.value;
        }
        if (e.key == 'z') {
            e.preventDefault();
            model.value = model.value;
        }
    }
}

const field = ref<HTMLInputElement | null>();

const focus = () => {
    field.value?.focus();
}

defineExpose({ focus })
</script>
