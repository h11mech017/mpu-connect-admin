<template>
    <div v-if="attendanceDetail">
        <h1>{{ formatTimestamp(attendanceDetail['Class Date']) }}</h1>
        <el-button type="primary" @click="showQrCode">QR Code</el-button>
        <el-dialog v-model="showQr" title="Attendance QR Code" :style="{ height: '400px' }" width="50%">
            <div class="qr-code-container">
                <qrcode-svg :value="qrCodeValue" level="H" size="90%" />
            </div>
        </el-dialog>
        <el-table :data="attendanceDetail.Students">
            <el-table-column prop="Student ID" label="Student ID" width="100"></el-table-column>
            <el-table-column prop="Name" label="Student Name" width="200"></el-table-column>
            <el-table-column prop="Status" label="Status" width="100"></el-table-column>
            <el-table-column label="Actions" width="250">
                <template #default="scope">
                    <el-button type="success" @click="updateAttendanceStatus(scope.row.Student, 'Present')">Take</el-button>
                    <el-button type="danger" @click="updateAttendanceStatus(scope.row.Student, 'Absent')">Absent</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, postData, putData } from '../controller'
import { ElButton, ElMessage } from 'element-plus'
import router from '../router'
import { QrcodeSvg } from 'qrcode.vue'

const attendanceDetail = ref()
const userStore = useUserStore();
const qrCodeValue = ref('')
const showQr = ref(false)

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

        console.log('Updating attendance status:', studentUid, status)
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
    const apiEndpoint = `${import.meta.env.VITE_BACKEND_URL_TEST}/user/courses/${router.currentRoute.value.params.courseId}/${router.currentRoute.value.params.section}/attendance/${router.currentRoute.value.params.attendanceId}/checkin`
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
    qrCodeInterval = setInterval(generateQrCodeValue, 10000)
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