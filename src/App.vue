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
:root {
  --primary-color: #1d8b4e;
  /* Slightly darker green for better contrast */
  --primary-light: #2aa967;
  /* Lighter green for hover states */
  --primary-dark: #156e3d;
  /* Darker green for active states */
  --accent-color: #ffd04b;
  /* Yellow accent color from the current design */
  --text-light: #ffffff;
  --text-dark: #333333;
  --background-light: #f5f7fa;
  --card-bg: #ffffff;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-xl: 24px;
  --transition-speed: 0.3s;
}

body {
  background-color: var(--card-bg);
  color: var(--text-dark);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
}

.header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  height: 12vh;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  box-shadow: var(--shadow-md);
}

.logo {
  height: 80%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
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
  color: var(--text-light);
  padding: 10px 18px;
  border-radius: var(--border-radius-xl);
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.modern-logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.modern-logout-btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
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
  margin-left: 10vh;
  padding: 24px 16px;
  transition: all var(--transition-speed) ease;
  box-sizing: border-box;
  background-color: var(--card-bg);
  min-height: calc(100vh - 12vh);
}

.el-button {
  margin: 8px;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-speed) ease;
}

.actions {
  display: flex;
  justify-content: center;
}

.table-container {
  background-color: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow-x: visible;
}

.table-container:hover {
  box-shadow: var(--shadow-lg);
}

.table-wrapper {
  margin-bottom: 24px;
  width: 100%;
  background-color: var(--card-bg);
  overflow-x: visible;
}

.page-container {
  padding: 0 0 32px;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  background-color: var(--card-bg);
}

.page-title-container {
  margin-bottom: 8px;
  padding: 0 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 12px;
}

.page-actions-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  padding: 0 8px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
  display: flex;
  align-items: center;
}

.page-actions {
  display: flex;
  gap: 12px;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background-color: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.empty-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.empty-message {
  text-align: center;
  font-size: 16px;
  color: #909399;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .main-content {
    width: 90%;
    margin-left: 5%;
    margin-top: calc(12vh + 16px);
    padding-right: 5%;
  }
}
</style>