<template>
    <div class="page-container">
        <div class="page-title-container">
            <h2 class="page-title">Parking Applications</h2>
        </div>
        <div class="table-wrapper">
            <el-table 
                v-if="parkingApplications.length" 
                :data="parkingApplications" 
                class="table-container"
                :header-cell-style="{backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600'}"
                border
                style="width: 100%"
                :fit="true"
                size="small"
            >
        <el-table-column prop="Student ID" label="Student ID" />
        <el-table-column prop="Card valid till" label="Student Card valid till" sortable>
            <template #default="scope">
                {{ formatTimestamp(scope.row['Card valid till']) }}
            </template>
        </el-table-column>
        <el-table-column prop="Name" label="Name" />
        <el-table-column prop="Motorcycle Plate No" label="Motorcycle Plate No." />
        <el-table-column prop="Applied At" label="Applied At" sortable>
            <template #default="scope">
                {{ formatTimestamp(scope.row['Applied At']) }}
            </template>
        </el-table-column>
        <el-table-column prop="Status" label="Status" sortable />
        <el-table-column>
            <template #default="scope">
                <div class="actions">
                    <el-button type="primary" @click="approveParkingApplication(scope.row.id)">Approve</el-button>
                    <el-button type="danger" @click="rejectParkingApplication(scope.row.id)">Reject</el-button>
                </div>
            </template>
        </el-table-column>
            </el-table>
            <div v-if="!parkingApplications.length" class="empty-state">
                <i class="el-icon-parking empty-icon"></i>
                <p class="empty-message">No parking applications available.</p>
            </div>
        </div>
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
    gap: 8px;
    justify-content: center;
}
</style>