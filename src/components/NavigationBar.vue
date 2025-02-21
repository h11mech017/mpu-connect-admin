<template>
  <div v-if="role === 'Admin'">
    <el-row>
      <el-menu active-text-color="#ffd04b" class="menu" default-active="2" text-color="#fff" :router="true">
        <el-menu-item index="/events">
          <el-icon>
            <Calendar />
          </el-icon>
          <span>Events</span>
        </el-menu-item>
        <el-menu-item index="/parking">
          <el-icon>
            <Document />
          </el-icon>
          <span>Parking Application</span>
        </el-menu-item>
        <el-menu-item index="/lost-and-found">
          <el-icon>
            <Box />
          </el-icon>
          <span>Lost and Found</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
  <div v-else-if="role === 'Teacher'">
    <el-row>
      <el-menu active-text-color="#ffd04b" class="menu" default-active="2" text-color="#fff" :router="true">
        <el-menu-item index="/courses">
          <el-icon>
            <List />
          </el-icon>
          <span>Courses</span>
        </el-menu-item>
        <el-menu-item :index="{ path: `/courses/${courseStore.courseId}/${courseStore.section}/announcements` }">
          <el-icon>
            <Bell />
          </el-icon>
          <span>Announcements</span>
        </el-menu-item>
        <el-menu-item :index="{ path: `/courses/${courseStore.courseId}/${courseStore.section}/files` }">
          <el-icon>
            <Folder />
          </el-icon>
          <span>Files</span>
        </el-menu-item>
        <el-menu-item :index="{ path: `/courses/${courseStore.courseId}/${courseStore.section}/assignments` }">
          <el-icon>
            <Memo />
          </el-icon>
          <span>Assignments</span>
        </el-menu-item>
        <el-menu-item :index="{ path: `/courses/${courseStore.courseId}/${courseStore.section}/attendance` }">
          <el-icon>
            <Checked />
          </el-icon>
          <span>Attendance</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
</template>

<script setup>
import { Document, Bell, Folder, Memo, Checked, Box, Calendar, List } from '@element-plus/icons-vue'
import { defineProps } from 'vue'
import { useCourseStore } from '../stores/courseStore';

const props = defineProps({
  role: {
    type: String,
    required: true
  }
})

const courseStore = useCourseStore()
</script>

<style scoped>
.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 25vh;
  height: 100vh;
  background-color: green;
  z-index: 1000;
}
</style>