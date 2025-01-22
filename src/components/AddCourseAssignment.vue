<template>
    <div>
        <el-dialog v-model="assignmentStore.isAdding" title="Create New Assignment">
            <el-form :model="assignmentStore.formData">
                <el-form-item label="Title">
                    <el-input v-model="assignmentStore.formData['Title']"></el-input>
                </el-form-item>
                <el-form-item label="Detail">
                    <el-input v-model="assignmentStore.formData['Detail']" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="Available Date">
                    <el-date-picker v-model="assignmentStore.formData['Available Date']" type="datetime"
                        placeholder="Pick a date and time" format="DD/MM/YYYY HH:mm:ss" value-format="x">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Due Date">
                    <el-date-picker v-model="assignmentStore.formData['Due Date']" type="datetime"
                        placeholder="Pick a date and time" format="DD/MM/YYYY HH:mm:ss" value-format="x">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Submission Deadline">
                    <el-date-picker v-model="assignmentStore.formData['Submission Deadline']" type="datetime"
                        placeholder="Pick a date and time" format="DD/MM/YYYY HH:mm:ss" value-format="x">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Highest Score">
                    <el-input v-model="assignmentStore.formData['Highest Score']" type="number"></el-input>
                </el-form-item>
                <el-form-item label="Visible">
                    <el-switch v-model="assignmentStore.formData['Visible']"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="triggerFileUpload">
                        Upload files<el-icon class="el-icon--right">
                            <Upload />
                        </el-icon>
                    </el-button>
                    <input type="file" ref="fileInput" style="display: none" @change="handleFile" multiple />
                </el-form-item>
                <el-form-item label="Uploaded Files">
                    <ul>
                        <li v-for="file in uploadedFiles" :key="file.name">{{ file.name }}</li>
                    </ul>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="toggleAdding">Cancel</el-button>
                <el-button type="primary" @click="submitForm">Submit</el-button>
                <el-button type="danger" @click="resetForm">Reset</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import router from '../router'
import { uploadFile } from '../controller'
import { useAssignmentStore } from '../stores/assignmentStore'
import { useUserStore } from '../stores/userStore'

const fileInput = ref(null)
const uploadedFiles = ref([])
const formData = new FormData()

const userStore = useUserStore()
const assignmentStore = useAssignmentStore()

const emit = defineEmits(['assignmentAdded'])

onMounted(() => {
    assignmentStore.setFormData({ ...assignmentStore.formInitialState })
})

function toggleAdding() {
    assignmentStore.setIsAdding(!assignmentStore.isAdding)
}

function getUploadedFiles() {
    uploadedFiles.value = formData.getAll('files')
}

function triggerFileUpload() {
    fileInput.value.click()
}

function handleFile() {
    const files = fileInput.value.files
    if (files) {
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }
    }
    getUploadedFiles()
}

async function submitForm() {
    let date = null

    date = new Date(parseInt(assignmentStore.formData['Available Date']))
    assignmentStore.formData['Available Date'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }

    date = new Date(parseInt(assignmentStore.formData['Due Date']))
    assignmentStore.formData['Due Date'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }

    date = new Date(parseInt(assignmentStore.formData['Submission Deadline']))
    assignmentStore.formData['Submission Deadline'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }
    formData.append('formData', JSON.stringify(assignmentStore.formData))
    const response = await uploadFile(`/user/courses/${assignmentStore.formData['courseId']}/assignments/add`, userStore.token, formData)

    if (response.status === 200) {
        ElMessage.success('Assignment added successfully');
        formData.delete('formData')
        await resetForm()
        emit('assignmentAdded')
        toggleAdding()
    } else {
        ElMessage.error('Failed to add assignment');
    }
}

async function resetForm() {
    assignmentStore.setFormData({ ...assignmentStore.initialFormState })
    formData.delete('files')
    getUploadedFiles()
}

</script>

<style scoped>

</style>