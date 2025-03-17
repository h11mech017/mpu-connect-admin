<template>
  <div>
    <header class="header">
      <img src="./assets/mpu_logo.png" alt="Logo" class="logo" />
      <div v-if="userStore.token" class="logout-container">
        <div class="modern-logout-btn" @click="logout">
          <span class="logout-text">Logout</span>
          <span class="logout-icon">&#x23FB;</span>
        </div>
      </div>
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
import { getAuth, signOut } from 'firebase/auth';

const userStore = useUserStore()

onMounted(async () => {
  if (userStore.token) {
    const role = await getUserRole(userStore.token)
    if (role && role.data) {
      userStore.setRole(role.data)
    }
  }
})

async function logout() {
  try {
    const auth = getAuth();
    await signOut(auth);
    userStore.clearUserData();
    router.push('/login');
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
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

.logout-container {
  margin-left: auto;
  margin-right: 30px;
}

.modern-logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modern-logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modern-logout-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.logout-text {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.logout-icon {
  font-size: 16px;
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