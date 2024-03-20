<template>
  <el-row class="tac">
    <el-col :span="16">
      <h5 class="mb-2">Default colors</h5>
      <el-menu
        active-text-color="#0100FF"
        :default-active="[defaultActiveRoute]"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        router
      >
        <template v-for='item in allRoutes' :key='item.path'>
          <template v-if='!item.hidden'>
            <template v-if='item.children.length === 1'>
              <el-menu-item :index='item.path+`/index`'>
                <i class="iconfont" :class="item.children[0].meta.icon"></i>
                {{ item.children[0].meta.title }}
              </el-menu-item>
            </template>
            <el-sub-menu v-if='item.children.length > 1' :index='item.path'>
              <template #title>
                <i class="iconfont" :class="item.meta.icon"></i>
                <span>{{ item.meta.title }}</span>
              </template>
              <el-menu-item-group v-for='child in item.children' :key='child.path'>
                <el-menu-item :index="item.path+`/`+child.path">
                  <i class="iconfont" :class='child.meta.icon'></i>
                  {{ child.meta.title }}
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </template>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting
} from '@element-plus/icons-vue'

import { useRouter } from 'vue-router'

interface RouteItem {
  path: string;
  meta?: {
    defaultActive?: boolean;
  };
  children?: RouteItem[];
}

// 递归查找默认激活路径的函数
const findDefaultActiveRoute = (routes: RouteItem[]): string => {
  for (const route of routes) {
    if (route.meta?.defaultActive === true) {
      return route.path;
    }
    if (route.children && route.children.length > 0) {
      const childPath = findDefaultActiveRoute(route.children);
      if (childPath) {
        return route.path + childPath;
      }
    }
  }
  return '';
};

const allRoutes = useRouter().options.routes

// 调用函数获取默认激活路径
const defaultActiveRoute = findDefaultActiveRoute(allRoutes);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
