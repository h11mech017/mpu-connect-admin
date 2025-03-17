<template>
    <div>
        <el-dialog v-model="itemStore.isAdding">
            <el-form :model="itemStore.formData">
                <el-form-item label="Category">
                    <el-select v-model="itemStore.formData['Category']" @change="itemStore.setSubCategories">
                        <el-option v-for="item in itemStore.categories" :key="item.id" :label="item.Name"
                            :value="item.Name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Description">
                    <el-select v-model="itemStore.formData['Description']">
                        <el-option v-for="item in itemStore.subCategories" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Found Location">
                    <el-select v-model="itemStore.formData['Location']">
                        <el-option v-for="item in itemStore.locations" :key="item.Name" :label="item.Name"
                            :value="item.Name">
                        </el-option>
                    </el-select>
                    <el-input v-model="itemStore.formData['Remark']"></el-input>
                </el-form-item>
                <el-form-item label="Found Date">
                    <el-date-picker v-model="itemStore.formData['Found Date']" type="datetime"
                        placeholder="Pick a date and time" format="DD/MM/YYYY HH:mm:ss" value-format="x">
                    </el-date-picker>
                </el-form-item>
                <!-- Hidden Status field to ensure it's always included -->
                <input type="hidden" v-model="itemStore.formData['Status']" />
                <el-form-item>
                    <el-button type="primary" @click="submitForm">Submit</el-button>
                    <el-button @click="resetForm">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useItemStore } from '../stores/itemStore'
import { useUserStore } from '../stores/userStore';
import { postData } from '../controller';
import { ElMessage } from 'element-plus';

const itemStore = useItemStore()
const userStore = useUserStore()

onMounted(() => {
    // Make a deep copy of the initial form state to ensure all fields are initialized properly
    const initialData = JSON.parse(JSON.stringify(itemStore.initialFormState))
    itemStore.setFormData(initialData)
    console.log('Form initialized with:', JSON.stringify(initialData))
})

const emit = defineEmits(['itemAdded'])

async function submitForm() {
    try {
        // Ensure Status field is included
        if (!itemStore.formData['Status']) {
            itemStore.formData['Status'] = 'Waiting to be claimed'
        }

        itemStore.formData['Found Location'] = itemStore.formData['Location'] + ' ' + itemStore.formData['Remark']
        delete itemStore.formData['Location']
        delete itemStore.formData['Remark']

        const date = new Date(parseInt(itemStore.formData['Found Date']))
        itemStore.formData['Found Date'] = {
            _seconds: Math.floor(date.getTime() / 1000),
            _nanoseconds: (date.getMilliseconds() * 1e6)
        }

        console.log('Submitting form data:', JSON.stringify(itemStore.formData))

        const response = await postData('/admin/lost/item/add', userStore.token, itemStore.formData);
        if (response.status === 200) {
            ElMessage.success('Item added successfully')
            resetForm()
            emit('itemAdded')
            itemStore.setIsAdding(false)
        } else {
            ElMessage.error('Failed to add item')
        }
    } catch (error) {
        ElMessage.error('There was an error adding the item: ' + error.message)
    }
}

function resetForm() {
    // Make a deep copy of the initial form state to ensure all fields are reset properly
    const resetData = JSON.parse(JSON.stringify(itemStore.initialFormState))
    itemStore.setFormData(resetData)
    console.log('Form reset to:', JSON.stringify(resetData))
}


</script>

<style></style>
