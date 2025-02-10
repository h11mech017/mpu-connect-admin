<template>
  <div v-if="!isLoading">
    <div v-if="userStore.role === 'Admin'">
      <CampusEvents />
      <ParkingTable />
      <LostItemsTable />
    </div>
    <div v-else-if="userStore.role === 'Teacher'">
      <CoursesTable />
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { ref } from 'vue'
import router from '../router'
import { useFirebaseAuth } from 'vuefire'
import ParkingTable from '../components/ParkingTable.vue'
import LostItemsTable from '../components/LostItemsTable.vue'
import CoursesTable from '../components/CoursesTable.vue'
import { useUserStore } from '../stores/userStore'
import { getUserRole } from '../controller'
import CampusEvents from '../components/CampusEvents.vue'

const auth = useFirebaseAuth()
const userStore = useUserStore()
const isLoading = ref(true)

watch(() => auth.currentUser, async (user) => {
  if (user) {
    const token = await user.getIdToken()
    userStore.setToken(token)
    isLoading.value = false
  } else {
    router.push('/login')
  }
}, { immediate: true })

onMounted(async () => {
  const role = await getUserRole(userStore.token)
  userStore.setRole(role.data)
  await new Promise(resolve => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
  if (!auth.currentUser) {
    router.push('/login')
  }
})
</script>
