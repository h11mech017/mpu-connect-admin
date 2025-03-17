import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAnnouncementStore = defineStore("announcement", () => {
    const announcementId = ref('')
    const formData = ref()
    const isAdding = ref(false)
    const isEditing = ref(false)

    const formInitialState = ref({
        'Title': '',
        'Content': '',
        'is Test': '',
        'Test Date': '',
        'Course': '',
    })

    const setAnnouncementId = (id) => {
        announcementId.value = id
    }

    const setFormData = (data) => {
        formData.value = data
    }

    const setIsAdding = (value) => {
        isAdding.value = value
    }

    const setIsEditing = (value) => {
        isEditing.value = value
    }

    return {
        announcementId,
        formData,
        formInitialState,
        isAdding,
        isEditing,
        setAnnouncementId,
        setFormData,
        setIsAdding,
        setIsEditing
    }
})