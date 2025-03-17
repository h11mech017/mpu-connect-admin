<template>
    <div>
        <el-dialog v-model="eventStore.isEditing" title="Create New Event">
            <el-form :model="eventStore.formData">
                <el-form-item label="Headline">
                    <el-input v-model="eventStore.formData['Headline']"></el-input>
                </el-form-item>
                <div>
                    <span class="to-the-left">Details</span>
                    <el-form-item class="form-item-spacing" label="Name of Event">
                        <el-input v-model="eventStore.formData['Details']['Name of Event']"
                            style="width: 100%;"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Organization">
                        <el-input v-model="eventStore.formData['Details']['Organization']"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Introduction">
                        <el-input v-model="eventStore.formData['Details']['Introduction']" type="textarea"
                            :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Time">
                        <el-input v-model="eventStore.formData['Details']['Time']"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Venue">
                        <el-input v-model="eventStore.formData['Details']['Venue']"></el-input>
                    </el-form-item>
                    <el-form-item class="form-item-spacing" label="Audience">
                        <el-input v-model="eventStore.formData['Details']['Audience']"></el-input>
                    </el-form-item>
                </div>
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
                <el-form-item label="Is it a Notification?">
                    <el-switch v-model="eventStore.formData['is Notification']"></el-switch>
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
                <el-button @click="toggleEditing">Cancel</el-button>
                <el-button type="primary" @click="submitForm">Submit</el-button>
                <el-button type="danger" @click="resetForm">Reset</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { uploadFile } from '../controller'
import { useUserStore } from '../stores/userStore'
import { useEventStore } from '../stores/eventStore'

const fileInput = ref(null)
const uploadedFiles = ref([])
const formData = new FormData()

const userStore = useUserStore()
const eventStore = useEventStore()

const emit = defineEmits(['eventUpdated'])

function getUploadedFiles() {
    uploadedFiles.value = formData.getAll('files')
}

function triggerFileUpload() {
    fileInput.value.click()
}

async function handleFile() {
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
    if (!isNaN(date.getTime())) {
        eventStore.formData['Event Start Date'] = {
            _seconds: Math.floor(date.getTime() / 1000),
            _nanoseconds: (date.getMilliseconds() * 1e6)
        }
    }

    date = new Date(parseInt(eventStore.formData['Event End Date']))
    if (!isNaN(date.getTime())) {
        eventStore.formData['Event End Date'] = {
            _seconds: Math.floor(date.getTime() / 1000),
            _nanoseconds: (date.getMilliseconds() * 1e6)
        }
    }

    date = new Date(parseInt(eventStore.formData['Visible Date']))
    if (!isNaN(date.getTime())) {
        eventStore.formData['Visible Date'] = {
            _seconds: Math.floor(date.getTime() / 1000),
            _nanoseconds: (date.getMilliseconds() * 1e6)
        }
    }

    formData.set('formData', JSON.stringify(eventStore.formData))
    const response = await uploadFile(`/campus/events/${eventStore.formData.id}/update`, userStore.token, formData)

    if (response.status === 200) {
        ElMessage.success('Event updated successfully');
        formData.delete('formData')
        formData.delete('files')
        emit('eventUpdated')
        toggleEditing()
    } else {
        ElMessage.error('Failed to update event');
    }
}

function toggleEditing() {
    eventStore.setIsEditing(!eventStore.isEditing)
}

</script>

<style scoped>
.form-item-spacing {
    margin: 20px;
}

.to-the-left {
    text-align: left;
}
</style>
