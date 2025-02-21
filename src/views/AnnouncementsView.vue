<template>
    <div v-if="userStore.role === 'Teacher'">
        <CourseAnnouncements />

    </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import CourseAnnouncements from '../components/CourseAnnouncements.vue';

const userStore = useUserStore()

</script>

<style scoped></style>