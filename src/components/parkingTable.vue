<template>
    <div>
        <h2>Parking Applications</h2>
        <el-table v-if="parkingApplications.length" :data="parkingApplications" class="table-container">
            <el-table-column prop="Student ID" label="Student ID" width="100" />
            <el-table-column prop="Card valid till" label="Student Card valid till" width="200" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Card valid till']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Name" label="Name" width="120" />
            <el-table-column prop="Motorcycle Plate No" label="Motorcycle Plate No." width="100" />
            <el-table-column prop="Applied At" label="Applied At" width="200" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Applied At']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Status" label="Status" width="130" sortable />
            <el-table-column width="220">
                <template #default="scope">
                    <div class="actions">
                        <el-button type="primary" @click="approveParkingApplication(scope.row.id)">Approve</el-button>
                        <el-button type="danger" @click="rejectParkingApplication(scope.row.id)">Reject</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div v-else class="empty-message">No parking applications available.</div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { fetchData, putData } from '../controller'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/userStore'

const parkingApplications = ref([])

const userStore = useUserStore();

onMounted(async () => {
    await fetchApplications()
})

async function fetchApplications() {
    const response = await fetchData('/admin/parking/applications', userStore.token)
    if (response && response.data) {
        parkingApplications.value = response.data
    }
}


function formatTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
        return date.toLocaleString()
    }
    return "";
}

async function approveParkingApplication(id) {
    const response = await putData('/admin/parking/application/update', userStore.token, id, 'Valid')

    if (response.status === 200) {
        ElMessage.success('Parking application approved')
        await fetchApplications()
    }
}

async function rejectParkingApplication(id) {
    const response = await putData('/admin/parking/application/update', userStore.token, id, 'Invalid')

    if (response.status === 200) {
        ElMessage.success('Parking application rejected')
        await fetchApplications()
    }
}
</script>

<style scoped>
.actions {
    display: flex;
    justify-content: center;
}
.empty-message {
    text-align: center;
    padding: 20px;
    color: #999;
}
</style>