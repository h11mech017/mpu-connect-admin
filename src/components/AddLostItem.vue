<template>
    <div>
        <el-dialog v-model="itemStore.isAdding">
            <el-form :model="itemStore.formData">
                <el-form-item label="Category">
                    <el-input v-model="itemStore.formData['Category']"></el-input>
                </el-form-item>
                <el-form-item label="Description">
                    <el-select v-model="ha"></el-select>
                </el-form-item>
                <el-form-item label="Found Location">
                    <el-input v-model="itemStore.formData['Location']"></el-input>
                    <el-input v-model="itemStore.formData['Remark']"></el-input>
                </el-form-item>
                <el-form-item label="Found Date">
                    <el-date-picker v-model="itemStore.formData['Found Date']" type="datetime"
                        placeholder="Pick a date and time" format="YYYY/MM/DD hh:mm:ss" value-format="x">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">Submit</el-button>
                    <el-button @click="resetForm">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useItemStore } from '../stores/itemStore'
import { postData } from '../controller';

const itemStore = useItemStore()

onMounted(() => {
    itemStore.setInitialFormState({
        'Category': '',
        'Description': '',
        'Found Location': '',
        'Found Date': '',
    })
    itemStore.setFormData({ ...itemStore.initialFormState });


})

async function submitForm() {
    try {
        itemStore.formData['Found Location'] = itemStore.formData['Location'] + ' ' + itemStore.formData['Remark']
        delete itemStore.formData['Location']
        delete itemStore.formData['Remark']
        const response = await postData('/admin/lost/item/add', itemStore.formData);
        if (response.status === 200) {
            ElMessage.success('Item added successfully');
        } else {
            ElMessage.error('Failed to add item');
        }
        itemStore.setIsAdding(false);
    } catch (error) {
        ElMessage.error('Failed to add item');
    }
}

function resetForm() {
    itemStore.setFormData({ ...itemStore.initialFormState });
}

</script>

<style></style>
