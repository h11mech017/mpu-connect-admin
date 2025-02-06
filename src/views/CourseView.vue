<template>
    <div v-if="userStore.role === 'Teacher'">
        <CourseAnnouncements />
        <CourseFiles />
        <CourseAssignments />
        <CourseAttendance />
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import CourseFiles from '../components/CourseFiles.vue'
import CourseAssignments from '../components/CourseAssignments.vue'
import CourseAttendance from '../components/CourseAttendance.vue';
import CourseAnnouncements from '../components/CourseAnnouncements.vue';

const userStore = useUserStore()

</script>

<style scoped></style>