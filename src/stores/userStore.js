import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", () => {
    // Initialize token from localStorage if available
    const token = ref(localStorage.getItem('userToken') || null)
    const role = ref(localStorage.getItem('userRole') || null)

    const setToken = (value) => {
        token.value = value
        // Store token in localStorage
        if (value) {
            localStorage.setItem('userToken', value)
        } else {
            localStorage.removeItem('userToken')
        }
    }

    const setRole = (value) => {
        role.value = value
        // Store role in localStorage
        if (value) {
            localStorage.setItem('userRole', value)
        } else {
            localStorage.removeItem('userRole')
        }
    }

    const clearUserData = () => {
        token.value = null
        role.value = null
        localStorage.removeItem('userToken')
        localStorage.removeItem('userRole')
    }

    return {
        token,
        setToken,
        role,
        setRole,
        clearUserData
    }
})