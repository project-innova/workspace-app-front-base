<template>
    <div class="relative w-full" :class="$attrs.class">
        <label v-if="label" class="block text-sm font-bold"> {{ label }} </label>
        <!-- <button class="app-dropdown-select-handle relative overflow-hidden !pr-10"
            :class="[{ '!h-6 !rounded-md': size == 'sm' }, btnClass]" :style="{ width: w }" @click="toggle"
            ref="buttonRef">
            <div class="flex gap-1 line-clamp-1">
                <template v-if="multiple">
                    <span @click.stop="" v-if="chip">
                        <slot v-for="(item) in selecteds.slice(0, (maxShow))" name="chip"
                            :item="options?.find((d) => d[optionValue] == item)">
                            <span @click.prevent=""
                                class="bg-gray-400 group pointer-events-none flex items-center gap-1 text-white text-xs font-semibold px-1 py-1 rounded-md">{{
                                    item[optionLabel]
                                }} <span class="cursor-pointer p-1">
                                    <XIcon class="size-3" />
                                </span>
                            </span>
                        </slot>
                    </span>
                    <span v-else class="line-clamp-1">
                        {{selecteds.slice(0, (maxShow)).map((item) => options?.find((d) => d[optionValue] ==
                            item)[optionLabel]).join(', ')}}
                    </span>
                </template>
                <template v-else>
                    <span class="line-clamp-1"> {{modelValue != null ? options?.find((d) => d[optionValue] ==
                        modelValue)[optionLabel]
                        : ''}}</span>
                </template>
                <span v-if="selecteds.length > (maxShow)" class=" text-xs font-semibold px-2 py-1 rounded-md">+{{
                    selecteds.length -
                    maxShow }}</span>
            </div>

            <div class="w-10 flex-center h-full  absolute top-0 right-0">
                <span v-if="loading" class="app-loader-spiner bg-gray-400 !w-6"></span>
                <ChevronDownIcon v-else class="w-5 h-5 text-gray-600 transition-all duration-300"
                    :class="{ 'rotate-180': isOpen }" />
            </div>
        </button> -->
        <MultiSelect  v-if="multiple" :options="options" :modelValue="modelValue" :filter="filter" @update:model-value="$emit('update:modelValue',$event)" :option-label="props.optionLabel" :option-value="props.optionValue" class=" flex items-center w-full !shadow-0 h-12 border !border-gray-200":class="btnClass"/>
        <Dropdown  v-else :options="options" :modelValue="modelValue" :filter="filter" @update:model-value="$emit('update:modelValue',$event)" :option-label="props.optionLabel" :option-value="props.optionValue" class=" flex items-center w-full !shadow-0 h-12 border !border-gray-200" :class="btnClass"/>
    </div>
</template>
<script setup lang="ts">
import { ChevronDownIcon, XIcon } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
interface SelectOptionValueColor {
    textColor: string,
    bgColor: string,
    value: any
}
const props = withDefaults(
    defineProps<{
        label?: string
        options: any[]
        multiple?: boolean
        filter?: boolean
        api?: boolean
        optionLabel?: string
        optionValue?: string
        btnClass?: string,
        itemClass?: string,
        dropdownClass?: string,
        itemsContainerClass?: string,
        filterContainerClass?: string,
        w?: string
        size?: 'sm' | 'md' | 'lg'
        maxShow?: number
        loading?: boolean
        chip?: boolean
        valueColors?: SelectOptionValueColor[]
        withConfirmation?: boolean
        modelValue: any | any[]
    }>(),
    {
        multiple: false,
        filter: false,
        optionLabel: 'label',
        optionValue: 'value',
        loading: false,
        maxShow: 3,
    },
)
const emit = defineEmits(['update:modelValue', 'searching'])
const _options = ref(props.options)
const updateModelValue = (value: any) => {
    if (props.multiple) {
        if (props.modelValue.includes(value)) {
            const val = props.modelValue.filter((item: any) => item != value)
            emit(
                'update:modelValue',
                val,
            )
            selecteds.value = val
        } else {
            const val = [...props.modelValue, value]
            selecteds.value = val
            emit('update:modelValue', val)
        }
    } else {
        emit('update:modelValue', value)
        isOpen.value = false
    }
}
const _id = ref(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
)
const isOpen = ref(false)
const menuProperties = ref({
    width: '200px',
    minWidth: '200px',
    top: '0px',
    left: '0px',
    opacity: '0',
})

const selecteds = ref([] as any[])


const filterInput = ref()
const onFilter = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    emit('searching', value)
    if (!props.api) {
        _options.value = props.options.filter((option) =>
            option.label.toLowerCase().includes(value.toLowerCase()),
        )
    }

}


const clearFilter = () => {
    _options.value = props.options
    filterInput.value.value = ''
}

const buttonRef = ref()
const contextMenu = ref()

const closeMenu = () => {
    const _ev = new CustomEvent('open-menu', {
        detail: {
            id: _id.value,
            open: false,
        },
    })
    document.dispatchEvent(_ev)
}

const show = () => {
    isOpen.value = true;
    setupPosition(buttonRef.value!);
}
const toggle = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeMenu()
    if (isOpen.value) {
        isOpen.value = false
    } else {
        show();
    }
}

watch(() => props.options, (newValue) => {
    _options.value = newValue
})
const height = ref(0);
const width = ref(0);
const onResize = () => {
    height.value = contextMenu.value!.offsetHeight;
    width.value = contextMenu.value!.offsetWidth;
}
const hide = () => {

}
const setupPosition = (target: HTMLElement) => {
    const targetRect = target.getBoundingClientRect();
    menuProperties.value.width = targetRect.width + 'px';
    menuProperties.value.left = targetRect.left + 'px';
    if (window.innerHeight < targetRect.bottom + height.value) {
        menuProperties.value.top = `${window.innerHeight - height.value}px`;
    }
    else {
        menuProperties.value.top = `${targetRect.bottom}px`;
    }
}

</script>
