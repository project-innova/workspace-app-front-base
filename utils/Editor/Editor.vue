<template>
    <div class="">
        <label v-if="label" class="text-sm mb-2">{{ label }}</label>
        <div class="border border-secondary-100! rounded-lg">
            <div id="toolBar" class="rounded-lg p-2 flex flex-wrap gap-1 border-none! border-b! border-secondary-100!">
                <div class="flex items-center">
                    <button class="ql-undo" v-tooltip.top="'Annuler'"></button>
                    <button class="ql-redo" v-tooltip.top="'Rétablir'"></button>
                </div>
                <div class="flex gap-2 items-center">
                    <div class="ql-header ql-picker">
                        <select name="header" class="ql-header">
                            <option value="1">Titre 1</option>
                            <option value="2">Titre 2</option>
                            <option value="3">Titre 3</option>
                            <option value="4">Titre 4</option>
                            <option value="5">Titre 5</option>
                            <option value="6">Titre 6</option>
                        </select>
                    </div>
                    <div class="ql-header ql-picker">
                        <select name="font" class="ql-font">
                            <option value="sans-serif" selected>Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="monospace">Monospace</option>
                        </select>
                    </div>
                </div>
                <div class="flex items-center">
                    <button class="ql-bold" v-tooltip.top="'Gras'"></button>
                    <button class="ql-italic" v-tooltip.top="'Italique'"></button>
                    <button class="ql-underline" v-tooltip.top="'Souligné'"></button>
                    <button class="ql-strike" v-tooltip.top="'Barré'"></button>
                    <!-- <button class="ql-Link" v-tooltip.top="'Lien'"></button> -->
                </div>
                <div class="flex items-center">
                    <button class="ql-list" v-tooltip.top="'Liste ordonnée'" value="ordered"></button>
                    <button class="ql-list" v-tooltip.top="'Liste non ordonnée'" value="bullet"></button>
                    <!-- <button class="ql-indent" v-tooltip.top="'Indenter'"></button>
                    <button class="ql-indent" v-tooltip.top="'Désindenter'"></button> -->
                </div>
                <div class="flex items-center">
                    <button class="ql-align" v-tooltip.top="'Aligner à gauche'"></button>
                    <button class="ql-align" v-tooltip.top="'Aligner au centre'" value="center"></button>
                    <button class="ql-align" v-tooltip.top="'Aligner à droite'" value="right"></button>
                    <button class="ql-align" v-tooltip.top="'Justifier'" value="justify"></button>
                </div>

                <button class="ql-clean" v-tooltip.top="'Effacer tout'"></button>
            </div>
            <div id="ql-editor" class="border-none! bg-secondary-100" :style="`height:${height};`">

            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url'
import { ref } from 'vue';
import EditorPlugin from './plugins';
const props = defineProps<{
    modules?: any;
    placeholder?: string;
    label?: string;
    modelValue?: string;
    disabled?: boolean;
    height?: string
}>();
const emit = defineEmits(['update:modelValue']);


Quill.register('modules/dgiws', EditorPlugin)
Quill.register('modules/magicUrl', MagicUrl)
const quill = ref<Quill | null>(null);
onMounted(() => {
    try {
        quill.value = new Quill('#ql-editor', {
            modules: {
                toolbar: {
                    container: '#toolBar',
                    handlers: [
                        // ['undo', 'redo', 'font', 'indent', 'clean', 'strike', 'underline', 'italic', 'bold', 'link', 'list', { align: [] }],
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        // ['blockquote', 'code-block'],
                        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, {
                            align: []
                        }],
                        // ['image', 'video'],
                        ['clean']
                    ]
                },
                dgiws: true,
                magicUrl: {
                    // Regex used to check URLs during typing
                    urlRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)|(tel:[\S]+)/g,
                    // Regex used to check URLs on paste
                    globalRegularExpression: /(https?:\/\/|www\.|tel:)[\S]+/g,
                },

                history: {
                    delay: 1000,
                    maxStack: 500,
                    userOnly: true,
                },
            },
            placeholder: props.placeholder,
            theme: 'snow',
            readOnly: props.disabled,
        });
        quill.value.on(Quill.events.SELECTION_CHANGE, (range, oldRange, source) => {
            console.log('selection_change', range, oldRange, source);
        });
        quill.value.on(Quill.events.TEXT_CHANGE, (delta, oldDelta, source) => {
            emit('update:modelValue', getHTML());
        });
    } catch (error) {
        console.log('error', error);
    }
    if (props.modelValue) {
        setHTML(props.modelValue)
    }
    // quill.setText(props.modelValue!);
});
const getHTML = () => {
    return quill.value!.root.innerHTML;
}
const setHTML = (html: string) => {
    quill.value!.clipboard.dangerouslyPasteHTML(html)
}

defineExpose({
    getHTML,
    setHTML,
})
</script>