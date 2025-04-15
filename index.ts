import 'flatpickr/dist/flatpickr.css';
import './css/main.scss'
import type { App } from 'vue'
import BaseLayout from './layouts/BaseLayout.vue'
import { io } from 'socket.io-client';
import type { DefaultEventsMap, Socket } from 'socket.io';
import AppButton from './components/forms/AppButton.vue';
import TextField from './components/forms/TextField.vue';
import type { DgiwsFrontPlugin } from './plugin/types';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueAwesomePaginate from "vue-awesome-paginate";
import Toast from './utils/plugins/toast/index';

export default {
    install(app: App, options: DgiwsFrontPlugin) {
        const pinia = createPinia();

        pinia.use(piniaPluginPersistedstate);

        app.use(pinia)
        app.use(VueAwesomePaginate);
        app.use(Toast);
        app.config.globalProperties.$modulesUrls = options.modulesUrls;
        app.component('BaseLayout', BaseLayout);
        window.$socket = io(options.modulesUrls.webSocket, {
            extraHeaders: {
                Authorization: `Bearer ${window.$userToken}`
            }
        }) as unknown as Socket<DefaultEventsMap, DefaultEventsMap>;
        window.$url = (path: string = '') => {
            return options.appUrl + path;
        }
        app.component('AppButton', AppButton);
        app.component('TextField', TextField);
        app.config.globalProperties.$userToken = window.$userToken;
        app.config.globalProperties.$url = (path: string = '') => {
            return options.appUrl + path;
        };
        $socket.emit('connected')

    }
}
