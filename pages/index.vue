<template>
  <div></div>
</template>

<script setup lang="ts">
import init from '~/hooks/init';

useHead({
  title: '加载中...',
})

const islogin=await init();
if(islogin){
  onMounted(()=>{
    window.location.href='/list';
  })
}else{
  onMounted(()=>{
    window.location.href='/login';
  })
}
</script>