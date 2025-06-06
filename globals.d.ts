import AppButton from '@/appBase/components/forms/AppButton.vue'
import TextField from '@/appBase/components/forms/TextField.vue'
import type appContants from './utils/appContants'
import type { useToast } from './utils/plugins/toast'
import { io } from 'socket.io-client';
import type { DefaultEventsMap, Socket } from 'socket.io';
import type { DgiwsModules } from './plugin/types';
import PrimeBtn from 'primevue/button';
import PrimeTextInput from 'primevue/inputtext';
import PrimeMenu from 'primevue/menu';
import PrimeSelect from 'primevue/select';
import PrimeMultiSelect from 'primevue/multiselect';
import PrimeBtn from 'primevue/button';
import Primecard from 'primevue/card';
export { }
declare global {
    interface Window {
        $useToast: typeof useToast
        $socket: Socket
        $userToken: String
        $modulesUrls: DgiwsModules
        $drawerPages: string[] | '*' | '!*'
        $url: (path: string) => string
    }
    const $useToast: typeof useToast
    const $socket: Socket
    const $modulesUrls: DgiwsModules
    const $url: (path: string) => string

}

declare module 'vue' {
    export interface GlobalComponents {
        AppButton: typeof AppButton,
        TextField: typeof TextField,
        Primecard: typeof Primecard,
        PrimeBtn: typeof PrimeBtn,
        PrimeTextInput: typeof PrimeTextInput,
        PrimeMenu: typeof PrimeMenu,
        PrimeSelect: typeof PrimeSelect,
        PrimeMultiSelect: typeof PrimeMultiSelect,
    }
    export interface ComponentCustomProperties {
        $appContants: typeof appContants,
        $useToast: typeof useToast
        $userToken: String
        $router: any
        $route: {
            params: { [k: string]: any };
            meta: { [k: string]: any };
            name?: string;
        }
        $userTrouteoken: String
        $modulesUrls: DgiwsModules
        $drawerPages: string[] | '*' | '!*'

        $url: (path: string) => string
    }
}
