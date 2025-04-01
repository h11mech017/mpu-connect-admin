<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">Lost and Found Items</h2>
            <div class="page-actions">
                <el-button type="primary" @click="toggleAdding" class="add-button">
                    <i class="el-icon-plus"></i>
                    Add Lost Item
                </el-button>
            </div>
        </div>

        <div class="table-wrapper">
            <el-table v-if="lostItems.length" :data="lostItems"
                :default-sort="{ prop: 'Found Date', order: 'descending' }" class="table-container"
                :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600' }"
                :row-class-name="tableRowClassName" border>
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="Category" label="Category" width="100"></el-table-column>
                <el-table-column prop="Description" label="Description" min-width="180"
                    show-overflow-tooltip></el-table-column>
                <el-table-column prop="Found Location" label="Found Location" width="130"></el-table-column>
                <el-table-column prop="Found Date" label="Found Date" sortable width="130">
                    <template #default="scope">
                        <span class="date-cell">{{ formatTimestamp(scope.row['Found Date']) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Status" label="Status" width="130">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.Status)" effect="light" class="status-tag">
                            {{ scope.row.Status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Claim Date" label="Claim Date" width="130">
                    <template #default="scope">
                        <span class="date-cell">{{ formatTimestamp(scope.row['Claim Date']) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Claimant ID" label="Claimant" width="100"></el-table-column>
                <el-table-column prop="Updated By" label="Updated By" width="100"></el-table-column>
                <el-table-column label="Actions">
                    <template #default="scope">
                        <div class="actions">
                            <el-button type="primary" @click="toggleClaim(scope.row.id)" class="action-button">
                                Claim
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <div v-show="!lostItems.length" class="empty-state">
                <i class="el-icon-box empty-icon"></i>
                <p class="empty-message">No lost items available.</p>
                <el-button type="primary" @click="toggleAdding">Add First Item</el-button>
            </div>
        </div>

        <AddLostItem @itemAdded="fetchItems" />
        <ClaimLostItem @itemClaimed="fetchItems" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchData } from '../controller'
import AddLostItem from './AddLostItem.vue'
import ClaimLostItem from './ClaimLostItem.vue'
import { useItemStore } from '../stores/itemStore'

const lostItems = ref([])

onMounted(async () => {
    await fetchItems()
    itemStore.setCategories((await fetchData('/lost/categories')).data)
    itemStore.setLocations((await fetchData('/lost/locations')).data)
})

const itemStore = useItemStore()

async function fetchItems() {
    const response = await fetchData('/lost/items')
    if (response && response.data) {
        lostItems.value = response.data
    }
}

function toggleAdding() {
    itemStore.setIsAdding(!itemStore.isAdding)
}

function toggleClaim(id) {
    itemStore.setItemId(id)
    itemStore.setIsClaiming(!itemStore.isClaiming)
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
        case 'Claimed':
            return 'success'
        case 'Waiting to be claimed':
            return 'warning'
        default:
            return 'info'
    }
}

function tableRowClassName({ row, rowIndex }) {
    if (row.Status === 'Claimed') {
        return 'claimed-row'
    }
    return ''
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

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 12px;
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

:deep(.claimed-row) {
    background-color: rgba(103, 194, 58, 0.1);
}

:deep(.el-table__row:hover) {
    background-color: #f0f9eb !important;
}

:deep(.el-table th) {
    font-weight: 600;
    background-color: #f5f7fa;
    color: #606266;
}

:deep(.el-table td, .el-table th) {
    padding: 8px 4px;
}

:deep(.el-table .cell) {
    padding-left: 8px;
    padding-right: 8px;
    white-space: nowrap;
}
</style>