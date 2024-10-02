<template>
    <ParkingTable :parkingApplications="parkingApplications" />
    <LostItemsTable :lostItems="lostItems" />
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { fetchData } from '../controller';
import router from '../router';
import { useFirebaseAuth } from 'vuefire';
import ParkingTable from '../components/ParkingTable.vue';
import LostItemsTable from '../components/lostItemsTable.vue';

const auth = useFirebaseAuth();

const idToken = ref('');
const parkingApplications = ref([]);
const lostItems = ref([]);

onMounted(async () => {
    if (!auth.currentUser) {
        router.push('/login');
    }

    idToken.value = await auth.currentUser.getIdToken()

    parkingApplications.value = await fetchData('/admin/parking/applications', idToken.value)
    lostItems.value = await fetchData('/lost/items')
});




</script>

<style></style>