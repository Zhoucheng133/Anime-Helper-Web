<template>
  <div class="bg">
    <PageHeader class="header" :login="false" :page-name="'list'" />
    <div class="main">
      <div class="panel">
        <div class="panelTitle">注册</div>
        <div class="panelSubTitle">Hi, 从这里开始吧👋</div>
        <div class="item">
          <div class="itemLabel">用户名</div>
          <a-input size="large" v-model:value="username"></a-input>
        </div>
        <div class="item">
          <div class="itemLabel">密码</div>
          <a-input-password size="large" v-model:value="password"></a-input-password>
        </div>
        <div class="item">
          <div class="itemLabel">重复密码</div>
          <a-input-password size="large" v-model:value="password_again" @pressEnter="register"></a-input-password>
        </div>
        <div class="loginButton" @click="register">注册</div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import PageHeader from '~/components/PageHeader.vue';
import { reqHost, ssrHost } from '~/hooks/network';

let username=ref("");
let password=ref("");
let password_again=ref("");

const {data: response}=await useAsyncData(async ()=>{
  return (await axios.get(`${ssrHost}/api/check`)).data;
})

if(!response.value){
  onMounted(()=>{
    window.location.href='/login';
  })
}

const register=async ()=>{
  if(username.value.length==0){
    message.error("用户名不能为空");
    return;
  }else if(password.value.length==0){
    message.error("密码不能为空");
    return;
  }else if(password_again.value.length==0){
    message.error("重复密码不能为空");
    return;
  }else if(password.value!==password_again.value){
    message.error("两次密码不一致");
    return;
  }

  const response=(await axios.post(`${reqHost}/api/register`,{
    username: username.value,
    password: password.value,
  })).data
  // console.log(response.data);
  if(response.ok==false){
    message.error(response.data.msg);
  }else{
    window.location.href='/login';
    message.success("注册成功");
  }
}
useHead({
  title: 'AnimeHelper | 注册'
})

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
  /* background-color: rgb(240, 240, 240); */
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