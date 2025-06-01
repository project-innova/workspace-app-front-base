<template>
    <div id="ql-editor">

    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import Quill from 'quill';
import MagicUrl from 'quill-magic-url'
import { ref } from 'vue';
const props = defineProps<{
    modules?: any;
    placeholder?: string;
    modelValue?: string;
    disabled?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
Quill.register('modules/magicUrl', MagicUrl)
const quill = ref<Quill | null>(null);

onMounted(() => {
    try {
        quill.value = new Quill('#ql-editor', {
            modules: {
                toolbar: [
                    ['undo', 'redo'],
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    // ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, {
                        align: []
                    }],
                    // ['image', 'video'],
                    ['clean']
                ],
                magicUrl: {
                    // Regex used to check URLs during typing
                    urlRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)|(tel:[\S]+)/g,
                    // Regex used to check URLs on paste
                    globalRegularExpression: /(https?:\/\/|www\.|tel:)[\S]+/g,
                },
                momoledev: {
                    name: 'momoledev',
                    module: Quill.import('modules/momoledev'),
                    options: {
                        apiKey: 'VOTRE_CLE_API_OPENAI',
                    },
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