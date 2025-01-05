<template>
    <h2>Assignments</h2>
    <el-button type="primary" @click="toggleAdding">Create New Assignment
        <el-icon class="el-icon--right">
            <Plus />
        </el-icon>
    </el-button>
    <div>
        <el-table :data="courseAssignments">
            <el-table-column prop="Title" label="Title" width="150" />
            <el-table-column prop="Due Date" label="Due Date" width="120" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Due Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Highest Score" label="Highest Possible Score" width="120" />
            <el-table-column prop="Submission Deadline" label="Submission Deadline" width="120" sortable>
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
    </div>

    <AddCourseAssignment @assignmentAdded="fetchCourseAssignments" />
    <EditCourseAssignment @assignmentUpdated="fetchCourseAssignments"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useAssignmentStore } from '../stores/assignmentStore'
import { fetchData, putData } from '../controller'
import router from '../router'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddCourseAssignment from './AddCourseAssignment.vue'
import EditCourseAssignment from './EditCourseAssignment.vue'

const courseAssignments = ref([])

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
    router.push({ name: 'AssignmentView', params: { courseId: courseId, assignmentId: id } })
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
    assignmentStore.formData.courseId = router.currentRoute.value.params.courseId
    assignmentStore.setFormData({ ...assignmentStore.initialFormState })
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

</script>

<style scoped></style>