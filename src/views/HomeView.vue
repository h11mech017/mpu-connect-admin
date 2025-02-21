<template>
  <div v-if="!isLoading">
    <div v-if="userStore.role === 'Admin'">
      <NavigationBar role="Admin" />
      <EventsView />
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
import CoursesTable from '../components/CoursesTable.vue'
import { useUserStore } from '../stores/userStore'
import { getUserRole } from '../controller'
import NavigationBar from '../components/NavigationBar.vue'
import EventsView from './EventsView.vue'

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

<style>
.table-container {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
  width: 100%;
  box-sizing: border-box;
}
</style>
