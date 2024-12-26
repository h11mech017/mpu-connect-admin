import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", () => {
    const token = ref(null)
    const role = ref(null)

    const setToken = (value) => {
        token.value = value
    }

    const setRole = (value) => {
        role.value = value
    }

    return {
        token,
        setToken,
        role,
        setRole,
    }
})