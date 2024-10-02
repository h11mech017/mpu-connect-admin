import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useItemStore = defineStore("item", () => {
    const isAdding = ref(false);
    const formData = ref();
    const initialFormState = ref();
    const categories = ref([]);
    const locations = ref([]);

    const setIsAdding = (value) => {
        isAdding.value = value;
    }

    const setFormData = (data) => {
        formData.value = data;
    }

    const setInitialFormState = (data) => {
        initialFormState.value = data;
    }

    const setCategories = (data) => {
        categories.value = data;
    }

    const setLocations = (data) => {
        locations.value = data;
    }

    return {
        formData,
        initialFormState,
        isAdding,
        categories,
        locations,
        setFormData,
        setInitialFormState,
        setIsAdding,
        setCategories,
        setLocations
    }
})