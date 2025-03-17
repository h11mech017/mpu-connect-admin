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

// Watch for auth state changes
watch(() => auth.currentUser, async (user) => {
  if (user) {
    try {
      const token = await user.getIdToken()
      userStore.setToken(token)
      
      // Only fetch role if we don't have it yet
      if (!userStore.role) {
        const roleResponse = await getUserRole(token)
        if (roleResponse && roleResponse.data) {
          userStore.setRole(roleResponse.data)
        }
      }
      
      isLoading.value = false
    } catch (error) {
      console.error('Error getting user token:', error)
      isLoading.value = false
    }
  } else if (userStore.token) {
    // If we still have a token in localStorage, we can use that
    isLoading.value = false
  } else {
    // No user and no token, redirect to login
    router.push('/login')
  }
}, { immediate: true })

onMounted(async () => {
  try {
    // Check if we have a token in localStorage
    if (userStore.token) {
      // If we have a role already, use it
      if (!userStore.role) {
        const roleResponse = await getUserRole(userStore.token)
        if (roleResponse && roleResponse.data) {
          userStore.setRole(roleResponse.data)
        }
      }
      
      // Set loading to false since we have a valid token
      isLoading.value = false
    } else {
      // Check Firebase auth state
      const user = await new Promise(resolve => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe()
          resolve(user)
        })
      })
      
      if (!user) {
        router.push('/login')
      } else {
        // We have a Firebase user but no token, get a new token
        const token = await user.getIdToken()
        userStore.setToken(token)
        
        if (!userStore.role) {
          const roleResponse = await getUserRole(token)
          if (roleResponse && roleResponse.data) {
            userStore.setRole(roleResponse.data)
          }
        }
        
        isLoading.value = false
      }
    }
  } catch (error) {
    console.error('Error during authentication check:', error)
    router.push('/login')
  }
})
</script>

<style></style>
