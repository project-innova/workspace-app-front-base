<template>
    <div class="bg-white border border-secondary-100 rounded-md app-card max-h-full overflow-y-auto p-0!">
        <div v-if="$slots.header" class="p-3">
            <slot name="header"></slot>
        </div>
        <div class="p-3 mb-2">
            <div class="grid grid-cols-2">
                <div class="flex items-center gap-2">
                    <slot name="leading"></slot>
                </div>
                <div class="flex items-center justify-end gap-2">
                    <slot v-if="$slots.actions" name="actions"></slot>
                    <PrimeMultiSelect v-if="columns.length > 3" v-model="activeColumns" :options="columns" optionLabel="label" optionValue="key"
                        :max-selected-labels="3" selected-items-label="{0} Colonnes visibles" @change="toggleColumn" class="border-gray-200! h-10! w-50!" />
                    <PrimeBtn v-if="canRefresh" class="size-10 p-0!" severity="secondary" outlined @click="$emit('refresh')"
                      v-tooltip.top="'Rafraîchir'">
                        <RefreshCcwIcon class="size-5" stroke-width="1.5" :class="{ 'animate-spin': loading }" />
                    </PrimeBtn>
                </div>
            </div>
        </div>
        <div class="w-full overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-100 border-b border-gray-200">
                        <th v-if="multiple" class="py-3 px-2 flex justify-start sticky top-0 z-3">
                            <Checkbox :checked="selectedItems.length == dataCollection.length" @click="selectedAll"
                                binary />
                        </th>
                        <template v-for="column in columns" :key="column.key">
                            <th v-show="activeColumns.includes(column.key)" class="py-3 px-2 sticky top-0 z-3">
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
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="loading">
                        <tr v-for="i in 10" :key="i">
                            <td v-for="column in columns" :key="column.key" class="py-1 px-2">
                                <TextPlacholder width="100%" />
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <template v-for="(item, index) in dataCollection">
                            <tr class="hover:bg-gray-100 rounded-md transition-all duration-300 select-none cursor-pointer"
                                @click="$emit('selected', { item, index })" @dblclick="$emit('open', { item, index })">
                                <td v-if="multiple" class="px-2">
                                    <Checkbox :value="item[primaryKey]" v-model="selectedItems"
                                        :input-id="`checkbox-${item[primaryKey]}`" />
                                </td>
                                <template v-for="column in columns" :key="column.key">
                                    <td v-show="activeColumns.includes(column.key)" class="py-3 px-2">
                                        <span class="text-sm text-gray-800 flex text-nowrap" :class="{
                                            'justify-start': column.align === 'left',
                                            'justify-end': column.align === 'right',
                                            'justify-center': column.align === 'center',
                                        }">
                                            <slot :name="`cell-${column.key}`" :item="item" :column="column"
                                                :index="index">
                                                {{ item[column.key] }}
                                            </slot>
                                        </span>
                                    </td>
                                </template>

                            </tr>
                        </template>
                    </template>

                </tbody>
                <tfoot v-if="hasFooter">
                    <tr>
                        <td v-if="multiple">

                        </td>
                        <td v-for="column in columns" :key="column.key">
                            <slot :name="`foot-${column.key}`"></slot>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div v-if="$slots.footer" class="mt-2 p-3">
            <slot name="footer"></slot>
        </div>
    </div>

</template>
<script setup lang="ts">
import type { TableColumn } from '@/appBase/types'
import { computed, ref, watch } from 'vue'
import TextPlacholder from '../loaders/TextPlacholder.vue'
import { RefreshCcwIcon } from 'lucide-vue-next';
import Checkbox from 'primevue/checkbox';

const props = withDefaults(
    defineProps<{
        columns: TableColumn[]
        paginator?: boolean
        multiple?: boolean
        hasFooter?: boolean
        primaryKey?: string
        selected?: string[] | number[]
        dataCollection: any[]
        loading?: boolean,
        canRefresh?: boolean,
    }>(),
    {
        paginator: false,
        multiple: false,
        primaryKey: 'id',
        loading: false,
    },
)

const keys = computed(() => {
    return props.dataCollection.map((item) => item[props.primaryKey])
})
const emit = defineEmits(['sort', 'update:selected', 'selected', 'open', 'refresh', 'update:columns-visible'])

const selectedItems = ref<any[]>(props.selected ?? [])

const activeColumns = ref<string[]>(props.columns.filter((column) => column.visible != false).map((column) => column.key))

const toggleColumn = () => {
    emit('update:columns-visible', activeColumns.value)
}

watch(selectedItems, (newVal) => {
    emit('update:selected', selectedItems.value)
})

const selectedAll = (e: Event) => {
    console.log('keys', keys.value);
    const target = e.target as HTMLInputElement
    if (target.checked) {
        selectedItems.value = keys.value
        return
    }
    selectedItems.value = []
}
</script>
