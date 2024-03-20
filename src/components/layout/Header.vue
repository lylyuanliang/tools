<template>
  <div class="icon">
    <el-icon v-if="show" @click="change">
      <Fold />
    </el-icon>
    <el-icon v-else @click="change">
      <Expand />
    </el-icon>
  </div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{current.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>

  <div class="right">
    <el-icon>
      <Message />
    </el-icon>
    <el-avatar :size="30" :src="circleUrl" />
    <el-dropdown>
			<span class="el-dropdown-link">
				设置
				<el-icon class="el-icon--right">
					<arrow-down />
				</el-icon>
			</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>设置账号</el-dropdown-item>
          <el-dropdown-item>更改头像</el-dropdown-item>
          <el-dropdown-item @click="exit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

</template>

<script setup lang="ts">
import { ref, reactive, toRefs, computed } from 'vue'
import { layoutStore } from '@/store/layout.js'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const current = computed(() => {
  return router.currentRoute.value
})
console.log(router.currentRoute.value)
const store = layoutStore();
const show = ref(true)
const change = function () {
  show.value = !show.value;
  store.changeisCollapse();
}
const state = reactive({
  circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})
const { circleUrl } = toRefs(state)

const exit = function () {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.title {
  width: 100px;
  margin: -22px 0px 0 28px;

}

.icon {
  margin-top: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  padding-right: 10px;
  width: 110px;
  justify-content: space-between;
  align-items: center;
  float: right;
  margin-top: -32px;

  .el-icon--right {
    display: none;
  }
}
</style>