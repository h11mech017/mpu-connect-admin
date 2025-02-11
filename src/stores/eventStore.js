import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useEventStore = defineStore("event", () => {
    const formData = ref({})

    const isAdding = ref(false)
    const isEditing = ref(false)

    const formInitialState = ref({
        'id': '',
        'Headline': '',
        'Event Start Date': '',
        'Event End Date': '',
        'Post Date': '',
        'Name of Event': '',
        'Organization': '',
        'Introduction': '',
        'Time': '',
        'Venue': '',
        'Audience': '',
    })

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
        formData,
        formInitialState,
        isAdding,
        isEditing,
        setFormData,
        setIsAdding,
        setIsEditing
    }
})