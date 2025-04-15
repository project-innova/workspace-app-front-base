<template>
    <Teleport to="body">
        <Transition name="slide-fade">
            <div class="bg-white inset-0 rounded-xl overflow-hidden shadow-xl z-50 app-context-menu w-[250px] h-fit absolute"
                ref="contextMenu" :class="[$attrs.class]" v-show="show">
                <slot />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';


const props = withDefaults(defineProps<{
    position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}>(), {
    position: 'bottomLeft'
});

const contextMenu = ref<HTMLDivElement | null>(null);
const show = ref(false);

const toggle = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!contextMenu.value || !(contextMenu.value instanceof HTMLElement) || !event.target) return;
    if (contextMenu.value.style.display === 'block') {
        contextMenu.value.style.display = 'none';
    } else {
        contextMenu.value.style.display = 'block';
        if (contextMenu.value.style.left) return;
        const target = event.target as HTMLElement;
        const targetRect = target.getBoundingClientRect();
        const contextMenuRect = contextMenu.value.getBoundingClientRect();
        if (props.position === 'topLeft') {
            contextMenu.value.style.top = targetRect.top + targetRect.height + 'px';
            contextMenu.value.style.left = targetRect.left + 'px';
        } else if (props.position === 'topRight') {
            contextMenu.value.style.top = targetRect.top + targetRect.height + 'px';
            contextMenu.value.style.left = targetRect.right - contextMenuRect.width + 'px';
        } else if (props.position === 'bottomLeft') {
            contextMenu.value.style.top = targetRect.bottom + 'px';
            contextMenu.value.style.left = targetRect.left + 'px';
        } else if (props.position === 'bottomRight') {
            contextMenu.value.style.top = targetRect.bottom + 'px';
            contextMenu.value.style.left = targetRect.right - contextMenuRect.width + 'px';
        }
    }
}

defineExpose({
    toggle
})
onMounted(() => {
    document.addEventListener('click', () => {
        if (contextMenu.value) {
            contextMenu.value.style.display = 'none';
        }
    })
})
</script>
