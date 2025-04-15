import AppButton from '@/components/forms/AppButton.vue'
import TextField from '@/components/forms/TextField.vue'
import type appContants from './utils/appContants'
import type { useToast } from './utils/plugins/toast'
import { io } from 'socket.io-client';
import type { DefaultEventsMap, Socket } from 'socket.io';
import type { DgiwsModules } from './plugin/types';

export { }
declare global {
    interface Window {
        $useToast: typeof useToast
        $socket: Socket
        $userToken: String
        $modulesUrls: DgiwsModules
        $url: (path: string) => string
    }
    const $useToast: typeof useToast
    const $socket: Socket
    const $url: (path: string) => string

}

declare module 'vue' {
    export interface GlobalComponents {
        AppButton: typeof AppButton,
        TextField: typeof TextField
    }
    export interface ComponentCustomProperties {
        $appContants: typeof appContants,
        $useToast: typeof useToast
        $userToken: String
        $modulesUrls: DgiwsModules
        $url: (path: string) => string
    }
}
