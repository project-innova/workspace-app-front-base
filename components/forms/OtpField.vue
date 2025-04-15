<template>
  <div class="flex flex-col">
    <label v-if="label" :for="id" class="block text-sm font-bold"> {{ label }} </label>
    <div class="flex gap-2 justify-between" ref="otpRef">
      <input v-for="i in pad" :key="i" type="text" maxlength="1" v-model="otpArray[i - 1]"
        @keyup.stop="keyup($event, i - 1)" @paste="paste($event)"
        class="w-10 h-10 text-center text-xl border bg-body rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>

    <span v-if="error" class="pt-2 text-xs dark:text-rose-600 text-rose-600">
      {{ error }}
    </span>
    <small v-if="helper" class="block pt-2 text-xs leading-4 dark:text-gray-500 text-gray-500" v-html="helper"></small>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    error?: string
    helper?: string
    id?: string
    name?: string
    pad?: number
    modelValue?: string
  }>(),
  {
    pad: 6,
  },
)
const emit = defineEmits(['update:modelValue', 'change', 'submit'])
const otpArray = ref<string[] | null[]>([])
const otpRef = ref<HTMLDivElement | null>(null)
const pasteValue = ref('')
const keyup = (e: KeyboardEvent, index: number) => {
  const children = otpRef.value?.children as unknown as HTMLInputElement[]
  const key = e.key
  if (index > 0 && ['Backspace', 'Delete'].includes(key)) {
    setTimeout(() => {
      children[index - 1].focus()
    }, 100)
  } else {
    const ignoreKeys = [
      'Shift',
      'CapsLock',
      'Alt',
      'Control',
      'Meta',
      'Enter',
      'Tab',
      'ArrowUp',
      'ArrowDown',
      'Enter',
    ]
    if (pasteValue.value) {
      otpArray.value = pasteValue.value.split('')
      pasteValue.value = ''
      emit('submit')
    } else if (key === 'Enter') {
      emit('submit')
    } else if (!!key?.match(/[0-9]/)) {
      otpArray.value[index] = key
      if (index < props.pad - 1) {
        setTimeout(() => {
          children[index + 1].focus()
        }, 100)
      }
    } else if (['ArrowRight', 'Tab'].includes(key)) {
      if (index < props.pad - 1) {
        setTimeout(() => {
          children[index + 1].focus()
        }, 100)
      }
    } else if (['ArrowLeft'].includes(key)) {
      if (index > 0) {
        setTimeout(() => {
          children[index - 1].focus()
        }, 100)
      }
    } else if (!ignoreKeys.includes(key)) {
      otpArray.value[index] = null
      return
    } else if (ignoreKeys.includes(key)) {
      return
    } else {
      console.log('Unknown key', key)
    }
  }
  emit('change', otpArray.value.join(''))
}

const paste = (e: ClipboardEvent) => {
  const value = e.clipboardData?.getData('text')
  const match = value?.match(/[0-9]/g)
  if (value?.length === props.pad && match?.length === props.pad) {
    pasteValue.value = value
  }
}


</script>
