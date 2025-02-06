<template>
    <div>
        <el-dialog v-model="announcementStore.isEditing" title="Create New announcement">
            <el-form :model="announcementStore.formData">
                <el-form-item label="Title">
                    <el-input v-model="announcementStore.formData['Title']"></el-input>
                </el-form-item>
                <el-form-item label="Content">
                    <el-input v-model="announcementStore.formData['Content']" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="Is it about a test?">
                    <el-switch v-model="announcementStore.formData['is Test']"></el-switch>
                </el-form-item>
                <el-form-item label="Test Date" v-if="announcementStore.formData['is Test']">
                    <el-date-picker v-model="announcementStore.formData['Test Date']" type="datetime"
                        placeholder="Pick a date and time" format="DD/MM/YYYY HH:mm:ss" value-format="x">
                    </el-date-picker>
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
import { putData } from '../controller'
import { useUserStore } from '../stores/userStore'
import { useAnnouncementStore } from '../stores/announcementStore'
import router from '../router'

const userStore = useUserStore()
const announcementStore = useAnnouncementStore()

const emit = defineEmits(['announcementUpdated'])


async function submitForm() {
    let date = null
    const courseId = router.currentRoute.value.params.courseId

    date = new Date(parseInt(announcementStore.formData['Test Date']))
    if (!isNaN(date.getTime())) {
        announcementStore.formData['Test Date'] = {
            _seconds: Math.floor(date.getTime() / 1000),
            _nanoseconds: (date.getMilliseconds() * 1e6)
        }
    }

    const response = await putData(`/user/courses/${courseId}/announcements/${announcementStore.announcementId}/update`, userStore.token, announcementStore.announcementId, announcementStore.formData)

    if (response.status === 200) {
        ElMessage.success('announcement updated successfully');
        await resetForm()
        emit('announcementUpdated')
        toggleEditing()
    } else {
        ElMessage.error('Failed to update announcement');
    }
}

async function resetForm() {
    announcementStore.setFormData({ ...announcementStore.initialFormState })
}

function toggleEditing() {
    announcementStore.setIsEditing(!announcementStore.isEditing)
}

</script>

<style scoped></style>