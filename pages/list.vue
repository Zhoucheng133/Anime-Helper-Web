<template>
  <PageHeader class="header" :login="true" :page-name="'list'" />
  <div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';
import init from '~/hooks/init';
import { getList, type bangumiItem } from '~/hooks/list';

let list=ref<bangumiItem[]>([]);
useHead({
  title: 'AnimeHelper | 列表'
})

const islogin=await init();
if(!islogin){
  onMounted(()=>{
    window.location.href='/login';
  })
}else{
  list.value=(await getList()).reverse();
}

</script>