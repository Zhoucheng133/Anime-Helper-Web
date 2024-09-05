<template>
  <Header></Header>
  <div class="body" v-if="!loading">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="0" header="星期日">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[0]" :key="index">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="1" header="星期一">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[1]" :key="index">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="星期二">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[2]" :key="index">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="星期三">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[3]" :key="index">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="4" header="星期四">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[4]" :key="index">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="5" header="星期五">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[5]" :key="index">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="6" header="星期六">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[6]" :key="index">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <InnerLoadingView v-else/>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import InnerLoadingView from '../loading/InnerLoadingView.vue';
import { baseURL } from '@/stores/network';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { testData } from '@/test/bangumi';

document.title="AnimeHelper | 每日更新";
let list=ref<string[][]>([]);

const activeKey=ref([0, 1, 2, 3, 4, 5, 6]);

const token=localStorage.getItem("token");
const router=useRouter();
if(!token){
  router.replace("/login")
}
let loading=ref(true);

onMounted(async ()=>{
  // 下面是正式内容
  // const response=(await axios.get(`${baseURL}/api/calendar`, {
  //   headers: {
  //     token: localStorage.getItem("token")
  //   }
  // })).data
  // if(response.ok){
  //   list.value=response.msg;
  // }else{
  //   message.error("请求失败")
  // }
  // 下面这行是测试用代码
  list.value=testData;
  loading.value=false;
  
})


</script>

<style scoped>
.item{
  font-size: 15px;
  user-select: none;
  /* padding: 5px; */
  cursor: pointer;
}
.body{
  margin: auto;
  width: 1000px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
}
@media screen and (max-width: 1000px) {
  .body {
    width: 100%
  }
}
</style>