<template>
    <div>
        <h2>Lost and Found Items</h2>
        <el-button type="primary" @click="toggleAdding">Add Lost Item</el-button>
        <el-table :data="lostItems.data" :defaul-sort="{ prop: 'Found Date', order: 'decending' }" :table-layout="auto">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="Category" label="Category"></el-table-column>
            <el-table-column prop="Description" label="Description"></el-table-column>
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
            <el-table-column>
                <template #default="scope">
                    <el-button type="primary" @click="toggleClaim(scope.row.id)">Claim</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
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
    lostItems.value = await fetchData('/lost/items')
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