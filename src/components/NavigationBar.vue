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
        <el-menu-item index="/lockers">
          <el-icon>
            <Key />
          </el-icon>
          <span>Lockers</span>
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
import { Document, Bell, Folder, Memo, Checked, Box, Calendar, List, Key } from '@element-plus/icons-vue'
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
  top: 12vh;
  left: 0;
  width: 24vh;
  height: calc(100vh - 12vh);
  background-color: #f0f2f5;
  z-index: 100;
  box-shadow: var(--shadow-md);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 16px;
}

:deep(.el-menu) {
  border-right: none;
  background-color: transparent;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 8px 12px;
  border-radius: var(--border-radius-md);
  color: var(--text-dark);
  transition: all var(--transition-speed) ease;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--primary-color);
  color: var(--text-light);
}

:deep(.el-menu-item:hover) {
  background-color: rgba(29, 139, 78, 0.1);
}

:deep(.el-menu-item.is-active:hover) {
  background-color: var(--primary-light);
}

:deep(.el-menu-item .el-icon) {
  margin-right: 12px;
  font-size: 18px;
  color: inherit;
}

:deep(.el-menu-item span) {
  font-weight: 500;
}
</style>