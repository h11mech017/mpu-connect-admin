<template>
    <div>
        <el-dialog v-model="eventStore.isAdding" title="Create New Event">
            <el-form :model="eventStore.formData">
                <el-form-item label="Headline">
                    <el-input v-model="eventStore.formData['Headline']"></el-input>
                </el-form-item>
                <el-form-item label="Details">
                    <template v-for="(value, key) in eventStore.formData['Details']" :key="key">
                        <el-form-item :label="key">
                            <el-input v-model="eventStore.formData['Details'][key]"></el-input>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="Event Start Date">
                    <el-date-picker v-model="eventStore.formData['Event Start Date']" type="datetime"
                        placeholder="Pick a date and time" format="DD/MM/YYYY HH:mm:ss" value-format="x">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Event End Date">
                    <el-date-picker v-model="eventStore.formData['Event End Date']" type="datetime"
                        placeholder="Pick a date and time" format="DD/MM/YYYY HH:mm:ss" value-format="x">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Visible Date">
                    <el-date-picker v-model="eventStore.formData['Visible Date']" type="datetime"
                        placeholder="Pick a date and time" format="DD/MM/YYYY HH:mm:ss" value-format="x">
                    </el-date-picker>
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
import { uploadFile } from '../controller'
import { useEventStore } from '../stores/eventStore'
import { useUserStore } from '../stores/userStore'

const fileInput = ref(null)
const uploadedFiles = ref([])
const formData = new FormData()

const userStore = useUserStore()
const eventStore = useEventStore()

const emit = defineEmits(['eventAdded'])

onMounted(() => {
    eventStore.setFormData({ ...eventStore.formInitialState })
    console.log(eventStore.formData)
})

function toggleAdding() {
    eventStore.setIsAdding(!eventStore.isAdding)
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

    date = new Date(parseInt(eventStore.formData['Available Date']))
    eventStore.formData['Available Date'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }

    date = new Date(parseInt(eventStore.formData['Due Date']))
    eventStore.formData['Due Date'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }

    date = new Date(parseInt(eventStore.formData['Submission Deadline']))
    eventStore.formData['Submission Deadline'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }
    formData.append('formData', JSON.stringify(eventStore.formData))
    const response = await uploadFile(`/user/courses/${eventStore.formData['courseId']}/events/add`, userStore.token, formData)

    if (response.status === 200) {
        ElMessage.success('event added successfully');
        formData.delete('formData')
        await resetForm()
        emit('eventAdded')
        toggleAdding()
    } else {
        ElMessage.error('Failed to add event');
    }
}

async function resetForm() {
    eventStore.setFormData({ ...eventStore.initialFormState })
    formData.delete('files')
    getUploadedFiles()
}

</script>

<style scoped></style>