import type { App, Plugin } from 'vue';
import Toast from './Toast.vue'
interface ToastWidget {
  message: string;
  title?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  position?: ToastPostion;
  canClose?: boolean;
}

type ToastPostion = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"
const useToast = ($data: ToastWidget) => {
  const event = new CustomEvent('lvp-toast', {
    detail: {
      data: $data
    }
  });
  document.dispatchEvent(event);
}

interface ToastPluginOptions {
  position: ToastPostion
  duration: number;
}


const plugin: Plugin = {
  install(app: App, options: ToastPluginOptions = { position: 'top-right', duration: 3000 }) {
    app.component('AppToastProvider', Toast);
    const _useToast = ($data: ToastWidget) => {
      const event = new CustomEvent('lvp-toast', {
        detail: {
          data: { ...$data, position: options.position, duration: options.duration },
        }
      });
      document.dispatchEvent(event);
    }
    window.$useToast = ($data: ToastWidget) => {
      _useToast($data)
    }
    app.config.globalProperties.$useToast = ($data: ToastWidget) => {
      _useToast($data)
    }
    app.provide('$useToast', ($data: ToastWidget) => {
      _useToast($data)
    });
  },
};

export default plugin;
export type { ToastPostion, ToastWidget }
export { useToast }
