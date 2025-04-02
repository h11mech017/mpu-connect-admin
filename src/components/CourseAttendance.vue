<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">Course Attendance</h2>
            <div class="page-actions">
                <el-button type="primary" @click="addAttendance" class="button">Take Attendance
                    <el-icon class="el-icon--right">
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table v-if="attendanceRecords.length" :data="paginatedData"
                :default-sort="{ prop: 'Class Date', order: 'descending' }" class="table-container"
                :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600' }" border>
                <el-table-column prop="Section" label="Section"></el-table-column>
                <el-table-column prop="Class Date" label="Class Date" sortable>
                    <template #default="scope">
                        {{ formatTimestamp(scope.row['Class Date']) }}
                    </template>
                </el-table-column>
                <el-table-column prop="Updated At" label="Updated At" sortable>
                    <template #default="scope">
                        {{ formatTimestamp(scope.row['Updated At']) }}
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #default="scope">
                        <div class="actions">
                            <el-button type="primary" @click="editAttendance(scope.row.id)">Enter</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-else class="empty-state">
                <i class="el-icon-notebook-1 empty-icon"></i>
                <p class="empty-message">No attendance records available.</p>
            </div>
            
            <div v-if="attendanceRecords.length" class="pagination-container">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="attendanceRecords.length"
                    :page-size="pageSize"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, postData, putData } from '../controller'
import { ElButton, ElMessage, ElPagination } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import router from '../router'

const attendanceRecords = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const userStore = useUserStore();

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return attendanceRecords.value.slice(startIndex, endIndex)
})

onMounted(async () => {
    await fetchAttendanceRecords()
})

async function fetchAttendanceRecords() {
    try {
        const courseId = router.currentRoute.value.params.courseId
        const section = router.currentRoute.value.params.section
        if (!courseId) {
            throw new Error('Course ID is missing')
        }
        const response = await fetchData(`/user/courses/${courseId}/${section}/attendance`, userStore.token)
        if (response && response.data) {
            attendanceRecords.value = response.data
        } else {
            ElMessage.error('Failed to fetch attendance records')
        }
    } catch (error) {
        console.error('Failed to fetch attendance records:', error)
    }
}

async function addAttendance() {
    const courseId = router.currentRoute.value.params.courseId
    const section = router.currentRoute.value.params.section
    try {
        const response = await postData(`/user/courses/${courseId}/${section}/attendance/add`, userStore.token, {})
        if (response && response.data) {
            router.push({ name: 'AttendanceView', params: { courseId: courseId, section: section, attendanceId: response.data } })
        } else {
            ElMessage.error('Failed to create attendance record')
        }
    } catch (error) {
        console.error('Failed to create attendance record:', error)
    }
}

function formatTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
        return date.toLocaleString()
    }
    return "";
}

function editAttendance(attendanceId) {
    const courseId = router.currentRoute.value.params.courseId
    const section = router.currentRoute.value.params.section
    router.push({ name: 'AttendanceView', params: { courseId: courseId, section: section, attendanceId } })
}

function handleCurrentChange(page) {
    currentPage.value = page
}

</script>

<style scoped>
/* Page layout styles moved to global CSS in App.vue */

/* Table styles moved to global CSS in App.vue */

/* Empty state styles moved to global CSS in App.vue */

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 8px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.page-title {
    margin: 0;
}

.button {
    display: flex;
    align-items: center;
    gap: 8px;
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

.actions {
    display: flex;
    gap: 8px;
    justify-content: center;
}
</style>