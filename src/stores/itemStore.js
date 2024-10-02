import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useItemStore = defineStore("item", () => {
    const isAdding = ref(false);
    const isClaiming = ref(false);
    const itemId = ref('');
    const formData = ref();
    const categories = ref([]);
    const locations = ref([]);
    const subCategories = ref([]);

    const setIsAdding = (value) => {
        isAdding.value = value;
    }

    const setIsClaiming = (value) => {
        isClaiming.value = value;
    }

    const setItemId = (id) => {
        itemId.value = id;
    }

    const setFormData = (data) => {
        formData.value = data;
    }

    const setCategories = (data) => {
        categories.value = data;
    }

    const setSubCategories = () => {
        const selectedCategory = categories.value.find(cat => cat.Name === formData.value['Category'])
        subCategories.value = selectedCategory ? selectedCategory['Sub Categories'] : []
        formData.value['Description'] = '';
    }

    const setLocations = (data) => {
        locations.value = data;
    }

    return {
        formData,
        itemId,
        isAdding,
        isClaiming,
        categories,
        subCategories,
        locations,
        setFormData,
        setItemId,
        setIsAdding,
        setIsClaiming,
        setCategories,
        setSubCategories,
        setLocations
    }
})