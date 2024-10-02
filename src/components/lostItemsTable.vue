<template>
    <div>
        <h2>Lost and Found Items</h2>
        <el-button type="primary" @click="toggleAdding">Add Lost Item</el-button>
        <el-table :data="lostItems.data">
            <el-table-column type="index" width="90"></el-table-column>
            <el-table-column prop="Category" label="Category" width="180"></el-table-column>
            <el-table-column prop="Description" label="Description" width="180"></el-table-column>
            <el-table-column prop="Found Location" label="Found Location" width="180"></el-table-column>
            <el-table-column prop="Found Date" label="Found Date" width="180">
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Found Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Status" label="Status" width="90"></el-table-column>
            <el-table-column prop="Claim Date" label="Claim Date" width="180">
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Applied At']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Claimant ID" label="Claimant" width="180"></el-table-column>
            <el-table-column prop="Updated By" label="Updated By" width="180"></el-table-column>
            <el-table-column>
                <template #default="scope">
                    <!-- <el-button type="primary" @click="approveParkingApplication(scope.row.id)">Approve</el-button> -->
                    <!-- <el-button type="danger"@click="rejectParkingApplication(scope.row.id)">Reject</el-button> -->
                </template>
            </el-table-column>
        </el-table>
    </div>
    <AddLostItem />
</template>

<script setup>
import { ref } from 'vue';
import { fetchData, putData } from '../controller';
import AddLostItem from './AddLostItem.vue';
import { useItemStore } from '../stores/itemStore';

const props = defineProps({
    lostItems: Object
})

const itemStore = useItemStore();

function toggleAdding() {
    itemStore.setIsAdding(!itemStore.isAdding);
}

function formatTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
        return date.toLocaleString();
    }
    return "";
}

</script>