import type Quill from "quill";


class EditorPlugin {
    quill: Quill;
    options: any;
    constructor(quill: Quill, options: any) {
        this.quill = quill;
        this.options = options;
        this.init();
    }
    init() {
        console.log('init', this.options);
        this.addUndoRedo();
        this.setToolbar();
        this.setDefaultIcons();
    }

    addUndoRedo() {
        this.quill.keyboard.addBinding({
            key: 'z',
            shortKey: true,
            handler: () => {
                this.quill.history.undo();
            },
        });
        this.quill.keyboard.addBinding({
            key: 'y',
            shortKey: true,
            handler: () => {
                this.quill.history.redo();
            },
        });

    }

    setToolbar() {

        const toolbar = this.quill.getModule('toolbar') as any;
        console.log('toolbar', toolbar);
        if (toolbar) {
            toolbar.addHandler('generate', (e: any) => {
            });
            toolbar.addHandler('redo', (e: any) => {
                this.quill.history.redo();
            });
            toolbar.addHandler('undo', (e: any) => {
                console.log('undo', e);
                this.quill.history.undo();
            });
        }
        const undo_button = document.querySelector('.ql-undo');
        if (undo_button) {
            undo_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
    <path d="M3 8H15C18.3137 8 21 10.6863 21 14C21 17.3137 18.3137 20 15 20H11" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M7 4L5.8462 4.87652C3.94873 6.31801 3 7.03875 3 8C3 8.96125 3.94873 9.68199 5.8462 11.1235L7 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;
        }
        const redo_button = document.querySelector('.ql-redo');
        if (redo_button) {
            redo_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
    <path d="M21 8H9C5.68629 8 3 10.6863 3 14C3 17.3137 5.68629 20 9 20H13" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M17 4L18.1538 4.87652C20.0513 6.31801 21 7.03875 21 8C21 8.96125 20.0513 9.68199 18.1538 11.1235L17 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;
        }
        const clean_button = document.querySelector('.ql-clean');
        if (clean_button) {
            clean_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
    <path d="M21 3L13 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M9.44573 11.0854C6.96539 12.0368 4.98269 11.8736 3 11.0885C3.50059 17.531 6.50414 20.0089 10.5089 21C10.5089 21 13.5261 18.8664 13.961 13.8074C14.0081 13.2595 14.0317 12.9856 13.9178 12.6769C13.8038 12.3682 13.5802 12.1468 13.1329 11.704C12.3973 10.9757 12.0295 10.6116 11.5929 10.5204C11.1564 10.4293 10.5862 10.648 9.44573 11.0854Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M4.5 16.4464C4.5 16.4464 7 16.9286 9.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M8.5 7.25C8.5 7.94036 7.94036 8.5 7.25 8.5C6.55964 8.5 6 7.94036 6 7.25C6 6.55964 6.55964 6 7.25 6C7.94036 6 8.5 6.55964 8.5 7.25Z" stroke="currentColor" stroke-width="2"></path>
    <path d="M11 4V4.1" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;
        }
    }


    setDefaultIcons() {
        //@ts-ignore
        this.quill.clipboard.dangerouslyPasteHTML = (html: string) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            const imgs = div.querySelectorAll('img');
            imgs.forEach((img) => {
                img.setAttribute('src', img.getAttribute('data-src')!);
                img.removeAttribute('data-src');
            });
            this.quill.clipboard.dangerouslyPasteHTML(div.innerHTML);
        };
    }
}

export default EditorPlugin;