<template>
  <div class="bg">
    <div class="topbar">
      <img src="../../assets/icon.svg" alt="" width="40px">
      <div class="title">AnimeHelper | 登录</div>
    </div>
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
          <a-input-password size="large" v-model:value="password"></a-input-password>
        </div>
        <div class="loginButton" @click="loginHandler">登录</div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { baseURL } from '@/stores/network';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

document.title = "AnimeHelper | 登录";

let username=ref("");
let password=ref("");

const router=useRouter();

const loginHandler=async ()=>{
  if(username.value.length==0){
    message.error("用户名不能为空");
    return;
  }else if(password.value.length==0){
    message.error("密码不能为空");
    return;
  }
  const response=(await axios.post(`${baseURL}/api/login`, {
    username: username.value,
    password: password.value,
  })).data;

  if(response.ok){
    localStorage.setItem("token", response.msg);
    router.push("/");
  }else{
    message.error(`登录失败: ${response.msg}`);
  }
  
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

.title {
  font-size: 20px;
  margin-left: 20px;
}

.topbar {
  width: 100vw;
  height: 100%;
  border-bottom: 2px solid rgb(240, 240, 240);
  display: flex;
  align-items: center;
  padding-left: 30px;
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
