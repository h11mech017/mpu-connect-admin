<template>
    <div class="page-content">
        <NavigationBar role="Teacher" />
        <div v-if="attendanceDetail">
            <h1>{{ formatTimestamp(attendanceDetail['Class Date']) }}</h1>
            <el-button type="primary" @click="showQrCode">QR Code</el-button>
            <el-button type="info" @click="fetchAttendanceDetail">Refresh
                <el-icon class="el-icon--right">
                    <RefreshRight />
                </el-icon>
            </el-button>
            <section>{{ attendanceCount }} / {{ attendanceDetail.Students.length }} students taken</section>
            <el-dialog v-model="showQr" title="Attendance QR Code" :style="{ height: '400px' }" width="50%">
                <div class="qr-code-container">
                    <qrcode-svg :value="qrCodeValue" level="H" size="90%" />
                </div>
            </el-dialog>
            <el-table :data="paginatedData" class="table-container">
                <el-table-column prop="Student ID" label="Student ID"></el-table-column>
                <el-table-column prop="Name" label="Student Name"></el-table-column>
                <el-table-column prop="Status" label="Status" width="100"></el-table-column>
                <el-table-column label="Actions" width="250">
                    <template #default="scope">
                        <el-button type="success"
                            @click="updateAttendanceStatus(scope.row.Student, 'Present')">Take</el-button>
                        <el-button type="danger"
                            @click="updateAttendanceStatus(scope.row.Student, 'Absent')">Absent</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div v-if="attendanceDetail && attendanceDetail.Students && attendanceDetail.Students.length"
                class="pagination-container">
                <el-pagination background layout="prev, pager, next" :total="attendanceDetail.Students.length"
                    :page-size="pageSize" @current-change="handleCurrentChange" :current-page="currentPage" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, putData } from '../controller'
import { ElButton, ElMessage, ElPagination } from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import router from '../router'
import { QrcodeSvg } from 'qrcode.vue'
import NavigationBar from '../components/NavigationBar.vue'

const attendanceDetail = ref()
const attendanceCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const userStore = useUserStore()
const qrCodeValue = ref('')
const showQr = ref(false)

const paginatedData = computed(() => {
    if (!attendanceDetail.value || !attendanceDetail.value.Students) {
        return []
    }
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return attendanceDetail.value.Students.slice(startIndex, endIndex)
})

onMounted(async () => {
    await fetchAttendanceDetail()
    startQrCodeRefresh()
})

onUnmounted(() => {
    stopQrCodeRefresh()
})

async function fetchAttendanceDetail() {
    try {
        const courseId = router.currentRoute.value.params.courseId
        const section = router.currentRoute.value.params.section
        const attendanceId = router.currentRoute.value.params.attendanceId
        if (!courseId) {
            throw new Error('Course ID is missing')
        }
        const response = await fetchData(`/user/courses/${courseId}/${section}/attendance/${attendanceId}`, userStore.token)
        if (response && response.data) {
            attendanceDetail.value = response.data

            attendanceCount.value = 0
            attendanceDetail.value.Students.forEach(student => {
                if (student.Status === 'Present') {
                    attendanceCount.value++
                }
            })

        } else {
            ElMessage.error('Failed to fetch attendance records')
        }
    } catch (error) {
        console.error('Failed to fetch attendance records:', error)
    }
}

async function updateAttendanceStatus(studentUid, status) {
    try {
        const courseId = router.currentRoute.value.params.courseId
        const section = router.currentRoute.value.params.section
        const attendanceId = router.currentRoute.value.params.attendanceId

        const response = await putData(`/user/courses/${courseId}/${section}/attendance/${attendanceId}/update`, userStore.token, studentUid, status)
        if (response) {
            await fetchAttendanceDetail()
            ElMessage.success('Attendance status updated')
        } else {
            ElMessage.error('Failed to take attendance')
        }
    } catch (error) {
        console.error('Failed to update attendance status:', error)
    }
}

function showQrCode() {
    showQr.value = !showQr.value
}

async function generateQrCodeValue() {
    const apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}
        /user/courses/${router.currentRoute.value.params.courseId}
        /${router.currentRoute.value.params.section}/attendance
        /${router.currentRoute.value.params.attendanceId}/checkin`
    const timestamp = Date.now()
    const data = new TextEncoder().encode(apiEndpoint + timestamp)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    qrCodeValue.value = `${apiEndpoint}?hash=${hashHex}&timestamp=${timestamp}`
}

let qrCodeInterval

function startQrCodeRefresh() {
    generateQrCodeValue()
    qrCodeInterval = setInterval(generateQrCodeValue, 5000)
}

function stopQrCodeRefresh() {
    clearInterval(qrCodeInterval)
}

function formatTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
        return date.toLocaleDateString()
    }
    return "";
}

function handleCurrentChange(page) {
    currentPage.value = page
}

</script>

<style scoped>
.qr-code-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

::v-deep(.el-dialog__body) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>