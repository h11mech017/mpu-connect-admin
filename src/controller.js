import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_TEST,
})

export async function checkRole(token) {
    try {
        const response = await api.get('/admin/role/check', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        ElMessage.error('Error checking user role status')
        return false
    }
}

export async function getUserRole(token) {
    try {
        const response = await api.get('/user/role', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        ElMessage.error('Error fetching user role')
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

export async function uploadFile(endpoint, token, formData) {
    try {
        const response = await api.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'multipart/form-data'
            },
        })
        return response
    } catch (error) {
        ElMessage.error('Error posting data')
    }
}

export async function deleteFile(endpoint, token, filepath) {
    try {
        const response = await api.delete(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                filepath
            },
        })
        return response
    } catch (error) {
        ElMessage.error('Error deleting file')
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