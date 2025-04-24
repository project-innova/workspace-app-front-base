<template>
    <div class="app-table app-card max-h-full overflow-y-auto">
        <div v-if="$slots.header" class="mb-5">
            <slot name="header"></slot>
        </div>
        <div class="w-full overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="">
                        <th v-if="multiple" class="py-3 px-2 sticky top-0 z-3">
                            <input type="checkbox" :checked="selectedItems.length === dataCollection.length"
                                @click="selectedAll" />
                        </th>
                        <th v-for="column in columns" :key="column.key" class="py-3 px-2 sticky top-0 z-3">
                            <span class="text-sm text-gray-600 font-extrabold flex text-nowrap" :class="{
                                'justify-start': column.align === 'left',
                                'justify-end': column.align === 'right',
                                'justify-center': column.align === 'center',
                            }">
                                <slot :name="`head-${column.key}`">
                                    <span>{{ column.label }}</span>
                                </slot>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="loading">
                        <tr v-for="i in 10" :key="i">
                            <td v-for="column in columns" :key="column.key" class="py-1">
                                <TextPlacholder width="100%" />
                            </td>
                        </tr>
                    </template>
                    <template v-else v-for="(item, index) in dataCollection">
                        <tr class="hover:bg-gray-100 rounded-md transition-all duration-300 select-none cursor-pointer" @click="$emit('selected',{item, index})" @dblclick="$emit('open',{item, index})">
                            <td v-if="multiple" class="px-2">
                                <!-- <input type="checkbox" :value="item[primaryKay]"
                              :checked="selected.includes(item[primaryKay])"
                              @change="emit('update:selected', selected)" /> -->
                            </td>
                            <td v-for="column in columns" :key="column.key" class="py-3 px-2">
                                <span class="text-sm text-gray-800 flex" :class="{
                                    'justify-start': column.align === 'left',
                                    'justify-end': column.align === 'right',
                                    'justify-center': column.align === 'center',
                                }">
                                    <slot :name="`cell-${column.key}`" :item="item" :column="column" :index="index">
                                        {{ item[column.key] }}
                                    </slot>
                                </span>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tfoot v-if="hasFooter">
                    <tr>
                        <td v-if="multiple">
                            <input type="checkbox" />
                        </td>
                        <td v-for="column in columns" :key="column.key">
                            <slot :name="`foot-${column.key}`"></slot>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div v-if="$slots.footer" class="mt-2">
            <slot name="footer"></slot>
        </div>
    </div>

</template>
<script setup lang="ts">
import type { TableColumn } from '../../types'
import { ref } from 'vue'

const props = withDefaults(
    defineProps<{
        columns: TableColumn[]
        paginator?: boolean
        multiple?: boolean
        hasFooter?: boolean
        primaryKey?: string
        selected?: string[] | number[]
        dataCollection: any[]
        loading?: boolean
    }>(),
    {
        paginator: false,
        multiple: false,
        primaryKey: 'id',
        loading: false,
    },
)

const emit = defineEmits(['sort', 'update:selected','selected','open'])

const selectedItems = ref<any[]>(props.selected ?? [])

const selectedAll = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.checked) {
        selectedItems.value = props.dataCollection.map((item) => item[props.primaryKey])
        emit('update:selected', selectedItems.value)
        return
    }
    emit('update:selected', [])
}
</script>
