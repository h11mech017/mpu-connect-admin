<template>
    <div>
        <h2>Events</h2>
        <el-button type="primary" @click="toggleAdding">Add New Event
            <el-icon class="el-icon--right">
                <Plus />
            </el-icon>
        </el-button>
        <el-table :data="campusEvents" :table-layout="auto" class="table-container">
            <el-table-column prop="Headline" label="Headline" width="200" />
            <el-table-column prop="Post Date" label="Post Date" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Post Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Event Start Date" label="Event Start Date" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Event Start Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Event End Date" label="Event End Date" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Event End Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Visible Date" label="Visible Date" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Visible Date']) }}
                </template>
            </el-table-column>
            <el-table-column width="200" label="Actions">
                <template #default="scope">
                    <div class="actions">
                        <el-button type="primary" @click="toggleEditing(scope.row)">Edit</el-button>
                        <el-button type="danger" @click="confirmDelete(scope.row.id)">Delete</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <AddcampusEvent @eventAdded="fetchCampusEvents" />
    <EditcampusEvent @eventUpdated="fetchCampusEvents" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useEventStore } from '../stores/eventStore'
import { fetchData, putData } from '../controller'
import router from '../router'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddcampusEvent from './AddcampusEvent.vue'
import EditcampusEvent from './EditcampusEvent.vue'

const campusEvents = ref([])

const userStore = useUserStore()
const eventStore = useEventStore()

onMounted(async () => {
    await fetchCampusEvents()
})

async function fetchCampusEvents() {
    try {
        const response = await fetchData(`/campus/events`, userStore.token)
        if (response && response.data) {
            campusEvents.value = response.data
        } else {
            ElMessage.error('Failed to fetch campus events')
        }
    } catch (error) {
        console.error('Failed to fetch campus events:', error)
    }
}

async function handleDelete(id) {
    const eventId = id
    const response = await putData(`/campus/events/${eventId}/delete`, userStore.token)

    if (response) {
        ElMessage.success('Event deleted successfully');
        await fetchCampusEvents()
    } else {
        ElMessage.error('Failed to delete event');
    }
}

async function confirmDelete(id) {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to delete this event?',
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

function toggleAdding() {
    eventStore.setFormData({ ...eventStore.initialFormState })

    eventStore.setIsAdding(!eventStore.isAdding)
}

function toggleEditing(event) {
    eventStore.setFormData({
        'id': event.id,
        ...event
    })

    eventStore.setIsEditing(!eventStore.isEditing)
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