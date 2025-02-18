<template>
    <el-row>
      <el-menu
        active-text-color="#ffd04b"
        class="menu"
        default-active="2"
        text-color="#fff"
        :router="true"
      >
        <el-menu-item index="/products">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>Products</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><Box /></el-icon>
          <span>Orders</span>
        </el-menu-item>
        <el-menu-item index="/stores">
          <el-icon><Shop /></el-icon>
          <span>Stores</span>
        </el-menu-item>
        <el-menu-item index="/staffs">
          <el-icon><UserFilled /></el-icon>
          <span>Staffs</span>
        </el-menu-item>
        <el-menu-item index="/customers">
          <el-icon><User /></el-icon>
          <span>Customers</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </template>
  
  <script setup>
  import { Goods, Box, Shop, UserFilled, User } from '@element-plus/icons-vue'
  </script>
  
  <style scoped>
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 40vh;
    height: 100vh;
    background-color: #1a1a2c;
  }
  </style>