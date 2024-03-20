<template>
  <el-tabs v-model="activeTab" type="border-card">
    <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
      <!-- 标签页内容 -->
      {{ tab.label }} 的内容
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, defineProps } from 'vue';

// 标签页数据
const { tabs, activeTab } = defineProps();

</script>
