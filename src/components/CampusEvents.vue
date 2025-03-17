<template>
    <div class="page-container">
        <div class="page-title-container">
            <h2 class="page-title">Events</h2>
        </div>
        <div class="page-actions-container">
            <div class="page-actions">
                <el-button type="primary" @click="toggleAdding" class="add-button">
                    <i class="el-icon-plus"></i>
                    Add New Event
                </el-button>
            </div>
        </div>
    <div class="table-wrapper">
        <el-table 
            v-if="campusEvents.length" 
            :data="campusEvents" 
            class="table-container"
            :header-cell-style="{backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600'}"
            border
            style="width: 100%"
            :fit="true"
            size="small"
        >
        <el-table-column prop="Headline" label="Headline" />
        <el-table-column prop="Post Date" label="Post Date" sortable>
            <template #default="scope">
                {{ formatTimestamp(scope.row['Post Date']) }}
            </template>
        </el-table-column>
        <el-table-column prop="Event Start Date" label="Event Start Date" sortable>
            <template #default="scope">
                {{ formatTimestamp(scope.row['Event Start Date']) }}
            </template>
        </el-table-column>
        <el-table-column prop="Event End Date" label="Event End Date" sortable>
            <template #default="scope">
                {{ formatTimestamp(scope.row['Event End Date']) }}
            </template>
        </el-table-column>
        <el-table-column prop="Visible Date" label="Visible Date" sortable>
            <template #default="scope">
                {{ formatTimestamp(scope.row['Visible Date']) }}
            </template>
        </el-table-column>
        <el-table-column label="Actions">
            <template #default="scope">
                <div class="actions">
                    <el-button type="primary" @click="toggleEditing(scope.row)">Edit</el-button>
                    <el-button type="danger" @click="confirmDelete(scope.row.id)">Delete</el-button>
                </div>
            </template>
        </el-table-column>
        </el-table>
        <div v-if="!campusEvents.length" class="empty-state">
            <i class="el-icon-date empty-icon"></i>
            <p class="empty-message">No campus events available.</p>
            <el-button type="primary" @click="toggleAdding">Add First Event</el-button>
        </div>
    </div>

    <AddcampusEvent @eventAdded="fetchCampusEvents" />
    <EditcampusEvent @eventUpdated="fetchCampusEvents" />
    </div>
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

<style scoped>
.page-container {
    padding: 0 0 32px;
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
    background-color: var(--card-bg);
}

.page-title-container {
    margin-bottom: 8px;
    padding: 0 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 12px;
}

.page-actions-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    padding: 0 8px;
}

.page-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
    display: flex;
    align-items: center;
}

.page-actions {
    display: flex;
    gap: 12px;
}

.add-button {
    display: flex;
    align-items: center;
    gap: 8px;
}

.table-wrapper {
    margin-bottom: 24px;
    width: 100%;
    overflow-x: auto;
    background-color: var(--card-bg);
}

.table-container {
    border-radius: var(--border-radius-md);
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    background-color: var(--card-bg);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
}

.empty-icon {
    font-size: 48px;
    color: #c0c4cc;
    margin-bottom: 16px;
}

.empty-message {
    text-align: center;
    font-size: 16px;
    color: #909399;
    margin-bottom: 24px;
}

.actions {
    display: flex;
    gap: 8px;
}
</style>