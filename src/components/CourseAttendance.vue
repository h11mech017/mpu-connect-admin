<template>
    <div class="page-container">
        <div class="page-title-container">
            <h2 class="page-title">Course Attendance</h2>
        </div>
        <div class="page-actions-container">
            <div class="page-actions">
                <el-button type="primary" @click="addAttendance" class="button">Take Attendance
                    <el-icon class="el-icon--right">
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
        </div>
        <div class="table-wrapper">
        <el-table 
            v-if="attendanceRecords.length" 
            :data="attendanceRecords"
            :default-sort="{ prop: 'Class Date', order: 'descending' }" 
            class="table-container"
            :header-cell-style="{backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600'}"
            border
            style="width: 100%"
            :fit="true"
            size="small">
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
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, postData, putData } from '../controller'
import { ElButton, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import router from '../router'

const attendanceRecords = ref([])
const userStore = useUserStore();

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


</script>

<style scoped>
.page-container {
    padding: 0 0 32px;
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
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

.page-actions {
    display: flex;
    gap: 12px;
}

.button {
    display: flex;
    align-items: center;
    gap: 8px;
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

.actions {
    display: flex;
    justify-content: center;
}
</style>