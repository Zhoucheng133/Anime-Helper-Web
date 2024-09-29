<template>
  <div class="bg">
    <PageHeader class="header" :login="false" :page-name="'list'" />
    <div class="main">
      <div class="panel">
        <div class="panelTitle">登录</div>
        <div class="panelSubTitle">Hi, 欢迎回来👋</div>
        <div class="item">
          <div class="itemLabel">用户名</div>
          <a-input size="large" v-model:value="username"></a-input>
        </div>
        <div class="item">
          <div class="itemLabel">密码</div>
          <a-input-password size="large" v-model:value="password" @pressEnter="loginHandler"></a-input-password>
        </div>
        <div class="loginButton" @click="loginHandler">登录</div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import PageHeader from '~/components/PageHeader.vue';
import { ssrHost } from '~/store/network';

const router=useRouter();

useHead({
  title: 'AnimeHelper | 登录'
})

const {data: response}=await useAsyncData(async ()=>{
  return (await axios.get(`${ssrHost}/api/check`)).data;
})

if(response.value){
  onMounted(()=>{
    window.location.href='/register';
  })
}


let username=ref("");
let password=ref("");

const loginHandler=()=>{
  // TODO 登录
}

</script>

<style scoped>
.createAcc:hover{
  color: #1161d0;
}
.createAcc{
  color: #1677ff;
  cursor: pointer;
  transition: color linear .2s;
}
.regTip{
  display: flex;
  justify-content: center;
  margin-top: 20px;
  color: grey;
}
.loginButton:hover{
  background-color: #1161d0;
}
.loginButton{
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1677ff;
  color: white;
  margin-top: 30px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color linear .2s;
}
.row{
  display: flex;
  margin-top: 30px;
}
.itemLabel {
  margin-bottom: 10px;
}

.item {
  margin-top: 20px;
}

.panelSubTitle {
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.panelTitle {
  font-size: 30px;
  font-weight: bold;
}

.panel {
  width: 400px;
}

@media screen and (max-width: 500px) {
  .panel {
    width: calc(100vw - 100px);
  }
}

.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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