<template>
  <div class="bg">
    <div class="topbar">
      <div class="title">AnimeGo</div>
      <div class="menu">
        <div class="menuItem" style="margin-right: 20px;">列表</div>
        <div class="menuItem" style="margin-right: 20px;">本季度番剧表</div>
        <div class="menuItem">下载器</div>
      </div>
      <div class="tools">注销</div>
    </div>
  </div>
</template>

<script setup lang="ts">
document.title="AnimeGo | 主页"
</script>

<style scoped>
.menu{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tools{
  margin-left: auto;
  width: 150px;
  text-align: right;
  
}
.title {
  font-size: 20px;
  width: 150px;
}

.topbar {
  width: 100vw;
  height: 100%;
  border-bottom: 2px solid rgb(240, 240, 240);
  display: flex;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}

.bg {
  width: 100vw;
  height: 100vh;
  display: grid;
  /* grid-r: 100px 1fr; */
  grid-template-rows: 80px 1fr 80px;
  user-select: none;
}
</style>