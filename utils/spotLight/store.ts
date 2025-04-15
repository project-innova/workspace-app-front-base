import { defineStore } from "pinia";
import { ref } from "vue";
export const useSpotLightStore = defineStore('spotLightStore', () => {
    const show = ref(false)

    const toggShow = () => {
        show.value = !show.value
    }
    const results = ref<any[]>([
        {
            type: 'file',
            results: [
                {
                    name: 'file.pdf',
                    date: '23/12/2024 12:00',
                    type: 'file',
                    url: '/',
                    downloadLink: '/',
                }, {
                    name: 'file.pdf',
                    date: '23/12/2024 12:00',
                    type: 'file',
                    url: '/',
                    downloadLink: '/',
                }, {
                    name: 'file.pdf',
                    date: '23/12/2024 12:00',
                    type: 'file',
                    url: '/',
                    downloadLink: '/',
                }, {
                    name: 'file.pdf',
                    date: '23/12/2024 12:00',
                    type: 'file',
                    url: '/',
                    downloadLink: '/',
                }, {
                    name: 'file.pdf',
                    date: '23/12/2024 12:00',
                    type: 'file',
                    url: '/',
                    downloadLink: '/',
                }, {
                    name: 'file.pdf',
                    date: '23/12/2024 12:00',
                    type: 'file',
                    url: '/',
                    downloadLink: '/',
                }, {
                    name: 'file.pdf',
                    date: '23/12/2024 12:00',
                    type: 'file',
                    url: '/',
                    downloadLink: '/',
                }, {
                    name: 'file.pdf',
                    date: '23/12/2024 12:00',
                    type: 'file',
                    url: '/',
                    downloadLink: '/',
                },
            ],
        },
        {
            type: 'folder',
            results: [
                {
                    name: 'folder',
                    date: '23/12/2024 12:00',
                    type: 'folder',
                    url: '/',
                }, {
                    name: 'folder',
                    date: '23/12/2024 12:00',
                    type: 'folder',
                    url: '/',
                }, {
                    name: 'folder',
                    date: '23/12/2024 12:00',
                    type: 'folder',
                    url: '/',
                }, {
                    name: 'folder',
                    date: '23/12/2024 12:00',
                    type: 'folder',
                    url: '/',
                },
            ],
        },
        {
            type: 'user',
            results: [
                {
                    name: 'user',
                    role: 'agent',
                    matricule: 'JH98JK98',
                    direction: 'DOA',
                    id: 'JH98JK98',
                },
            ],
        }, {
            type: 'team',
            results: [
                {
                    name: 'Team 1',
                    type: 'private',
                },
            ],
        }, {
            type: 'message',
            results: [
                {
                    message: 'Message 1',
                    date: '23/12/2024 12:00',
                    sender: {
                        name: 'John Doe',
                        role: 'agent',
                        matricule: 'JH98JK98',
                        direction: 'DOA',
                        id: 'JH98JK98',
                    },
                },
            ],
        },
    ])

    // const lastSearch = ref([])



    // const searchHistory = ref<string[]>([])

    var _debounce: any = null;

    const search = (query: string, tags: string[] = []) => {
        console.log(tags);
        if (_debounce) clearTimeout(_debounce);
        _debounce = setTimeout(() => {
            execSearch(query);
        }, 300);
    }

    const execSearch = (query: string) => {
        console.log(query)
    }

    // const addSearchHistory = (query: string) => {

    // }

    // const serach_value = ref('')
    // const clearSearch = () => {
    //     lastSearch.value = []
    // }

    return {
        toggShow,
        show,
        results,
        search
    }

})
