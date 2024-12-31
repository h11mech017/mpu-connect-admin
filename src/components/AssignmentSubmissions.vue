<template>
    <div>
        <h1>Assignment Submissions</h1>
        <el-table :data="submissions" style="width: 100%">
            <el-table-column type="index" width="90"></el-table-column>
            <el-table-column prop="Student" label="Student ID" width="120" />
            <el-table-column prop="Submission Date" label="Submission Date" width="180" sortable>
                <template #default="scope">
                    {{ formatTimestamp(scope.row['Submission Date']) }}
                </template>
            </el-table-column>
            <el-table-column prop="Score" label="Score" width="100" sortable />
            <el-table-column label="Actions" width="300">
                <template #default="scope">
                    <el-button type="primary" @click="downloadFile(scope.row.downloadUrl)">Download File</el-button>
                    <el-button type="success" @click="toggleGradeDialog(scope.row, scope.row.id)">Grade</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="gradeDialogVisible" title="Grade Assignment">
            <el-form :model="currentSubmission">
                <el-form-item label="Score">
                    <el-input v-model="currentSubmission.Score" type="number"></el-input>
                </el-form-item>
                <el-form-item label="Feedback">
                    <el-input v-model="currentSubmission.Feedback" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="gradeDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submitGrade">Submit</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, putData } from '../controller'
import router from '../router'
import { ElMessage } from 'element-plus'

const courseId = router.currentRoute.value.params.courseId
const assignmentId = router.currentRoute.value.params.assignmentId
const submissions = ref([])

const gradeDialogVisible = ref(false)
const currentSubmission = ref({})

const userStore = useUserStore()

onMounted(async () => {
    await fetchSubmissions()
})

async function fetchSubmissions() {
    const response = await fetchData(`/user/courses/${courseId}/assignments/${assignmentId}/submissions`, userStore.token)
    if (response && response.data) {
        submissions.value = response.data
    }
}

function downloadFile(url) {
    window.open(url, '_blank')
}

function toggleGradeDialog(submission, id) {
    currentSubmission.value = { id, Feedback: submission.Feedback, Score: submission.Score }
    gradeDialogVisible.value = true
}

async function submitGrade() {
    await putData(`/user/courses/${courseId}/assignments/${assignmentId}/submissions/grading`,
        userStore.token, currentSubmission.value.id, { Score: currentSubmission.value.Score, Feedback: currentSubmission.value.Feedback })
    gradeDialogVisible.value = false
    ElMessage.success('Graded successfully!')
    await fetchSubmissions()
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