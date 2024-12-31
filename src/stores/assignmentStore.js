import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAssignmentStore = defineStore("assignment", () => {
    const submissionId = ref(null)

    const setSubmissionId = (value) => {
        token.value = value
    }

    return {
        submissionId,
        setSubmissionId,
    }
})