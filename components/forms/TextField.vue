<template>
    <div class="flex flex-col ">
        <label v-if="label" :for="id" class="block text-sm font-bold"> {{ label
            }} </label>
        <div class="flex rounded-lg outline-0 ring-primary bg-body items-center gap-3"
            :class="[inputContainerClass, { 'py-2 gap-2 px-2': size === 'sm', 'py-3 px-3': size == 'md', 'py-4 px-4': size == 'lg' }]">
            <template v-if="type == 'textarea'">
                <textarea :name="name" :id="id" :placeholder="placeholder" v-model="model"
                    class="focus:outline-none w-full outline-0 ring-0 bg-transparent h-full" :readonly="readonly"
                    :rows="row"></textarea>
            </template>
            <template v-else>
                <slot name="prefix" />
                <input :id="id" v-model="model" :type="type"
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
withDefaults(defineProps<{
    label?: string,
    error?: string,
    helper?: string,
    id?: string,
    name?: string,
    readonly?: boolean,
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

</script>
