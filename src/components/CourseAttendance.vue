<template>
    <div>
        <h2>Course Attendance</h2>
        <el-button type="primary" @click="addAttendance">Take Attendance
            <el-icon class="el-icon--right">
                <Plus />
            </el-icon>
        </el-button>
        <el-table :data="attendanceRecords"
        :default-sort="{ prop: 'Class Date', order: 'descending' }">
            <el-table-column prop="Section" label="Section" width="100"></el-table-column>
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
            <el-table-column width="150">
                <template #default="scope">
                    <div class="actions">
                        <el-button type="primary" @click="editAttendance(scope.row.id)">Enter</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
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

<style scoped></style>