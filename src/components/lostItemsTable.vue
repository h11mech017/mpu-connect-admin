<template>
    <h2>Lost and Found Items</h2>
    <div class="button-right">
        <el-button type="primary" @click="toggleAdding">Add Lost Item</el-button>
    </div>
    <el-table v-if="lostItems.length" :data="lostItems" :default-sort="{ prop: 'Found Date', order: 'descending' }"
        class="table-container">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="Category" label="Category" ></el-table-column>
        <el-table-column prop="Description" label="Description" ></el-table-column>
        <el-table-column prop="Found Location" label="Found Location"></el-table-column>
        <el-table-column prop="Found Date" label="Found Date" sortable>
            <template #default="scope">
                {{ formatTimestamp(scope.row['Found Date']) }}
            </template>
        </el-table-column>
        <el-table-column prop="Status" label="Status"></el-table-column>
        <el-table-column prop="Claim Date" label="Claim Date">
            <template #default="scope">
                {{ formatTimestamp(scope.row['Claim Date']) }}
            </template>
        </el-table-column>
        <el-table-column prop="Claimant ID" label="Claimant"></el-table-column>
        <el-table-column prop="Updated By" label="Updated By"></el-table-column>
        <el-table-column >
            <template #default="scope">
                <div class="actions">
                    <el-button type="primary" @click="toggleClaim(scope.row.id)">Claim</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <div v-show="!lostItems.length" class="empty-message">No lost items available.</div>
    <AddLostItem @itemAdded="fetchItems" />
    <ClaimLostItem @itemClaimed="fetchItems" />
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

</script>

<style scoped>
.lost-items-container {
    margin-left: 50px;
}

.empty-message {
    text-align: center;
    padding: 20px;
    color: #999;
}
</style>