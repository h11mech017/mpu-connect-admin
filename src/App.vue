<template>
  <div>
    <header class="header">
      <img src="./assets/mpu_logo.png" alt="Logo" class="logo" />
    </header>
    <div class="main-content">
      <RouterView />
    </div>
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
  if (userStore.token) {
    const role = await getUserRole(userStore.token)
    userStore.setRole(role.data)
  } else {
    router.push('/login')
  }
})
</script>

<style>
.header {
  background-color: green;
  height: 12vh;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
}

.logo {
  height: 90%;
}

.main-content {
  display: flex;
  margin-top: 12vh;
}

.el-button {
  margin: 10px;
}
</style>