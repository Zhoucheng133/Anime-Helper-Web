<template>
  <div></div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ssrHost } from '~/store/network';

useHead({
  title: '加载中...',
})
const router=useRouter();
const token=useCookie('token');

if(token.value){
  const {data: response} = await useAsyncData(async ()=>{
    return (await axios.get(`${ssrHost}/api/auth`, {
      headers: {
        token: token.value,
      }
    })).data;
  })
  if(response.value.ok){
    onMounted(()=>{
      window.location.href='/list';
    })
  }else{
    onMounted(()=>{
      window.location.href='/login';
    })
  }
}else{
  onMounted(()=>{
    window.location.href='/login';
  })
}
</script>