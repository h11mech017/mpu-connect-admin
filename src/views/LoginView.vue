<template>
    <div class="login-container">
        <div class="login-card">
            <el-form @submit.prevent="handleLogin" class="login-form">
                <h2 class="login-title">Sign In</h2>

                <el-form-item>
                    <el-input v-model="id" type="text" placeholder="ID" prefix-icon="el-icon-user"
                        required class="login-input" />
                </el-form-item>

                <el-form-item>
                    <el-input v-model="password" type="password" placeholder="Password" prefix-icon="el-icon-lock"
                        required @keyup.enter="handleLogin" class="login-input" show-password />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleLogin" class="login-button" :loading="loading">
                        Sign In
                    </el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { checkRole } from '../controller'
import router from '../router'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/userStore'

const error = ref('')
const auth = useFirebaseAuth()
const email = ref('')
const id = ref('')
const password = ref('')
const loading = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const userStore = useUserStore()

async function handleLogin() {
    try {
        error.value = ''
        loading.value = true

        email.value = `${id.value}@mpu.edu.mo`
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user

        const idToken = await user.getIdToken()

        console.log(idToken)

        const response = await checkRole(idToken)

        if (response.data.isValid) {
            ElMessage.success('Logged in successfully!')
            userStore.setToken(idToken)
            router.push('/home')
        } else {
            await auth.signOut()
            error.value = 'You are not an admin'

            ElMessage.error(error.value)
        }
    } catch (error) {
        error.value = error.message
        ElMessage.error(error.value)
    } finally {
        loading.value = false
    }
};


</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: white;
    padding: 0;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.login-card {
    width: 100%;
    max-width: 380px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #ebeef5;
    padding: 32px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.logo {
    width: 70px;
    height: 70px;
    object-fit: contain;
    margin-bottom: 12px;
}

.app-title {
    font-size: 22px;
    font-weight: 500;
    color: #303133;
    margin: 0;
    text-align: center;
}

.login-title {
    font-size: 18px;
    font-weight: 500;
    color: #606266;
    margin-bottom: 20px;
    text-align: center;
}

.login-form {
    margin-bottom: 24px;
}

.login-input {
    margin-bottom: 16px;
}

.login-button {
    width: 100%;
    padding: 10px;
    font-size: 15px;
    font-weight: 400;
    border-radius: 4px;
}

.login-footer {
    text-align: center;
    color: #909399;
    font-size: 14px;
    margin-top: 24px;
}
</style>