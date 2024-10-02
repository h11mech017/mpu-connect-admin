import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", () => {
    const token = ref('');

    const setToken = (value) => {
        token.value = value;
    }

    return {
        token,
        setToken,
    }
})