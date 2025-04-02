<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">Events</h2>
            <div class="page-actions">
                <el-button type="primary" @click="toggleAdding" class="add-button">
                    <i class="el-icon-plus"></i>
                    Add New Event
                </el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table v-if="campusEvents.length" :data="paginatedData" class="table-container"
                :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600' }" border>
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
            
            <div v-if="campusEvents.length" class="pagination-container">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="campusEvents.length"
                    :page-size="pageSize"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                />
            </div>
        </div>

        <AddCampusEvent @eventAdded="fetchCampusEvents" />
        <EditCampusEvent @eventUpdated="fetchCampusEvents" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useEventStore } from '../stores/eventStore'
import { fetchData, putData } from '../controller'
import { ElButton, ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import AddCampusEvent from './AddCampusEvent.vue'
import EditCampusEvent from './EditCampusEvent.vue'

const campusEvents = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return campusEvents.value.slice(startIndex, endIndex)
})

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

function handleCurrentChange(page) {
    currentPage.value = page
}

</script>

<style scoped>
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 8px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.page-title {
    margin: 0;
}

.empty-message {
    margin-bottom: 24px;
}
</style>