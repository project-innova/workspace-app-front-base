<template>
    <button @click="toggle" ref="buttonRef" :class="btnClass">
        <slot>
            {{ label }}
        </slot>
    </button>
    <Teleport to="body">
        <Transition name="dropdown-trans">
            <div class="app-dropdown-select-menu p-1 " ref="contextMenu"
                :style="[menuProperties, 'width:' + props.wd + 'px']" v-if="isOpen" :id="`dropdown-select-${_id}`">
                <ul>
                    <li v-for="(menu) in menus">
                        <button @click="() => { menu.action(menu.data); isOpen = false }" class="w-full">
                            <slot name="name" :props="menu">
                                <div
                                    class="flex justify-start itema-center gap-2 text-sm p-2 rounded-lg hover:bg-gray-100">
                                    <component :is="menu.icon" class="size-5" />
                                    <span>{{ menu.label }}</span>
                                </div>
                            </slot>
                        </button>
                    </li>
                </ul>
            </div>
        </Transition>
    </Teleport>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(
    defineProps<{
        label?: string,
        btnClass?: string,
        wd?: number,
        position?: 'left' | 'right',
        menus: {
            label: string,
            data?: any,
            icon: any,
            action: (data: any) => void
        }[]
        size?: 'sm' | 'md' | 'lg'
    }>(),
    {
        wd: 200,
        position: 'left'
    },
)
const isOpen = ref(false)
const menuProperties = ref({
    top: '0px',
    left: '0px',
})
const _id = ref(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
)
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

const toggle = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeMenu()
    if (isOpen.value) {
        isOpen.value = false
    } else {
        isOpen.value = true
        const targetRect = buttonRef.value.getBoundingClientRect()
        menuProperties.value.top = targetRect.bottom + 5 + 'px'
        menuProperties.value.left = (props.position == 'right' ? (targetRect.left - props.wd + targetRect.width) : targetRect.left) + 'px'
    }
}

onMounted(() => {
    document.addEventListener('open-menu', (e: any) => {
        if (e.detail.id != _id.value) {
            isOpen.value = false
        }
    })
    document.onscroll = () => {
        isOpen.value = false
    }

    document.addEventListener('click', (e) => {
        const _me = document.getElementById(`dropdown-select-${_id.value}`)
        if (e.target && _me && !_me.contains(e.target as HTMLElement)) {
            isOpen.value = false
        }
    })
})
</script>
