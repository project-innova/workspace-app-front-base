import { defineStore } from "pinia";
import { ref } from "vue";

export const useSideBar = defineStore('sidebarStore', () => {
    const show = ref(false)
    const sticky = ref(false)

    const toggleShow = () => {
        show.value = !show.value
    }
    const toggleSticky = () => {
        sticky.value = !sticky.value
    }

    return {
        show,
        sticky,
        toggleShow,
        toggleSticky
    }
}, {
    persist: true
})
