<template>
    <div v-if="userStore.role === 'Teacher'">
        <CourseFiles />
        <CourseAssignments />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData } from '../controller'
import CourseFiles from '../components/CourseFiles.vue'
import router from '../router'
import CourseAssignments from '../components/CourseAssignments.vue'

const userStore = useUserStore()

</script>

<style scoped></style>