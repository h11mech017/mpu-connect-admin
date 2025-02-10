<template>
    <div>
        <h2>Parking Applications</h2>
        <el-table :data="parkingApplications.data" :fit="false">
            <el-table-column prop="Student ID" label="Student ID" width="90" />
            <el-table-column prop="Card valid till" label="Student Card valid till" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Card valid till']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Name" label="Name" width="180" />
            <el-table-column prop="Motorcycle Plate No" label="Motorcycle Plate No." width="180" />
            <el-table-column prop="Applied At" label="Applied At" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Applied At']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Status" label="Status" width="180" sortable />
            <el-table-column width="200">
                <template #default="scope">
                    <div class="actions">
                    <el-button type="primary" @click="approveParkingApplication(scope.row.id)">Approve</el-button>
                    <el-button type="danger" @click="rejectParkingApplication(scope.row.id)">Reject</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
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
    parkingApplications.value = await fetchData('/admin/parking/applications', userStore.token)
})


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
        parkingApplications.value = await fetchData('/admin/parking/applications', userStore.token)
    }
}

async function rejectParkingApplication(id) {
    const response = await putData('/admin/parking/application/update', userStore.token, id, 'Invalid')

    if (response.status === 200) {
        ElMessage.success('Parking application rejected')
        parkingApplications.value = await fetchData('/admin/parking/applications', userStore.token)
    }
}
</script>

<style scoped>
.actions {
    display: flex;
    justify-content: center;
}
</style>