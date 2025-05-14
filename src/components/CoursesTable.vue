<template>
    <div class="page-container">
        <div class="page-title-container">
            <h2 class="page-title">Courses</h2>
        </div>
        <div class="table-wrapper">
            <el-table :data="paginatedData" @row-click="handleRowClick" class="table-container"
                :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600' }" border
                style="width: 100%" :fit="true" size="small">
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
            <div v-if="courses.data && courses.data.length > 0" class="pagination-container">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="courses.data ? courses.data.length : 0"
                    :page-size="pageSize"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData } from '../controller'
import router from '../router'
import { useCourseStore } from '../stores/courseStore'
import { ElPagination } from 'element-plus'

const courses = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const userStore = useUserStore()
const courseStore = useCourseStore()

const paginatedData = computed(() => {
    if (!courses.value.data || courses.value.data.length === 0) {
        return []
    }
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return courses.value.data.slice(startIndex, endIndex)
})


onMounted(async () => {
    courses.value = await fetchData('/user/courses', userStore.token)
})

async function handleRowClick(row) {
    courseStore.setCourseId(row.id)
    courseStore.setSection(row['Section'])
    router.push({ name: 'AnnouncementsView', params: { courseId: row.id, section: row['Section'] } })
}

function handleCurrentChange(page) {
    currentPage.value = page
}

</script>

<style scoped>
.page-container {
    max-width: 1200px;
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 80vh;
}

.empty-icon {
    font-size: 48px;
    color: #c0c4cc;
    margin-bottom: 16px;
}

.empty-message {
    text-align: left;
    font-size: 16px;
    color: #909399;
    margin-bottom: 24px;
}

.table-wrapper {
    width: 80%;
    align-self: flex-start;
}
</style>