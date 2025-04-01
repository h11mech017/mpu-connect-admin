<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">Assignment Submissions</h2>
            <p class="submission-count">{{ submissions.length }} of {{ enrolledStudents.length }} Students have
                submitted</p>
        </div>
        <div class="table-wrapper">
            <el-table v-if="submissions.length" :data="submissions" class="table-container"
                :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600' }" border>
                <el-table-column type="index" width="90"></el-table-column>
                <el-table-column prop="Student ID" label="Student ID" width="120" />
                <el-table-column prop="Submission Date" label="Submission Date" width="180" sortable>
                    <template #default="scope">
                        {{ formatTimestamp(scope.row['Submission Date']) }}
                    </template>
                </el-table-column>
                <el-table-column prop="Score" label="Score" width="100" sortable />
                <el-table-column label="Actions">
                    <template #default="scope">
                        <div class="actions">
                            <el-button type="primary" @click="downloadFile(scope.row.downloadUrl)">Download
                                File</el-button>
                            <el-button type="success"
                                @click="toggleGradeDialog(scope.row, scope.row.id)">Grade</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-else class="empty-state">
                <i class="el-icon-document-checked empty-icon"></i>
                <p class="empty-message">No submissions available.</p>
            </div>
        </div>

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
const section = router.currentRoute.value.params.section
const assignmentId = router.currentRoute.value.params.assignmentId
const submissions = ref([])
const enrolledStudents = ref([])

const gradeDialogVisible = ref(false)
const currentSubmission = ref({})

const userStore = useUserStore()

onMounted(async () => {
    await fetchSubmissions()
    await fetchEnrolledStudents()
})

async function fetchSubmissions() {
    const response = await fetchData(`/user/courses/${courseId}/${section}/assignments/${assignmentId}/submissions`, userStore.token)
    if (response && response.data) {
        submissions.value = response.data
    }
}

async function fetchEnrolledStudents() {
    const response = await fetchData(`/user/courses/${courseId}/${section}/students`, userStore.token)
    if (response && response.data) {
        enrolledStudents.value = response.data
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

.submission-count {
    margin: 0;
    color: #606266;
    font-size: 14px;
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