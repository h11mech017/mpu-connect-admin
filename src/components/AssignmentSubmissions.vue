<template>
    <div class="page-container">
        <div class="page-header">
            <h2 class="page-title">Assignment Submissions</h2>
            <p class="submission-count">{{ submissions.length }} of {{ enrolledStudents.length }} Students have
                submitted</p>
        </div>
        <div class="table-wrapper">
            <el-table :data="paginatedData" class="table-container"
                :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266', fontWeight: '600' }"
                :row-class-name="getRowClassName" border>
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="Student ID" label="Student ID" width="120" />
                <el-table-column prop="Name" label="Student Name" width="150" />
                <el-table-column prop="Status" label="Status" width="120">
                    <template #default="scope">
                        <el-tag :type="scope.row.Status === 'Submitted' ? 'success' : 'danger'" effect="light">
                            {{ scope.row.Status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Submission Date" label="Submission Date" width="180" sortable>
                    <template #default="scope">
                        {{ scope.row.Status === 'Submitted' ? formatTimestamp(scope.row['Submission Date']) : 'N/A' }}
                    </template>
                </el-table-column>
                <el-table-column prop="Score" label="Score" width="100" sortable />
                <el-table-column label="Actions">
                    <template #default="scope">
                        <div class="actions">
                            <template v-if="scope.row.Status === 'Submitted'">
                                <el-button type="primary" @click="downloadFile(scope.row.downloadUrl)">Download
                                    File</el-button>
                                <el-button type="success"
                                    @click="toggleGradeDialog(scope.row, scope.row.id)">Grade</el-button>
                            </template>
                            <template v-else>
                                <el-button type="info" disabled>No Submission</el-button>
                            </template>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="!paginatedData.length" class="empty-state">
                <i class="el-icon-document-checked empty-icon"></i>
                <p class="empty-message">No enrolled students found.</p>
            </div>

            <div v-if="combinedStudentData.length" class="pagination-container">
                <el-pagination background layout="prev, pager, next" :total="combinedStudentData.length"
                    :page-size="pageSize" @current-change="handleCurrentChange" :current-page="currentPage" />
            </div>
        </div>

        <el-dialog v-model="gradeDialogVisible" title="Grade Assignment">
            <el-form :model="currentSubmission" :rules="gradeRules" ref="gradeFormRef">
                <el-form-item label="Score" prop="Score">
                    <el-input v-model.number="currentSubmission.Score" type="number" min="0" max="100"
                        @input="validateScore" placeholder="Enter a number between 0 and 100">
                    </el-input>
                    <div v-if="scoreError" class="error-message">{{ scoreError }}</div>
                </el-form-item>
                <el-form-item label="Feedback">
                    <el-input v-model="currentSubmission.Feedback" type="textarea" rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="gradeDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submitGrade" :disabled="!!scoreError">Submit</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, putData } from '../controller'
import router from '../router'
import { ElMessage, ElPagination } from 'element-plus'

const courseId = router.currentRoute.value.params.courseId
const section = router.currentRoute.value.params.section
const assignmentId = router.currentRoute.value.params.assignmentId
const submissions = ref([])
const enrolledStudents = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const combinedStudentData = computed(() => {

    // Create a map of submissions by student ID for quick lookup
    const submissionMap = new Map()

    if (Array.isArray(submissions.value)) {
        submissions.value.forEach(submission => {
            if (submission && submission['Student ID']) {
                submissionMap.set(submission['Student ID'], submission)
            }
        })
    }

    // Handle case when enrolled students is empty but we have submissions
    if (!enrolledStudents.value || !Array.isArray(enrolledStudents.value) || enrolledStudents.value.length === 0) {
        if (Array.isArray(submissions.value) && submissions.value.length > 0) {
            return submissions.value.map(submission => ({
                ...submission,
                'Name': submission['Name'] || 'Unknown',
                'Status': 'Submitted'
            }))
        }
        return []
    }

    // Combine enrolled students with their submission data (if exists)
    const result = enrolledStudents.value.map(student => {
        const studentId = student['Student ID']
        const submission = submissionMap.get(studentId)

        if (submission) {
            return {
                ...submission,
                'Name': student['Name'] || 'Unknown',
                'Status': 'Submitted'
            }
        } else {
            return {
                'Student ID': studentId,
                'Name': student['Name'] || 'Unknown',
                'Score': 'N/A',
                'Status': 'Not Submitted'
            }
        }
    })

    return result
})

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return combinedStudentData.value.slice(startIndex, endIndex)
})

const gradeDialogVisible = ref(false)
const currentSubmission = ref({})
const gradeFormRef = ref(null)
const scoreError = ref('')

const gradeRules = {
    Score: [
        { required: true, message: 'Please input a score', trigger: 'blur' },
        { type: 'number', message: 'Score must be a number', trigger: 'blur' },
        { validator: validateScoreRule, trigger: 'blur' }
    ]
}

const userStore = useUserStore()

onMounted(async () => {
    await fetchSubmissions()
    await fetchEnrolledStudents()
})

async function fetchSubmissions() {
    try {
        const response = await fetchData(`/user/courses/${courseId}/${section}/assignments/${assignmentId}/submissions`, userStore.token)

        if (response && response.data) {
            submissions.value = Array.isArray(response.data) ? response.data : []
        } else {
            submissions.value = []
        }
    } catch (error) {
        console.error('Error fetching submissions:', error)
        submissions.value = []
    }
}

async function fetchEnrolledStudents() {
    try {
        const response = await fetchData(`/user/courses/${courseId}/${section}/students`, userStore.token)

        if (response && response.data) {
            enrolledStudents.value = Array.isArray(response.data) ? response.data : []
        } else {
            enrolledStudents.value = []
        }
    } catch (error) {
        console.error('Error fetching enrolled students:', error)
        enrolledStudents.value = []
    }
}

function downloadFile(url) {
    window.open(url, '_blank')
}

function toggleGradeDialog(submission, id) {
    currentSubmission.value = { id, Feedback: submission.Feedback, Score: submission.Score }
    scoreError.value = ''
    gradeDialogVisible.value = true
    // Reset form validation when opening dialog
    nextTick(() => {
        if (gradeFormRef.value) {
            gradeFormRef.value.clearValidate()
        }
    })
}

async function submitGrade() {
    // Validate score before submitting
    if (validateScore(currentSubmission.value.Score)) {
        await putData(`/user/courses/${courseId}/assignments/${assignmentId}/submissions/grading`,
            userStore.token, currentSubmission.value.id, { Score: currentSubmission.value.Score, Feedback: currentSubmission.value.Feedback })
        gradeDialogVisible.value = false
        ElMessage.success('Graded successfully!')
        await fetchSubmissions()
    }
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

function getRowClassName({ row }) {
    return row.Status === 'Submitted' ? 'submitted-row' : 'not-submitted-row'
}

function validateScoreRule(rule, value, callback) {
    if (value === '' || value === null || value === undefined) {
        callback(new Error('Please input a score'))
    } else if (isNaN(Number(value))) {
        callback(new Error('Score must be a number'))
    } else if (Number(value) < 0 || Number(value) > 100) {
        callback(new Error('Score must be between 0 and 100'))
    } else {
        callback()
    }
}

function validateScore(value) {
    if (value === '' || value === null || value === undefined) {
        scoreError.value = 'Please input a score'
        return false
    } else if (isNaN(Number(value))) {
        scoreError.value = 'Score must be a number'
        return false
    } else if (Number(value) < 0 || Number(value) > 100) {
        scoreError.value = 'Score must be between 0 and 100'
        return false
    } else {
        scoreError.value = ''
        return true
    }
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

.submitted-row {
    background-color: rgba(103, 194, 58, 0.05);
}

.not-submitted-row {
    background-color: rgba(245, 108, 108, 0.05);
}

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
}
</style>