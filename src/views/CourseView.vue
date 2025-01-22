<template>
    <div v-if="userStore.role === 'Teacher'">
        <CourseFiles />
        <CourseAssignments />
        <CourseAttendance />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import CourseFiles from '../components/CourseFiles.vue'
import CourseAssignments from '../components/CourseAssignments.vue'
import CourseAttendance from '../components/CourseAttendance.vue';

const userStore = useUserStore()

</script>

<style scoped></style>