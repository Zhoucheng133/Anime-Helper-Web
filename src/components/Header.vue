<template>
  <div class="topbar">
    <div class="lead">
      <img src="../assets/icon.svg" alt="" width="40px">
      <div class="title">AnimeHelper</div>
    </div>
    <div class="menus" v-show="!isMobile">
      <div :class="isSelect('list') ? 'menuItem_select':'menuItem'" style="margin-left: 0;" @click="link('list')">列表</div>
      <div :class="isSelect('bangumi') ? 'menuItem_select':'menuItem'" @click="link('bangumi')">每日放送</div>
      <div :class="isSelect('downloader') ? 'menuItem_select':'menuItem'" @click="link('downloader')">下载器</div>
    </div>
    <div class="logout" v-show="!isMobile" @click="logoutHandler">
      <i class="bi bi-box-arrow-right"></i>
      <div class="logoutLabel">注销</div>
    </div>
    <div class="menuFold" v-show="isMobile">
      <i class="bi bi-arrow-down-short"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router=useRouter();

const page=window.location.pathname;
const logoutHandler=()=>{
  localStorage.clear();
  router.push("/login");
}

const link=(path: string)=>{
  if(page.includes(path)){
    return;
  }
  router.push(`/${path}`);
}

const isSelect=(name: string): boolean=>{
  if(page.includes(name)){
    return true;
  }
  return false;
}


let isMobile=ref(false);

const judge=()=>{
  if(window.innerWidth<800){
    isMobile.value=true;
  }else{
    isMobile.value=false;
  }
}
window.onresize=()=>{
  judge();
}

onMounted(()=>{
  judge();
})
</script>

<style scoped>
.menuItem_select{
  color: lightgrey;
}
.menuFold{
  margin-left: auto;
  display: flex;
  width: 100px;
  justify-content: end;
  font-size: 30px;
}
.menuItem, .menuItem_select{
  margin-left: 20px;
  transition: color linear .2s;
}
.menuItem{
  cursor: pointer;
}
.menuItem:hover{
  color: #1677ff;
}
.menus{
  user-select: none;
  display: flex;
  margin: auto
}
.logout:hover{
  color: red;
  cursor: pointer;
}
.logoutLabel{
  margin-left: 5px;
}
.lead{
  user-select: none;
  width: 100px;
  display: flex;
  align-items: center;
}
.logout{
  transition: color linear .2s;
  display: flex;
  width: 100px;
  justify-content: end;
  user-select: none;
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
  z-index: 10;
}
</style>