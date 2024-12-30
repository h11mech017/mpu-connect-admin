<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore';
import { getUserRole } from './controller'
import router from './router';

const userStore = useUserStore()

onMounted(async () => {
  console.log(userStore.token)
  if (userStore.token) {
    const role = await getUserRole(userStore.token)
    userStore.setRole(role.data)
  } else {
    router.push('/login')
  }
})
</script>

<style scoped></style>
