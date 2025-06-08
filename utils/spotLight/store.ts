import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { HTTP } from "../http";
import { MainModuleUrl } from "@/env";
export const useSpotLightStore = defineStore('spotLightStore', () => {
    const show = ref(false)
    const searchIng = ref(false)

    const toggShow = () => {
        show.value = !show.value
    }
    const pagination = ref({
        page: 1,
        last_page: 1,
        perpage: 20,
        total_page: 1,
        total_items: 1,
        from: 1,
        to: 1,
        next_page: null,
        prev_page: null
    })
    const searchQuery = ref<string>('')
    const resultsItems = ref<any[]>([])
    const results = ref<Record<string, any>>({})

    // const lastSearch = ref([])
    const availableGroups = computed(() => Object.keys(results))


    // const searchHistory = ref<string[]>([])

    var _debounce: any = null;

    const search = (query: string, tags: string[] = []) => {
        console.log(tags);
        if (_debounce) clearTimeout(_debounce);
        _debounce = setTimeout(() => {
            execSearch(query);
        }, 500);
    }

    const execSearch = async (query: string) => {
        searchIng.value = true;
        const queryString = new URLSearchParams();
        queryString.set('query', query);
        const rst = await HTTP.get(MainModuleUrl + '/api/search?' + queryString.toString())
        resultsItems.value = rst.data.items;
        if (rst.data.items.length == 0) {
            results.value = {}
        } else {
            const vl = groupBy(rst.data.items, 'type');
            results.value = vl;
        }
        pagination.value = rst.data.pagination;
        searchIng.value = false;

    }

    watch(searchQuery, (val) => {
        search(val)
    })

    const selectedIndex = ref<number | null>(null)
    const navigationItem = ref('')


    // const addSearchHistory = (query: string) => {

    // }

    // const serach_value = ref('')
    // const clearSearch = () => {
    //     lastSearch.value = []
    // }
    function groupBy(array: any[], key: string): any[] {
        // On utilise la méthode 'reduce' pour itérer sur le tableau et construire l'objet groupé.
        return array.reduce((accumulator, currentItem, index): any[] => {
            // On récupère la valeur de la clé pour l'élément courant.
            // Par exemple, si key est 'category' et currentItem est { name: 'Pomme', category: 'Fruit' },
            // groupKey sera 'Fruit'.
            const groupKey = currentItem[key];

            // Si cette clé n'existe pas encore dans notre accumulateur (l'objet final),
            // on l'initialise avec un tableau vide.
            if (!accumulator[groupKey]) {
                accumulator[groupKey] = [];
            }

            // On ajoute l'élément courant au tableau correspondant à sa clé de groupe.
            accumulator[groupKey].push({ ...currentItem, index });

            // On retourne l'accumulateur pour le prochain tour de boucle.
            return accumulator;
        }, {}); // L'accumulateur commence comme un objet vide.
    }

    const paginate = async () => {
        searchIng.value = true;

        const queryString = new URLSearchParams();
        queryString.set('query', searchQuery.value);
        queryString.set('page', (pagination.value.page + 1).toString());
        // queryString.set('types[',query);
        const rst = await HTTP.get(MainModuleUrl + '/api/search?' + queryString.toString)
        resultsItems.value = rst.data.items;
        results.value = groupBy(rst.data.items, 'type');
        pagination.value = rst.data.pagination;
        searchIng.value = false;

    }

    return {
        toggShow,
        show,
        results,
        pagination,
        searchQuery,
        paginate,
        availableGroups,
        selectedIndex,
        resultsItems,
        searchIng,
        search
    }

})
