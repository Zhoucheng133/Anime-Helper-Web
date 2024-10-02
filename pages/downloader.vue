<template>
  <PageHeader class="header" :login="true" :page-name="'downloader'" />
  <div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';
import type { DownloaderForm } from '~/hooks/dl';
import init from '~/hooks/init';

let status=ref(false);
let formData=ref<DownloaderForm>({
  ariaLink: '',
  ariaSecret: '',
  bangumi: [],
  exclusions: [],
  freq: 0,
  type: ''
})

useHead({
  title: 'AnimeHelper | 下载器'
})

const islogin=await init();
if(!islogin){
  onMounted(()=>{
    window.location.href='/login';
  })
}else{
  // followList.value=await initList();
  // list.value=await initUpdates();
}


</script>