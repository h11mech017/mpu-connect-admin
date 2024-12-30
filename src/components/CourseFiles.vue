<template>
    <div>
        <h2>Course Files</h2>
        <el-button type="primary" @click="triggerFileUpload">
            Upload<el-icon class="el-icon--right">
                <Upload />
            </el-icon>
        </el-button>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
        <p v-if="selectedDirectory">chosen directory: {{ selectedDirectory }}</p>
        <el-tree :data="fileTree" :props="defaultProps" node-key="path" @node-click="handleNodeClick" class="file-tree">
            <template #default="{ node, data }">
                <span>{{ data.name }}</span>
                <el-text v-if="data.type === 'file'" type="link" @click.stop="downloadFile(data.downloadUrl)"
                    class="download-link">Download</el-text>
            </template>
        </el-tree>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { fetchData, uploadFile } from '../controller'
import { ElTree, ElButton, ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import router from '../router'

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
        const courseId = router.currentRoute.value.params.courseId
        if (!courseId) {
            throw new Error('Course ID is missing')
        }
        const response = await fetchData(`/user/courses/${courseId}/files`, userStore.token)
        if (response && response.data) {
            courseFiles.value = response.data
            fileTree.value = buildFileTree(courseFiles.value, courseId)
            console.log("course files Value: ", courseFiles.value)
        } else {
            throw new Error('Failed to load course files')
        }
    } catch (error) {
        console.error('Failed to load course files:', error)
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

function triggerFileUpload() {
    if (!selectedDirectory.value) {
        ElMessage.error('Please click on the directory you want to upload the file to')
        return
    }
    fileInput.value.click()
}

async function handleFileChange(event) {
    const file = event.target.files[0]
    if (userStore.role !== 'Teacher') {
        console.error('You are not authorized to upload files')
        return
    }
    if (file) {
        try {
            const courseId = router.currentRoute.value.params.courseId
            const formData = new FormData()
            formData.append('file', file)
            formData.append('directory', selectedDirectory.value)

            const response = await uploadFile(`/user/courses/${courseId}/files/upload`, userStore.token, formData)
            if (response) {
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

.download-link {
    margin: 10px;
    text-decoration: underline;
}
</style>