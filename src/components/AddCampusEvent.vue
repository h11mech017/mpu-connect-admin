<template>
    <div>
        <el-dialog v-model="eventStore.isAdding" title="Create New Event">
            <el-form :model="eventStore.formData">
                <el-form-item label="Headline">
                    <el-input v-model="eventStore.formData['Headline']"></el-input>
                </el-form-item>
                <el-form-item label="Details">
                    <el-form-item class="form-item-spacing" label="Name of Event">
                        <el-input v-model="eventStore.formData['Name of Event']"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Organization">
                        <el-input v-model="eventStore.formData['Organization']"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Introduction" width="300px">
                        <el-input v-model="eventStore.formData['Introduction']" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Time">
                        <el-input v-model="eventStore.formData['Time']"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Venue">
                        <el-input v-model="eventStore.formData['Venue']"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Audience">
                        <el-input v-model="eventStore.formData['Audience']"></el-input>
                    </el-form-item>
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
                        Upload Images<el-icon class="el-icon--right">
                            <Upload />
                        </el-icon>
                    </el-button>
                    <input type="file" ref="fileInput" style="display: none" @change="handleFile" multiple />
                </el-form-item>
                <el-form-item label="Uploaded Images">
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

    date = new Date(parseInt(eventStore.formData['Event Start Date']))
    eventStore.formData['Event Start Date'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }

    date = new Date(parseInt(eventStore.formData['Event End Date']))
    eventStore.formData['Event End Date'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }

    date = new Date(parseInt(eventStore.formData['Visible Date']))
    eventStore.formData['Visible Date'] = {
        _seconds: Math.floor(date.getTime() / 1000),
        _nanoseconds: (date.getMilliseconds() * 1e6)
    }

    const form = {
        'Headline': eventStore.formData['Headline'],
        'Details': {
            'Name of Event': eventStore.formData['Name of Event'],
            'Organization': eventStore.formData['Organization'],
            'Introduction': eventStore.formData['Introduction'],
            'Time': eventStore.formData['Time'],
            'Venue': eventStore.formData['Venue'],
            'Audience': eventStore.formData['Audience']
        },
        'Event Start Date': eventStore.formData['Event Start Date'],
        'Event End Date': eventStore.formData['Event End Date'],
        'Visible Date': eventStore.formData['Visible Date'],
    }

    formData.set('formData', JSON.stringify(form))
    const response = await uploadFile(`/campus/events/add`, userStore.token, formData)

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

<style scoped>
.form-item-spacing {
    margin: 20px;
}
</style>