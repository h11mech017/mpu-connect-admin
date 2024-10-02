<template>
    <ParkingTable :parkingApplications="parkingApplications" />
    <LostItemsTable />
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { fetchData } from '../controller';
import router from '../router';
import { useFirebaseAuth } from 'vuefire';
import ParkingTable from '../components/ParkingTable.vue';
import LostItemsTable from '../components/LostItemsTable.vue';
import { useUserStore } from '../stores/userStore';

const auth = useFirebaseAuth();

const parkingApplications = ref([]);

const userStore = useUserStore();

onMounted(async () => {
    if (!auth.currentUser) {
        router.push('/login');
    }
    else {
    parkingApplications.value = await fetchData('/admin/parking/applications', userStore.token)
    }
});




</script>

<style></style>