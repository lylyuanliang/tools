<template>
  <el-container>
    <el-aside >
      <Aside></Aside>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Aside from '@/components/layout/Aside.vue'
</script>