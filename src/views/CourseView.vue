<template>
    <div v-if="userStore.role === 'Teacher'">
        <CourseFiles />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData } from '../controller'
import CourseFiles from '../components/CourseFiles.vue'
import router from '../router'

const userStore = useUserStore()

</script>

<style scoped></style>