<template>
    <div>
        <h2>Course Files</h2>
        <el-button type="primary" @click="triggerFileUpload">
            Upload<el-icon class="el-icon--right">
                <Upload />
            </el-icon>
        </el-button>
        <el-button type="primary" @click="newFolderUpload">
            Create New Folder<el-icon class="el-icon--right">
                <Folder />
            </el-icon>
        </el-button>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
        <p v-if="selectedDirectory">chosen directory: {{ selectedDirectory }}</p>
        <el-tree v-if="fileTree.length" :data="fileTree" :props="defaultProps" node-key="path" @node-click="handleNodeClick" class="file-tree, table-container">
            <template #default="{ node, data }">
                <span>{{ data.name }}</span>
                <el-text v-if="data.type === 'file'" type="link" @click.stop="downloadFile(data.downloadUrl)"
                    class="link">Download</el-text>
                <el-text v-if="data.type === 'file'" type="link" @click.stop="confirmDeleteFile(data.path)"
                    class="link">Delete</el-text>
            </template>
        </el-tree>
        <div v-else class="empty-message">No course files available.</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, uploadFile, deleteFile } from '../controller'
import { ElTree, ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Upload } from '@element-plus/icons-vue'
import router from '../router'

const courseId = router.currentRoute.value.params.courseId
const courseFiles = ref([])
const fileTree = ref([])
const fileInput = ref(null)
const selectedDirectory = ref('')

const userStore = useUserStore()

const defaultProps = {
    children: 'children',
    label: 'name'
}

onMounted(async () => {
    await fetchCourseFiles()
})

async function fetchCourseFiles() {
    try {
        if (!courseId) {
            throw new Error('Course ID is missing')
        }
        const response = await fetchData(`/user/courses/${courseId}/files`, userStore.token)
        if (response && response.data) {
            courseFiles.value = response.data
            fileTree.value = buildFileTree(courseFiles.value, courseId)
        } else {
            ElMessage.error('Failed to fetch course files')
        }
    } catch (error) {
        console.error('Failed to fetch course files:', error)
    }
}

function buildFileTree(files, courseId) {
    const tree = []
    const map = {}

    files.forEach(file => {
        const parts = file.path.split('/').filter(part => part && part !== `courses` && part !== courseId)
        let currentLevel = tree

        parts.forEach((part, index) => {
            if (!map[part]) {
                const node = {
                    name: part,
                    path: parts.slice(0, index + 1).join('/'),
                    type: index === parts.length - 1 ? file.type : 'directory',
                    downloadUrl: file.downloadUrl,
                    children: []
                }
                map[part] = node
                currentLevel.push(node)
            }
            currentLevel = map[part].children
        })
    })

    return tree
}

function handleNodeClick(data) {
    if (data.type === 'directory') {
        selectedDirectory.value = data.path
    } else if (data.type === 'file') {
        window.open(data.downloadUrl, '_blank')
    }
}

function downloadFile(url) {
    window.open(url, '_blank')
}

async function handleFileDelete(filepath) {
    const response = await deleteFile(`/user/courses/${courseId}/files/delete`, userStore.token, filepath)

    if (response.status === 200) {
        ElMessage.success('File deleted successfully')
        setTimeout(async () => {
            await fetchCourseFiles()
        }, 2000)
    } else {
        ElMessage.error('Failed to delete file')
    }
}

async function confirmDeleteFile(filepath) {
    try {
        await ElMessageBox.confirm(
            'Are you sure you want to delete this file?',
            'Warning',
            {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning',
            }
        ).then(async () => {
            await handleFileDelete(filepath)
        })
    } catch (error) {
        console.log('Delete canceled: ', error)
    }
}

async function newFolderUpload() {
    await ElMessageBox.confirm(
        'Do you want to create a new folder?',
        {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            beforeClose: async (action, instance, done) => {
                if (action === 'confirm') {
                    if (selectedDirectory.value === '') {
                        selectedDirectory.value = 'course_materials'
                    }
                    await createNewDirectory()
                    await fileInput.value.click()
                    done()
                } else {
                    done()
                }
            }
        }
    )
}

function triggerFileUpload() {
    if (!selectedDirectory.value) {
        ElMessage.error('Please click on the directory you want to upload the file to')
        return
    }
    fileInput.value.click()
}

async function createNewDirectory() {
    await ElMessageBox.prompt('Enter the name of the new folder', 'New Folder', {
        confirmButtonText: 'Create',
        cancelButtonText: 'Cancel',
    }).then(async ({ value }) => {
        if (value) {
            selectedDirectory.value = selectedDirectory.value + '/' + value
        }
    })
}

async function handleFileChange(event) {
    const file = event.target.files[0]
    if (userStore.role !== 'Teacher') {
        console.error('You are not authorized to upload files')
        return
    }
    if (file) {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('directory', selectedDirectory.value)

            const response = await uploadFile(`/user/courses/${courseId}/files/upload`, userStore.token, formData)
            if (response.status === 200) {
                ElMessage.success('File uploaded successfully')
                setTimeout(async () => {
                    await fetchCourseFiles()
                }, 2000)
            } else {
                throw new Error('Failed to upload file')
            }
        } catch (error) {
            console.error('Failed to upload file:', error)
        }
    }
}
</script>

<style scoped>
.file-tree {
    width: 500px;
    padding: 20px;
    margin: 0 auto;
}

.link {
    margin: 10px;
    text-decoration: underline;
}

.empty-message {
    text-align: center;
    padding: 20px;
    color: #999;
}
</style>