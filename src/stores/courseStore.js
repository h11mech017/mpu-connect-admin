import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCourseStore = defineStore("course", () => {
    const courseId = ref('')
    const section = ref('')

    const setCourseId = (value) => {
        courseId.value = value
    }

    const setSection = (value) => {
        section.value = value
    }

    return {
        courseId,
        section,
        setCourseId,
        setSection
    }
})