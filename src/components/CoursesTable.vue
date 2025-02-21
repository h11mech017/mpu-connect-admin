<template>
    <div>
        <h2>Courses</h2>
        <el-table :data="courses.data" @row-click="handleRowClick" class="table-container">
            <el-table-column prop="Course['Course Code']" label="Course Code" width="100" />
            <el-table-column prop="Course['Course Name']" label="Course Name" width="180" />
            <el-table-column prop="Section" label="Section" width="90" />
            <el-table-column prop="Semester" label="Semester" width="90" />
            <el-table-column prop="Academic Year" label="Accademic Year" width="150" />
        </el-table>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData } from '../controller'
import router from '../router'
import { useCourseStore } from '../stores/courseStore'

const courses = ref([])
const userStore = useUserStore()
const courseStore = useCourseStore()


onMounted(async () => {
    courses.value = await fetchData('/user/courses', userStore.token)
})

async function handleRowClick(row) {
    courseStore.setCourseId(row.id)
    courseStore.setSection(row['Section'])
    router.push({ name: 'AnnouncementsView', params: { courseId: row.id, section: row['Section'] } })
}



</script>

<style scoped>

</style>