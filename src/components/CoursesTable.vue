<template>
    <div class="page-container">
        <div class="page-title-container">
            <h2 class="page-title">Courses</h2>
        </div>
        <div class="table-wrapper">
            <el-table 
                :data="courses.data" 
                @row-click="handleRowClick" 
                class="table-container"
                :header-cell-style="{backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600'}"
                border
                style="width: 100%"
                :fit="true"
                size="small"
            >
            <el-table-column prop="Course['Course Code']" label="Course Code" />
            <el-table-column prop="Course['Course Name']" label="Course Name" />
            <el-table-column prop="Section" label="Section" />
            <el-table-column prop="Semester" label="Semester" />
            <el-table-column prop="Academic Year" label="Accademic Year" />
            </el-table>
            <div v-if="!courses.data || courses.data.length === 0" class="empty-state">
                <i class="el-icon-notebook-1 empty-icon"></i>
                <p class="empty-message">No courses available.</p>
            </div>
        </div>
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
.page-container {
    padding: 0 0 32px;
    width: 100%;
    box-sizing: border-box;
    max-width: 1200px;
    margin: 0 auto;
    background-color: var(--card-bg);
}

.page-title-container {
    margin-bottom: 8px;
    padding: 0 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 12px;
}

.page-actions-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    padding: 0 8px;
}

.page-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
    display: flex;
    align-items: center;
}

.table-wrapper {
    margin-bottom: 24px;
    width: 100%;
    overflow-x: auto;
    background-color: var(--card-bg);
}

.table-container {
    border-radius: var(--border-radius-md);
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    background-color: var(--card-bg);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
}

.empty-icon {
    font-size: 48px;
    color: #c0c4cc;
    margin-bottom: 16px;
}

.empty-message {
    text-align: center;
    font-size: 16px;
    color: #909399;
    margin-bottom: 24px;
}
</style>