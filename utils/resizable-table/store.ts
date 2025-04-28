import { defineStore } from "pinia";
import { ref } from "vue";
export const useResizableTableStore = defineStore('ResizableTable', () => {
    const columnsSizes = ref<{[k:string]:number}>({

    });
    const setColumSIze = (table_id:string,column:string,size:number)=>{
        if(!columnsSizes.value) columnsSizes.value = {};
        if(!columnsSizes.value[table_id+'-'+column]){
            columnsSizes.value[table_id+'-'+column] = size;
            return;
        };
        columnsSizes.value[table_id+'-'+column] = size;
    }
   const  getColumnSize= (table_id:string,column:string,defaultSize:number)=>{
        if(!columnsSizes.value) columnsSizes.value = {};
        if(!columnsSizes.value[table_id+'-'+column]){
            columnsSizes.value[table_id+'-'+column] = defaultSize;
            return defaultSize;
        };
        return columnsSizes.value[table_id+'-'+column];
    }
    return {
        setColumSIze,
        getColumnSize,
        columnsSizes,
    }

},{
    persist:{
        pick:['columnsSizes']
    }
})
