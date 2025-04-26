<template>
    <Teleport to="body">
        <Transition name="slide-fade">
            <div class="bg-white inset-0 rounded-xl overflow-hidden shadow-xl z-50 app-context-menu w-[250px] h-fit absolute"
                ref="contextMenu" :class="[$attrs.class]" v-show="_show">
                <slot />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

withDefaults(defineProps<{
    position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}>(), {
    position: 'bottomLeft'
});

const contextMenu = ref<HTMLDivElement | null>(null);
const _show = ref(false);
const show = (taget:HTMLElement) => {
    _show.value = true;
    setupPosition(taget);
}
const hide = () => {
    _show.value = false;
}
const toggle = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!contextMenu.value || !(contextMenu.value instanceof HTMLElement) || !event.target) return;
    _show.value = true;
    setupPosition(event.target as HTMLElement);

}
const setupPosition = (target: HTMLElement) => {
    const targetRect = target.getBoundingClientRect();
    if (window.innerWidth < targetRect.right + width.value) {
        contextMenu.value!.style.left = `${targetRect.right-width.value}px`;
    }
    else {
        contextMenu.value!.style.left = `${targetRect.right}px`;
    }
    if (window.innerHeight < targetRect.bottom + height.value) {
        contextMenu.value!.style.top = `${window.innerHeight-height.value}px`;
    }
    else {
        contextMenu.value!.style.top = `${targetRect.bottom}px`;
    }
}

defineExpose({
    toggle,
    show,
    hide,
    contextMenu,
    _show,
})
const height = ref(0);
const width = ref(0);
const onResize = () => {
    height.value = contextMenu.value!.offsetHeight;
    width.value = contextMenu.value!.offsetWidth;
}
onMounted(() => {
    contextMenu.value!.style.opacity = '0';
    contextMenu.value!.style.display = 'block';
    height.value = contextMenu.value!.offsetHeight;
    width.value = contextMenu.value!.offsetWidth;
    setTimeout(() => {
        contextMenu.value!.style.opacity = '1';
        contextMenu.value!.style.display = 'none';
    }, 100);
    contextMenu.value!.addEventListener('resize', onResize);
    document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!contextMenu.value?.contains(target)) {
            hide();
        }
    })
})
</script>
