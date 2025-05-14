<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">Campus Lockers</h2>
        </div>

        <div class="table-wrapper">
            <el-table v-if="lockers.length" :data="paginatedData"
                :default-sort="{ prop: 'Location', order: 'ascending' }" class="table-container"
                :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600' }"
                :row-class-name="tableRowClassName" border>
                <el-table-column prop="id" label="Locker ID" width="100" sortable></el-table-column>
                <el-table-column prop="Faculty" label="Faculty" width="100"></el-table-column>
                <el-table-column prop="Location" label="Location" min-width="200" sortable></el-table-column>
                <el-table-column prop="Status" label="Status" width="120">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.Status)" effect="light" class="status-tag">
                            {{ scope.row.Status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Student" label="Student" width="120">
                    <template #default="scope">
                        <span>{{ scope.row.Student || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Applied At" label="Applied At" width="170">
                    <template #default="scope">
                        <span class="date-cell">{{ formatTimestamp(scope.row['Applied At']) }}</span>
                    </template>
                </el-table-column>

            </el-table>

            <div v-show="!lockers.length" class="empty-state">
                <i class="el-icon-box empty-icon"></i>
                <p class="empty-message">No lockers available.</p>
            </div>

            <div v-if="lockers.length" class="pagination-container">
                <el-pagination background layout="prev, pager, next" :total="pagination.total"
                    :page-size="pagination.limit" @current-change="handleCurrentChange"
                    :current-page="pagination.page" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { fetchData } from '../controller'
import { useUserStore } from '../stores/userStore'
import { ElPagination } from 'element-plus'

const lockers = ref([])
const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
})

const userStore = useUserStore()

const paginatedData = computed(() => {
    return lockers.value
})

onMounted(async () => {
    await fetchLockers()
})

async function fetchLockers(page = 1) {
    const response = await fetchData(`/lockers?page=${page}`, userStore.token)
    if (response && response.data) {
        lockers.value = response.data.lockers
        pagination.value = response.data.pagination
    }
}



function formatTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
        return date.toLocaleString()
    }
    return ""
}

function getStatusType(status) {
    switch (status) {
        case 'Available':
            return 'success'
        case 'Occupied':
            return 'warning'
        case 'Maintenance':
            return 'danger'
        default:
            return 'info'
    }
}

function tableRowClassName({ row }) {
    if (row.Status === 'Maintenance') {
        return 'maintenance-row'
    } else if (row.Status === 'Occupied') {
        return 'occupied-row'
    }
    return ''
}

function handleCurrentChange(page) {
    fetchLockers(page)
}
</script>

<style scoped>
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

.page-actions {
    display: flex;
    gap: 12px;
}

.add-button {
    display: flex;
    align-items: center;
    gap: 8px;
}

.date-cell {
    font-family: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
}

.status-tag {
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    background-color: var(--card-bg);
    border-radius: 8px;
    border: 1px dashed var(--border-color);
    margin-top: 16px;
}

.empty-icon {
    font-size: 48px;
    color: var(--text-light);
    margin-bottom: 16px;
}

.empty-message {
    margin-bottom: 24px;
}

.table-wrapper {
    overflow-x: auto;
    padding: 0 8px;
}

.table-container {
    width: 100%;
    margin-bottom: 24px;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 24px;
}

.actions {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.action-button {
    padding: 6px 12px;
    font-size: 13px;
}

.maintenance-row {
    background-color: rgba(245, 108, 108, 0.1);
}

.occupied-row {
    background-color: rgba(230, 162, 60, 0.1);
}
</style>
