<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">Course Assignments</h2>
            <div class="page-actions">
                <el-button type="primary" @click="toggleAdding" class="add-button">
                    <i class="el-icon-plus"></i>
                    Create New Assignment
                </el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table 
                v-if="courseAssignments.length" 
                :data="paginatedData" 
                class="table-container"
                :header-cell-style="{backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600'}"
                border
            >
            <el-table-column prop="Title" label="Title"/>
            <el-table-column prop="Available Date" label="Available Date" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Available Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Due Date" label="Due Date" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Due Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Highest Score" label="Highest Possible Score" />
            <el-table-column prop="Submission Deadline" label="Submission Deadline" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Submission Deadline']) }}
                </template>
            </el-table-column>
            <el-table-column width="400" label="Actions">
                <template #default="scope">
                    <div class="actions">
                        <el-button type="info" @click="handleClick(scope.row.id)">View Submissions</el-button>
                        <el-button type="primary" @click="toggleEditing(scope.row)">Edit</el-button>
                        <el-button type="danger" @click="confirmDelete(scope.row.id)">Delete</el-button>
                    </div>
                </template>
            </el-table-column>
            </el-table>
            <div v-if="!courseAssignments.length" class="empty-state">
                <i class="el-icon-document-checked empty-icon"></i>
                <p class="empty-message">No course assignments available.</p>
                <el-button type="primary" @click="toggleAdding">Create First Assignment</el-button>
            </div>
            
            <div v-if="courseAssignments.length" class="pagination-container">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="courseAssignments.length"
                    :page-size="pageSize"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                />
            </div>
        </div>

        <AddCourseAssignment @assignmentAdded="fetchCourseAssignments" />
        <EditCourseAssignment @assignmentUpdated="fetchCourseAssignments" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useAssignmentStore } from '../stores/assignmentStore'
import { fetchData, putData } from '../controller'
import router from '../router'
import { ElButton, ElMessage, ElMessageBox, ElPagination } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddCourseAssignment from './AddCourseAssignment.vue'
import EditCourseAssignment from './EditCourseAssignment.vue'

const courseAssignments = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return courseAssignments.value.slice(startIndex, endIndex)
})

const userStore = useUserStore()
const assignmentStore = useAssignmentStore()

onMounted(async () => {
    await fetchCourseAssignments()
})

async function fetchCourseAssignments() {
    try {
        const courseId = router.currentRoute.value.params.courseId
        if (!courseId) {
            throw new Error('Course ID is missing')
        }
        const response = await fetchData(`/user/courses/${courseId}/assignments`, userStore.token)
        if (response && response.data) {
            courseAssignments.value = response.data
        } else {
            ElMessage.error('Failed to fetch course assignments')
        }
    } catch (error) {
        console.error('Failed to fetch course assignments:', error)
    }
}

async function handleClick(id) {
    const courseId = router.currentRoute.value.params.courseId
    const section = router.currentRoute.value.params.section
    router.push({ name: 'AssignmentView', params: { courseId: courseId, section: section, assignmentId: id } })
}

async function handleDelete(id) {
    const courseId = router.currentRoute.value.params.courseId
    const assignmentId = id
    const response = await putData(`/user/courses/${courseId}/assignments/${assignmentId}/delete`, userStore.token)

    if (response) {
        ElMessage.success('Assignment deleted successfully');
        await fetchCourseAssignments()
    } else {
        ElMessage.error('Failed to delete assignment');
    }
}

async function confirmDelete(id) {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to delete this assignment?',
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
    assignmentStore.setFormData({ ...assignmentStore.initialFormState })

    assignmentStore.formData.courseId = router.currentRoute.value.params.courseId
    assignmentStore.setIsAdding(!assignmentStore.isAdding)
}

function toggleEditing(assignment) {
    assignmentStore.setAssignmentId(assignment.id)
    assignmentStore.setFormData({ ...assignment })
    assignmentStore.formData.courseId = router.currentRoute.value.params.courseId

    assignmentStore.setIsEditing(!assignmentStore.isEditing)
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
/* Page layout styles moved to global CSS in App.vue */

/* Table styles moved to global CSS in App.vue */

/* Empty state styles moved to global CSS in App.vue */

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
    justify-content: center;
}
</style>