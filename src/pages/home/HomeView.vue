<template>
  <div class="topbar">
    <img src="../../assets/icon.svg" alt="" width="40px">
    <div class="title">AnimeHelper</div>
  </div>
  <div class="body">
    hello?
  </div>
</template>

<script setup lang="ts">
document.title="AnimeHelper | 主页"
</script>

<style scoped>
.body{
  margin: auto;
  width: 1000px;
}
@media screen and (max-width: 1000px) {
  .body {
    width: 100%
  }
}
.title {
  font-size: 20px;
  margin-left: 20px;
}

.topbar {
  width: 100%;
  height: 80px;
  border-bottom: 2px solid rgb(240, 240, 240);
  display: flex;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
  position: sticky;
  top: 0;
  background-color: white;
}
</style>