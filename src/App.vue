<template>
  <LoadingView v-if="loading" />
  <RouterView v-else />
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {useRouter} from "vue-router"
import { RouterView } from 'vue-router'
import LoadingView from './pages/loading/LoadingView.vue';
import axios from 'axios';
import { baseURL } from './stores/network';
import { message } from 'ant-design-vue';
const router=useRouter();
let loading=ref(true);
document.title="加载中"
onMounted(async ()=>{
  let token=localStorage.getItem("token");
  if(token!==null){
    const response=(await axios.get(`${baseURL}/api/auth`, {
      headers: {
        "token": token,
      }
    })).data;
    if(response.ok){
      if(window.location.pathname==="/login" || window.location.pathname==="/register"){
        router.push("/home");
      }

      loading.value=false;
    }else{
      message.error(`自动登录失败: ${response.msg}`);
      localStorage.clear();
      const local=(await axios.get(`${baseURL}/api/check`)).data;
      if(local){
        router.push("/register");
        loading.value=false;
      }else{
        router.push("/login");
        loading.value=false;
      }
    }
  }else{
    const local=(await axios.get(`${baseURL}/api/check`)).data;
    if(local){
      router.push("/register");
      loading.value=false;
    }else{
      router.push("/login");
      loading.value=false;
    } 
  }
})

</script>

<style>
#app{
  font-family: "Gill Sans", sans-serif;
}
</style>