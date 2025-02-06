<template>
    <div>
        <el-dialog v-model="announcementStore.isAdding" title="Create New announcement">
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
import { postData } from '../controller'
import router from '../router'
import { useAnnouncementStore } from '../stores/announcementStore'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const announcementStore = useAnnouncementStore()

const emit = defineEmits(['announcementAdded'])

onMounted(() => {
    resetForm()
})

function toggleAdding() {
    announcementStore.setIsAdding(!announcementStore.isAdding)
}

async function submitForm() {
    let date = null
    const courseId = router.currentRoute.value.params.courseId

    if (announcementStore.formData['is Test']) {
        date = new Date(parseInt(announcementStore.formData['Test Date']))
        announcementStore.formData['Test Date'] = {
            _seconds: Math.floor(date.getTime() / 1000),
            _nanoseconds: (date.getMilliseconds() * 1e6)
        }
    }

    const response = await postData(`/user/courses/${courseId}/announcements/add`, userStore.token, announcementStore.formData)

    if (response.status === 200) {
        ElMessage.success('announcement added successfully');
        await resetForm()
        emit('announcementAdded')
        toggleAdding()
    } else {
        ElMessage.error('Failed to add announcement');
    }
}

async function resetForm() {
    announcementStore.setFormData({ ...announcementStore.initialFormState })
}

</script>

<style scoped>

</style>