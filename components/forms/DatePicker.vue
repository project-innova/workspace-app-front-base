<template>
    <div class="flex flex-col">
        <label for="datepicker" class="block text-sm font-bold">{{ label }}</label>
        <flat-pickr v-model="model" :config="config" />
    </div>
</template>
<script setup lang="ts">
import flatPickr from 'vue-flatpickr-component'
import { French } from 'flatpickr/dist/l10n/fr.js';
const props = withDefaults(
    defineProps<{
        // modelValue: string | Date | null
        formatter?: string | Date | null
        type?: 'date' | 'datetime' | 'time' | 'month' | 'year' | 'week'
        format?: string;
        displayFormat?: string;
        minDate?: string | Date
        maxDate?: string | Date
        mode?: 'single' | 'multiple' | 'range'
        multiCalendars?: boolean
        minRange?: boolean
        maxRange?: boolean,
        label?: string
    }>(),
    {
        mode: 'single',
        type: 'date',
        format: 'Y-m-d',
        displayFormat: 'j, M Y à H:i',
        // modelValue: null,
    },
)

const model = defineModel<any>()
const config = {
    wrap: false,
    altFormat: props.displayFormat ? props.displayFormat : (props.format ? props.format : 'Y-m-d'),
    altInput: true,
    dateFormat: props.format,
    minDate: props.minDate,
    maxDate: props.maxDate,
    locale: French,
    mode: props.mode,
    // defaultDate: new Date('2000-01-01 00:00:00'),
    enableTime: props.type === 'datetime' || props.type === 'time',
    noCalendar: props.type === 'time',
    time_24hr: true,
    altInputClass: 'h-12 rounded-lg bg-gray-100 border-0 p-2 outline-none w-full',
};
const emit = defineEmits(['update:modelValue'])
</script>
<style lang="scss">
.flatpickr-day {
    @apply rounded-md;

    &.today {
        @apply border-primary
    }

    &.selected {
        @apply border-primary bg-primary hover:border-primary hover:bg-primary-600 text-white;

        &.startRange {
            @apply rounded-l-md;
        }

        &.endRange {
            @apply rounded-r-md;
        }
    }
}
</style>
