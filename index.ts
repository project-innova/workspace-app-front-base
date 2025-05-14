import 'flatpickr/dist/flatpickr.css';
import './css/main.scss'
import type { App } from 'vue'
import BaseLayout from './layouts/BaseLayout.vue'
import { io } from 'socket.io-client';
import type { DefaultEventsMap, Socket } from 'socket.io';
import AppButton from './components/forms/AppButton.vue';
import TextField from './components/forms/TextField.vue';
import type { DgiwsFrontPlugin } from './types';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueAwesomePaginate from "vue-awesome-paginate";
import Toast from './utils/plugins/toast/index';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import Tooltip from 'primevue/tooltip';
export default {
    install(app: App, options: DgiwsFrontPlugin) {
        const pinia = createPinia();
        pinia.use(piniaPluginPersistedstate);

        app.use(pinia)
        app.use(VueAwesomePaginate);
        app.use(Toast);
        const MyPreset = definePreset(Aura, {
            semantic: {
                primary: {
                    100: '#FF8200',
                    200: '#FF8200',
                    300: '#FF8200',
                    400: '#FF8200',
                    500: '#FF8200',
                    600: '#FF8200',
                },
                secondary: '#f50057',
                accent: '#009688',
                neutral: '#333333',
            }
        });
        app.use(PrimeVue, {
            theme: {
                preset: MyPreset,
                options:{
                    darkModeSelector: '.dark-mode',
                }
            }
        });
        app.directive('tooltip', Tooltip);
        app.config.globalProperties.$modulesUrls = options.modulesUrls;
        app.config.globalProperties.$drawerPages = options.drawerPages??'*';
        app.component('BaseLayout', BaseLayout);
        window.$socket = io(options.modulesUrls.webSocket, {
            extraHeaders: {
                Authorization: `Bearer ${window.$userToken}`
            }
        }) as unknown as Socket<DefaultEventsMap, DefaultEventsMap>;

        window.$url = (path: string = '') => {
            return options.appUrl + path;
        }

        window.$modulesUrls = options.modulesUrls;
        window.$drawerPages = options.drawerPages??'*';
        app.component('AppButton', AppButton);
        app.component('TextField', TextField);
        app.config.globalProperties.$userToken = window.$userToken??'';
        app.config.globalProperties.$url = (path: string = '') => {
            return options.appUrl + path;
        };
        $socket.emit('connected')

    }
}
