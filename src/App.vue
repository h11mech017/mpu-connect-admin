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
  width: 100%;
  margin-top: 12vh;
  margin-left: 5%;
}

.el-button {
  margin: 10px;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
  width: 100%;
  box-sizing: border-box;
}

.button-right {
  text-align: end;
}
</style>