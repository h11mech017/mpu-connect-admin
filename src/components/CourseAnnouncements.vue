<template>
    <div>
        <h2>Course Attendance</h2>
        <el-button type="primary" @click="toggleAdding">Add Announcement
            <el-icon class="el-icon--right">
                <Plus />
            </el-icon>
        </el-button>
        <el-table :data="announcements" :default-sort="{ prop: 'Post Date', order: 'descending' }" table-layout="auto" class="table-container">
            <el-table-column prop="Title" label="Title" width="180"></el-table-column>
            <el-table-column prop="Post Date" label="Post Date" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Post Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="is Test" label="Is Test" width="100"></el-table-column>
            <el-table-column prop="Test Date" label="Test Date" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Test Date']) }}
                </template>
            </el-table-column>
            <el-table-column width="200">
                <template #default="scope">
                    <div class="actions">
                        <el-button type="primary" @click="toggleEditing(scope.row)">Edit</el-button>
                        <el-button type="danger" @click="confirmDelete(scope.row.id)">Delete</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <AddCourseAnnouncement @announcementAdded="fetchAnnouncements" />
    <EditCourseAnnouncement @announcementUpdated="fetchAnnouncements" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useAnnouncementStore } from '../stores/announcementStore'
import { fetchData, putData } from '../controller'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import router from '../router'
import AddCourseAnnouncement from './AddCourseAnnouncement.vue'
import EditCourseAnnouncement from './editCourseAnnouncement.vue'

const announcements = ref([])
const userStore = useUserStore();
const announcementStore = useAnnouncementStore()

onMounted(async () => {
    await fetchAnnouncements()
})

async function fetchAnnouncements() {
    try {
        const courseId = router.currentRoute.value.params.courseId
        if (!courseId) {
            throw new Error('Course ID is missing')
        }
        const response = await fetchData(`/user/courses/${courseId}/announcements`, userStore.token)
        if (response && response.data) {
            announcements.value = response.data
        } else {
            ElMessage.error('Failed to fetch course announcements')
        }
    } catch (error) {
        console.error('Failed to fetch course announcements:', error)
    }
}

function toggleAdding() {
    announcementStore.setFormData({ ...announcementStore.initialFormState })

    announcementStore.setIsAdding(!announcementStore.isAdding)
}

function toggleEditing(announcement) {
    announcementStore.setAnnouncementId(announcement.id)
    announcementStore.setFormData({ ...announcement })

    announcementStore.setIsEditing(!announcementStore.isEditing)
}

async function handleDelete(id) {
    const courseId = router.currentRoute.value.params.courseId
    const announcementId = id
    const response = await putData(`/user/courses/${courseId}/announcements/${announcementId}/delete`, userStore.token)

    if (response) {
        ElMessage.success('announcement deleted successfully');
        await fetchAnnouncements()
    } else {
        ElMessage.error('Failed to delete announcement');
    }
}

async function confirmDelete(id) {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to delete this announcement?',
            'Warning',
            {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning',
            }
        )
        await handleDelete(id)
    } catch (error) {
        console.log('Delete canceled')
    }
}

function formatTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
        return date.toLocaleString()
    }
    return "";
}

</script>

<style scoped></style>