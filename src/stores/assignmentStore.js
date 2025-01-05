import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAssignmentStore = defineStore("assignment", () => {
    const formData = ref()
    const assignmentId = ref('')
    const isAdding = ref(false)
    const isEditing = ref(false)

    const formInitialState = ref({
        courseId: '',
        'Title': '',
        'Detail': '',
        'Available Date': '',
        'Due Date': '',
        'Submission Deadline': '',
        'Highest Score': '',
        'Visible': false,
    })

    const setFormData = (data) => {
        formData.value = data
    }

    const setAssignmentId = (id) => {
        assignmentId.value = id
    }

    const setIsAdding = (value) => {
        isAdding.value = value
    }

    const setIsEditing = (value) => {
        isEditing.value = value
    }

    return {
        formData,
        assignmentId,
        formInitialState,
        isAdding,
        isEditing,
        setFormData,
        setAssignmentId,
        setIsAdding,
        setIsEditing
    }
})