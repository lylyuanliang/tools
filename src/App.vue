<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style scoped>
html, body {
  height: 100%;
  margin: 0px;
  background:#000
}

#app {
  height:100%;
  width:100%;
}
</style>

<script>
export default {
  name: 'App'
}
</script>