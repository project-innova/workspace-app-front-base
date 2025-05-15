<template>
    <button @click="toggle" ref="buttonRef" :class="btnClass">
        <slot>
            {{ label }}
        </slot>
    </button>
    <Teleport to="body">
        <Transition name="dropdown-trans">
            <div class="app-dropdown-select-menu p-1 " ref="contextMenu"
                :style="[menuProperties, 'width:' + props.wd + 'px']" v-show="isOpen" :id="`dropdown-select-${_id}`">
                <ul>
                    <li v-for="(menu) in menus">
                        <button @click="() => { menu.action(props.data); isOpen = false }" class="w-full">
                            <slot name="name" :props="menu">
                                <div
                                    class="flex justify-start itema-center gap-2 text-sm p-2 rounded-lg hover:bg-primary/10 hover:text-primary">
                                    <component :is="menu.icon" class="size-4" />
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
        data?:Record<string,any>
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
    opacity: '0',
    top: '0px',
    left: '0px',
})
const _id = ref(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
)
const buttonRef = ref()
const contextMenu = ref()
const show = () => {
    isOpen.value = true;
    setupPosition(buttonRef.value!);
}
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
    // console.log('',);
    if (isOpen.value) {
        isOpen.value = false
    } else {
        show()
    }
}

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
    if (window.innerWidth < targetRect.right + width.value) {
        menuProperties.value.left = `${targetRect.right - width.value}px`;
    }
    else {
        menuProperties.value.left = `${targetRect.left}px`;
    }
    if (window.innerHeight < (targetRect.bottom + height.value)-10) {
        if ((targetRect.top)>height.value) {
            menuProperties.value.top = `${targetRect.top - height.value}px`;
        }else{
            // window.innerHeight/2
            // menuProperties.value.top = `${(targetRect.top+100) - height.value}px`
            menuProperties.value.top = `${ window.innerHeight/4}px`
        }
    }
    else {
        menuProperties.value.top = `${targetRect.bottom}px`;
    }
}

onMounted(() => {
    contextMenu.value!.style.display = 'block';
    setTimeout(() => {
        height.value = contextMenu.value!.offsetHeight;
        width.value = contextMenu.value!.offsetWidth;
        contextMenu.value!.addEventListener('resize', onResize);
        contextMenu.value!.style.display = 'none';
        menuProperties.value!.opacity = '1';
    }, 100);
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
