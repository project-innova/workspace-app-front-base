import 'flatpickr/dist/flatpickr.css';
import './css/main.scss'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
import PrimeBtn from 'primevue/button';
import PrimeTextInput from 'primevue/inputtext';
import PrimeMenu from 'primevue/menu';
import PrimeSelect from 'primevue/select';
import PrimeMultiSelect from 'primevue/multiselect';

import { useAuthStore } from './stores/auth';
export default {
    install(app: App, options: DgiwsFrontPlugin) {
        const pinia = createPinia();
        pinia.use(piniaPluginPersistedstate);
        app.use(pinia)
        app.use(VueAwesomePaginate);
        app.use(Toast);
        const authStore = useAuthStore();
        const MyPreset = definePreset(Aura, {
            semantic: {

                primary: {
                    '50': '#fffaec',
                    '100': '#fff4d3',
                    '200': '#ffe6a5',
                    '300': '#ffd26d',
                    '400': '#ffb332',
                    '500': '#ff9a0a',
                    '600': '#ff8200',
                    '700': '#cc5f02',
                    '800': '#a1490b',
                    '900': '#823e0c',
                    '950': '#461d04',
                },
                secondary: {
                    '50': '#f5f7f8',
                    '100': '#ecf1f3',
                    '200': '#dde4e8',
                    '300': '#c7d3da',
                    '400': '#b0bec9',
                    '500': '#9baab9',
                    '600': '#8493a7',
                    '700': '#6c798b',
                    '800': '#5d6776',
                    '900': '#4f5760',
                    '950': '#2e3338',
                },

                // secondary: '#f50057',
                // accent: '#009688',
                // neutral: '#333333',
            }
        });
        app.use(PrimeVue, {
            theme: {
                preset: MyPreset,
                options: {
                    darkModeSelector: '.dark-mode',
                }
            }
        });
        app.component('PrimeBtn', PrimeBtn);
        app.component('PrimeMenu', PrimeMenu);
        app.component('PrimeTextInput', PrimeTextInput);
        app.component('PrimeSelect', PrimeSelect);
        app.component('PrimeMultiSelect', PrimeMultiSelect);
        app.directive('tooltip', Tooltip);
        app.config.globalProperties.$modulesUrls = options.modulesUrls;
        app.config.globalProperties.$drawerPages = options.drawerPages ?? '*';
        app.component('BaseLayout', BaseLayout);

        window.$socket = io(options.modulesUrls.webSocket, {
            extraHeaders: {
                Authorization: `Bearer ${authStore.accessToken}`
            }
        }) as unknown as Socket<DefaultEventsMap, DefaultEventsMap>;

        window.$url = (path: string = '') => {
            return options.appUrl + path;
        }

        window.$modulesUrls = options.modulesUrls;
        window.$drawerPages = options.drawerPages ?? '*';
        app.component('AppButton', AppButton);
        app.component('TextField', TextField);
        app.config.globalProperties.$userToken = authStore.accessToken ?? '';
        app.config.globalProperties.$url = (path: string = '') => {
            return options.appUrl + path;
        };
        $socket.emit('connected')

    }
}
