<template>
  <div class="head_container" :style="{'justify-content': 'space-between;'}">
    <div class="head_lead">
      <img src="/icon.svg" alt="" width="40px" class="head_icon">
      <div class="head_title">AnimeHelper</div>
    </div>
    <div class="head_menus" v-if="showMenu">
      <div :class="isSelect('list') ? 'head_menuItem_select' : 'head_menuItem' " @click="link('list')">列表</div>
      <div :class="isSelect('bangumi') ? 'head_menuItem_select' : 'head_menuItem' " @click="link('bangumi')">每日放送</div>
      <div :class="isSelect('downloader') ? 'head_menuItem_select' : 'head_menuItem' " style="margin-right: 0;" @click="link('downloader')">下载器</div>
    </div>
    <div class="head_logout" v-if="!isMobile && showMenu" @click="logoutHandler">
      <i class="bi bi-box-arrow-right"></i>
      <div style="margin-left: 5px;">注销</div>
    </div>
    <div class="head_mobile_menu" v-if="isMobile && props.login" @click="showDrawer=true">
      <i class="bi bi-list"></i>
    </div>
    <a-drawer title="菜单" placement="bottom" :open="showDrawer" @close="showDrawer=false" height="500">
      <div :class="isSelect('list') ? 'head_m_item_select':'head_m_item'" @click="link('list')">列表</div>
      <div :class="isSelect('bangumi') ? 'head_m_item_select':'head_m_item'" @click="link('bangumi')">每日放送</div>
      <div :class="isSelect('downloader') ? 'head_m_item_select':'head_m_item'" @click="link('downloader')">下载器</div>
      <div class="head_m_logout" @click="logoutHandler">注销</div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['login', 'pageName']);
const router=useRouter();

// 注销
const logoutHandler=()=>{
  let token=useCookie('token');
  token.value=null;
  window.location.href='/login';
}

// 页面跳转
const link=(path: string)=>{
  if(props.pageName===path){
    return;
  }
  window.location.href=`/${path}`;
}

// 菜单判定
const isSelect=(val: string)=>{
  return val===props.pageName;
}

// 移动端抽屉
let showDrawer=ref(false);

// 显示PC菜单
let showMenu=ref(false);

// 是否为移动端页面
let isMobile=ref(false);

// 判定页面显示布局
function judgeShowMenu(){
  const judgeSize=()=>{
    if(window.innerWidth<800){
      showMenu.value=false;
      isMobile.value=true;
    }else{
      isMobile.value=false;
      if(props.login){
        showMenu.value=true;
      }
    }
  }
  onMounted(()=>{
    judgeSize();
    window.onresize=()=>{
      judgeSize();
    }
  })
}
judgeShowMenu();


</script>

<style>
.head_lead{
  display: flex;
  align-items: center;
  width: 250px;
}
.head_menuItem:hover{
  color: #1677ff;
}
.head_menuItem, .head_menuItem_select{
  margin-right: 20px;
  transition: color linear .2s;
  cursor: pointer;
}
.head_menuItem_select{
  color: lightgrey;
}
.head_m_logout{
  margin-top: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  user-select: none;
  font-size: 16px;
  color: red;
}
.head_m_item_select{
  color: lightgrey;
}
.head_m_item, .head_m_item_select{
  height: 40px;
  display: flex;
  align-items: center;
  user-select: none;
  font-size: 16px;
}
.head_mobile_menu{
  margin-left: auto;
  margin-right: 30px;
  font-size: 25px;
}
.head_logout:hover{
  color: red;
}
.head_logout{
  width: 250px;
  justify-content: end;
  margin-right: 30px;
  display: flex;
  transition: color linear .2s;
  cursor: pointer;
  z-index: 30;
}
.head_menus{
  /* width: 100%; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.head_title{
  margin-left: 20px;
  font-size: 20px;
}
.head_icon{
  margin-left: 30px;
}
.head_container{
  width: 100%;
  height: 80px;
  border-bottom: 2px solid rgb(240, 240, 240);
  display: flex;
  align-items: center;
  background-color: white;
  z-index: 10;
  position: sticky;
  top: 0;
  user-select: none;
}
</style>