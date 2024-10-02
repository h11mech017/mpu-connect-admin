<template>
    <div>
        <el-dialog v-model="itemStore.isClaiming">
            <el-form :model="itemStore.formData">
                <el-form-item label="Claimant ID">
                    <el-input v-model="itemStore.formData['Claimant ID']"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">Claim</el-button>
                    <el-button @click="resetForm">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useItemStore } from '../stores/itemStore'
import { useUserStore } from '../stores/userStore'
import { putData } from '../controller'
import { ElMessage } from 'element-plus'

const itemStore = useItemStore()
const userStore = useUserStore()

onMounted(() => {
    itemStore.setFormData({
        'Claimant ID': '',
    })

})

const emit = defineEmits(['itemClaimed'])

async function submitForm() {
    try {
        console.log(itemStore.formData);
        const response = await putData('/admin/lost/item/claim', userStore.token, itemStore.itemId, itemStore.formData)
        if (response.status === 200) {
            ElMessage.success('Item claimed successfully')
        } else {
            ElMessage.error('Failed to claim item')
        }
        resetForm()
        emit('itemClaimed')
        itemStore.setIsClaiming(false)
    } catch (error) {
        ElMessage.error('There was an error claim the item: ' + error.message)
    }
}

function resetForm() {
    itemStore.setFormData({ ...itemStore.initialFormState });
}


</script>

<style></style>
