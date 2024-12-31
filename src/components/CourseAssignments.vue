<template>
    <div>
        <h2>Assignment Submissions</h2>
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
            <el-table-column width="200" label="Actions">
                <template #default="scope">
                    <div class="actions">
                    <el-button type="primary" @click="handleClick(scope.row.id)">View Submissions</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, putData } from '../controller'
import router from '../router'
import { ElMessage } from 'element-plus'

const courseAssignments = ref([])

const userStore = useUserStore();

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

function formatTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
        return date.toLocaleString()
    }
    return "";
}

</script>

<style scoped>

</style>