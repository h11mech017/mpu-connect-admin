import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_TEST
})

export async function checkAdmin(token) {
    try {
        const response = await api.get('/admin/check', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        ElMessage.error('Error checking admin status')
        return false
    }
}

export async function fetchData(endpoint, token) {
    try {
        const response = await api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        ElMessage.error('Error fetching data')
    }
}

export async function postData(endpoint, token, data) {
    try {
        const response = await api.post(endpoint, data, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        return response
    } catch (error) {
        ElMessage.error('Error posting data')
    }
}

export async function putData(endpoint, token, id, data) {
    try {
        const response = await api.put(endpoint, {id, data}, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        return response
    } catch (error) {
        ElMessage.error('Error updating data')
    }
}


export default api