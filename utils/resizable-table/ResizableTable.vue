<template>
    <div class="bg-white border rounded-lg border-secondary-100! shadow-none! max-h-full overflow-y-auto scrollbar-hide"
        ref="tableContainer">
        <div class="">
                <div v-if="$slots.header" class="mb-5">
                    <slot name="header"></slot>
                </div>
            </div>
            <table ref="tableHead" class="table-fixed w-full sticky top-0 bg-white z-10">
                <th v-for="(column, col_index) in columns" :key="column.key"
                    class="sticky top-0 z-3 border-b border-secondary-100! bg-white" :data-col-id="column.key"
                    :class="thClass"
                    :style="`width:${tableStore.getColumnSize(id, column.key, column.width ?? 150)}px`">
                    <div class="relative py-2 px-2 group">
                        <span class="text-sm text-gray-600 font-extrabold flex text-nowrap overflow-hidden items-center"
                            :class="{
                                'justify-start': column.align === 'left',
                                'justify-end': column.align === 'right',
                                'justify-center': column.align === 'center',
                            }">
                            <slot :name="`head-${column.key}`">
                                <span class=" line-clamp-1">{{ column.label }}</span>
                            </slot>
                        </span>
                        <span
                            class="h-full opacity-0 group-hover:opacity-100 right-0 top-0 border-l border-secondary-100! absolute cursor-ew-resize select-none"
                            v-if="col_index + 1 != columns.length" :col-resizer="col_index"
                            :data-col-id="column.key"></span>
                    </div>
                </th>
            </table>
            <table class="table-fixed w-full">
                <template v-for="(item, index) in dataCollection">
                    <tr draggable="true" :id="`table-data-item-${item.id}`"
                        class="hover:bg-primary/10 hover:text-primary transition-all duration-300 select-none cursor-pointer"
                        :class="[trClass, itemClassCondition ? itemClassCondition!(item, index) : '']"
                        @click="$emit('selected', { item, index })" @dblclick="$emit('open', { item, index })"
                        @dragstart="onDragStart($event, item, `table-data-item-${item.id}`)"
                        @dragover="onDragOver($event, item, `table-data-item-${item.id}`)"
                        @drop="onDrop($event, item, `table-data-item-${item.id}`)"
                        @dragleave="onDragLeave($event, `table-data-item-${item.id}`)"
                        @dragend="onDragEnd($event, `table-data-item-${item.id}`)">
                        <td v-if="multiple" class="px-2 pointer-events-none">
                            <!-- <input type="checkbox" :value="item[primaryKay]"
                              :checked="selected.includes(item[primaryKay])"
                              @change="emit('update:selected', selected)" /> -->
                        </td>
                        <td v-for="(column, col_index) in columns" :key="column.key" class="" :data-col-id="column.key"
                            :style="`width:${tableStore.getColumnSize(id, column.key, column.width ?? 150)}px`">
                            <div class="relative py-2 px-2">
                                <span
                                    class="text-sm text-gray-800 flex pointer-events-all overflow-y-hidden items-center line-clamp-1"
                                    :class="{
                                        'justify-start': column.align === 'left',
                                        'justify-end': column.align === 'right',
                                        'justify-center': column.align === 'center',
                                    }">
                                    <slot :name="`cell-${column.key}`" :item="item" :column="column" :index="index">
                                        {{ item[column.key] }}
                                    </slot>
                                </span>
                            </div>
                        </td>
                    </tr>
                </template>
                <template v-if="loading">
                    <tr v-for="i in 10" :key="i">
                        <td v-for="column in columns" :key="column.key" :data-col-id="column.key" class="py-1 px-2"
                            :style="`width:${tableStore.getColumnSize(id, column.key, column.width ?? 150)}px`">
                            <TextPlacholder width="100%" />
                        </td>
                    </tr>
                </template>
            </table>
            <div v-if="$slots.footer" class="mt-2">
                <slot name="footer"></slot>
            </div>
    </div>

</template>
<script setup lang="ts">
import type { TableColumn } from '@/appBase/types'
import TextPlacholder from '@/appBase/components/loaders/TextPlacholder.vue'
import { onMounted } from 'vue';
import { ref } from 'vue'
import { useResizableTableStore } from './store';

const props = withDefaults(
    defineProps<{
        columns: TableColumn[]
        paginator?: boolean
        multiple?: boolean
        hasFooter?: boolean
        primaryKey?: string
        id?: string
        cellClass?: string
        trClass?: string
        thClass?: string,
        itemShowCondition?: (item: any, index: number) => boolean,
        itemClassCondition?: (item: any, index: number) => string,
        selected?: string[] | number[]
        dataCollection: any[]
        loading?: boolean
    }>(),
    {
        paginator: false,
        multiple: false,
        id: '#table',
        primaryKey: 'id',
        loading: false,
    },
)
// const width =
const tableStore = useResizableTableStore();
const emit = defineEmits(['sort', 'update:selected', 'selected', 'open', 'dragstart', 'dragend', 'dragover', 'dragleave', 'drop', 'scollBottom'])

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
const onDragStart = (e: DragEvent, item: any, tRowId: string) => {
    // e.preventDefault();
    // e.stopPropagation();
    emit('dragstart', { event: e, item, tRowId });

};
const onDragOver = (e: DragEvent, item: any, tRowId: string) => {
    e.preventDefault();
    e.stopPropagation();
    emit('dragover', { event: e, item, tRowId });


};
const onDragLeave = (e: DragEvent, tRowId: string) => {
    e.preventDefault();
    e.stopPropagation();
    emit('dragleave', { event: e, tRowId });
};

const onDragEnd = (e: DragEvent, tRowId: string) => {
    e.preventDefault();
    e.stopPropagation();
    emit('dragend', { event: e, tRowId });

    const target = document.getElementById(tRowId) as HTMLInputElement

    resetDragging(target);
};

const onDrop = async (e: DragEvent, item: any, tRowId: string) => {
    e.preventDefault();
    e.stopPropagation();
    emit('drop', { event: e, item, tRowId });
};

const resetDragging = (target: any) => {
    target.classList.remove('bg-primary/10');
};
const tableHead = ref();
const tableContainer = ref();
onMounted(() => {
    const resizer = document.querySelectorAll('[col-resizer]') as NodeListOf<HTMLElement>;

    var colsWidth = [];
    resizer.forEach((r) => {
        r.addEventListener('mousedown', (e: MouseEvent) => {
            const colIndex = Number(r.getAttribute('col-resizer'));
            const colId = r.getAttribute('data-col-id');
            const columns = props.columns;
            if (!tableHead.value) return;
            const thElements = tableHead.value.querySelectorAll('th');
            const targetCol = thElements[colIndex] as HTMLElement;
            const prevCol = targetCol.previousElementSibling as HTMLElement;
            const nextCol = targetCol.nextElementSibling as HTMLElement;
            const relativeCol = nextCol ?? prevCol;
            const relativeColId = relativeCol.getAttribute('data-col-id');

            const cols = document.querySelectorAll('td[data-col-id="' + colId + '"]') as NodeListOf<HTMLElement>;
            const relativeCols = document.querySelectorAll('td[data-col-id="' + relativeColId + '"]') as NodeListOf<HTMLElement>;

            const startX = e.clientX;
            const startWidth = targetCol.offsetWidth;
            const startRlWidth = relativeCol.offsetWidth;
            const minWidth = 50;   // Largeur minimale
            const maxWidth = 600;  // Largeur maximale

            const onMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                let newWidth = startWidth + deltaX;
                let newRlWidth = startRlWidth - deltaX;
                if (newWidth < minWidth) newWidth = minWidth;
                if (newWidth > maxWidth) newWidth = maxWidth;

                if (newRlWidth < minWidth) newRlWidth = minWidth;
                if (newRlWidth > maxWidth) newRlWidth = maxWidth;

                colsWidth[colIndex] = newWidth;
                if (newWidth == minWidth || newWidth == maxWidth || newRlWidth == minWidth || newRlWidth == maxWidth) return;

                targetCol.style.width = `${newWidth}px`;
                relativeCol.style.width = `${newRlWidth}px`;
                tableStore.setColumSIze(props.id, relativeColId ?? '', newRlWidth);
                tableStore.setColumSIze(props.id, colId ?? '', newWidth);
                cols.forEach((col) => {
                    col.style.width = `${newWidth}px`;
                });
                relativeCols.forEach((col) => {
                    col.style.width = `${newRlWidth}px`;
                });

            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
    if (tableContainer.value) {
        console.log('tableContainer.value', tableContainer.value)
    tableContainer.value.addEventListener('scroll', (e: Event) => {
        const target = e.target as HTMLElement;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight - 1) {
            emit('scollBottom', { event: e, target });
        }
        });
    }
})
</script>
