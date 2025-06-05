import './css/main.css'
import './css/main.scss'
import 'flatpickr/dist/flatpickr.css';
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
import PrimeCard from 'primevue/card';
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
                    '50': '#fef8ee',
                    '100': '#fdefd7',
                    '200': '#fbdaad',
                    '300': '#f8c079',
                    '400': '#f39b44',
                    '500': '#f07e1f',
                    '600': '#d96014',
                    '700': '#bb4b13',
                    '800': '#953c17',
                    '900': '#783316',
                    '950': '#411709',
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
        app.component('PrimeCard', PrimeCard);
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
