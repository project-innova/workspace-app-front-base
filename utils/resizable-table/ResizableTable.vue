<template>
    <div class="bg-white border rounded-lg border-secondary-100! shadow-none! max-h-full overflow-y-auto scrollbar-hide"
        ref="tableContainer">
        <div v-if="$slots.header" class="mb-5">
            <slot name="header"></slot>
        </div>
        
        <!-- En-tête du tableau -->
        <table ref="tableHead" class="table-fixed w-full sticky top-0 bg-white z-10">
            <thead>
                <tr>
                    <th v-for="(column, col_index) in columns" 
                        :key="column.key"
                        class="sticky top-0 z-3 border-b border-secondary-100! bg-white" 
                        :data-col-id="column.key"
                        :class="thClass"
                        :style="getColumnStyle(column)">
                        <div class="relative py-2 px-2 group">
                            <span class="text-sm text-gray-600 font-extrabold flex text-nowrap overflow-hidden items-center"
                                :class="getAlignmentClass(column.align)">
                                <slot :name="`head-${column.key}`">
                                    <span class="line-clamp-1">{{ column.label }}</span>
                                </slot>
                            </span>
                            <!-- Resizer uniquement pour les colonnes qui ne sont pas la dernière -->
                            <span v-if="isColumnResizable(col_index)"
                                class="h-full opacity-0 group-hover:opacity-100 right-0 top-0 border-l border-secondary-100! absolute cursor-ew-resize select-none"
                                :col-resizer="col_index"
                                :data-col-id="column.key">
                            </span>
                        </div>
                    </th>
                </tr>
            </thead>
        </table>
        
        <!-- Corps du tableau -->
        <table class="table-fixed w-full">
            <tbody>
                <!-- Lignes de données -->
                <template v-for="(item, index) in dataCollection" :key="item.id">
                    <tr v-if="shouldShowItem(item, index)"
                        draggable="true" 
                        :id="`table-data-item-${item.id}`"
                        class="hover:bg-primary/10 hover:text-primary transition-all duration-300 select-none cursor-pointer"
                        :class="getRowClass(item, index)"
                        @click="handleRowClick(item, index)"
                        @dblclick="handleRowDoubleClick(item, index)"
                        @dragstart="handleDragStart($event, item)"
                        @dragover="handleDragOver($event, item)"
                        @drop="handleDrop($event, item)"
                        @dragleave="handleDragLeave($event)"
                        @dragend="handleDragEnd($event)">
                        
                        <!-- Colonne de sélection multiple -->
                        <td v-if="multiple" class="px-2 pointer-events-none">
                            <!-- Checkbox pour sélection multiple - commenté pour l'instant -->
                        </td>
                        
                        <!-- Cellules de données -->
                        <td v-for="column in columns" 
                            :key="column.key" 
                            :data-col-id="column.key"
                            :style="getColumnStyle(column)">
                            <div class="relative py-2 px-2">
                                <span class="text-sm text-gray-800 flex pointer-events-all overflow-y-hidden items-center line-clamp-1"
                                    :class="getAlignmentClass(column.align)">
                                    <slot :name="`cell-${column.key}`" 
                                        :item="item" 
                                        :column="column" 
                                        :index="index">
                                        {{ item[column.key] }}
                                    </slot>
                                </span>
                            </div>
                        </td>
                    </tr>
                </template>
                
                <!-- Lignes de chargement -->
                <template v-if="loading">
                    <tr v-for="i in 10" :key="`loading-${i}`">
                        <td v-for="column in columns" 
                            :key="column.key" 
                            :data-col-id="column.key" 
                            class="py-1 px-2"
                            :style="getColumnStyle(column)">
                            <TextPlacholder width="100%" />
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        
        <div v-if="$slots.footer" class="mt-2">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/appBase/types'
import TextPlacholder from '@/appBase/components/loaders/TextPlacholder.vue'
import { onMounted, ref, computed } from 'vue'
import { useResizableTableStore } from './store'

// Types
interface DragEventData {
    event: DragEvent
    item: any
    tRowId?: string
}

// Props
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
        thClass?: string
        itemShowCondition?: (item: any, index: number) => boolean
        itemClassCondition?: (item: any, index: number) => string
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
    }
)

// Store et émissions
const tableStore = useResizableTableStore()
const emit = defineEmits([
    'sort', 'update:selected', 'selected', 'open', 
    'dragstart', 'dragend', 'dragover', 'dragleave', 
    'drop', 'scollBottom'
])

// Refs
const selectedItems = ref<any[]>(props.selected ?? [])
const tableHead = ref<HTMLTableElement>()
const tableContainer = ref<HTMLDivElement>()

// Computed
const isLastColumn = computed(() => (index: number) => index === props.columns.length - 1)

// Méthodes utilitaires
const getColumnStyle = (column: TableColumn) => {
    const width = tableStore.getColumnSize(props.id, column.key, column.width ?? 150)
    return `width: ${width}px`
}

const getAlignmentClass = (align?: string) => {
    return {
        'justify-start': align === 'left' || !align,
        'justify-end': align === 'right',
        'justify-center': align === 'center',
    }
}

const getRowClass = (item: any, index: number) => {
    const classes = [props.trClass]
    if (props.itemClassCondition) {
        classes.push(props.itemClassCondition(item, index))
    }
    return classes.filter(Boolean)
}

const shouldShowItem = (item: any, index: number) => {
    return props.itemShowCondition ? props.itemShowCondition(item, index) : true
}

const isColumnResizable = (colIndex: number) => {
    // La dernière colonne n'est pas redimensionnable
    return colIndex + 1 !== props.columns.length
}

// Gestionnaires d'événements
const handleRowClick = (item: any, index: number) => {
    emit('selected', { item, index })
}

const handleRowDoubleClick = (item: any, index: number) => {
    emit('open', { item, index })
}

const handleDragStart = (event: DragEvent, item: any) => {
    const tRowId = `table-data-item-${item.id}`
    emit('dragstart', { event, item, tRowId })
}

const handleDragOver = (event: DragEvent, item: any) => {
    event.preventDefault()
    event.stopPropagation()
    const tRowId = `table-data-item-${item.id}`
    emit('dragover', { event, item, tRowId })
}

const handleDragLeave = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emit('dragleave', { event })
}

const handleDragEnd = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emit('dragend', { event })
}

const handleDrop = (event: DragEvent, item: any) => {
    event.preventDefault()
    event.stopPropagation()
    const tRowId = `table-data-item-${item.id}`
    emit('drop', { event, item, tRowId })
}

const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    const { scrollTop, scrollHeight, clientHeight } = target
    
    if (scrollTop + clientHeight >= scrollHeight - 1) {
        emit('scollBottom', { event, target })
    }
}

// Gestion du redimensionnement des colonnes
const initializeColumnResizers = () => {
    const resizers = document.querySelectorAll('[col-resizer]') as NodeListOf<HTMLElement>
    
    resizers.forEach((resizer) => {
        resizer.addEventListener('mousedown', handleResizerMouseDown)
    })
}

const handleResizerMouseDown = (event: MouseEvent) => {
    const resizer = event.target as HTMLElement
    const colIndex = Number(resizer.getAttribute('col-resizer'))
    const colId = resizer.getAttribute('data-col-id')
    
    if (!tableHead.value || !colId) return

    const thElements = tableHead.value.querySelectorAll('th')
    const targetCol = thElements[colIndex] as HTMLElement
    const nextCol = targetCol.nextElementSibling as HTMLElement
    const prevCol = targetCol.previousElementSibling as HTMLElement
    const relativeCol = nextCol ?? prevCol
    
    if (!relativeCol) return

    const relativeColId = relativeCol.getAttribute('data-col-id')
    
    const cols = document.querySelectorAll(`td[data-col-id="${colId}"]`) as NodeListOf<HTMLElement>
    const relativeCols = document.querySelectorAll(`td[data-col-id="${relativeColId}"]`) as NodeListOf<HTMLElement>

    const startX = event.clientX
    const startWidth = targetCol.offsetWidth
    const startRelativeWidth = relativeCol.offsetWidth
    const minWidth = 50
    const maxWidth = 600

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        let newWidth = startWidth + deltaX
        let newRelativeWidth = startRelativeWidth - deltaX

        // Contraintes de largeur
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
        newRelativeWidth = Math.max(minWidth, Math.min(maxWidth, newRelativeWidth))

        // Éviter les redimensionnements extrêmes
        if (newWidth === minWidth || newWidth === maxWidth || 
            newRelativeWidth === minWidth || newRelativeWidth === maxWidth) {
            return
        }

        // Appliquer les nouvelles largeurs
        targetCol.style.width = `${newWidth}px`
        relativeCol.style.width = `${newRelativeWidth}px`
        
        // Sauvegarder dans le store
        tableStore.setColumSIze(props.id, colId, newWidth)
        if (relativeColId) {
            tableStore.setColumSIze(props.id, relativeColId, newRelativeWidth)
        }

        // Appliquer aux cellules
        cols.forEach(col => col.style.width = `${newWidth}px`)
        relativeCols.forEach(col => col.style.width = `${newRelativeWidth}px`)
    }

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

// Lifecycle
onMounted(() => {
    initializeColumnResizers()
    
    if (tableContainer.value) {
        tableContainer.value.addEventListener('scroll', handleScroll)
    }
})
</script>
