<template>
    <div>
        <h1>Login</h1>
        <el-form @submit.prevent="handleLogin">
            <el-input v-model="id" type="text" placeholder="ID" required />
            <el-input v-model="password" type="password" placeholder="Password" required @keyup.enter="handleLogin" />
            <el-button @click="handleLogin">Login</el-button>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
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

const userStore = useUserStore()

async function handleLogin() {
    try {
        error.value = ''

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
    }
};


</script>

<style scoped></style>