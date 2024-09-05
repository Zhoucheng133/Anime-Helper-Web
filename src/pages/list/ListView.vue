<template>
  <a-float-button @click="addHandler">
    <template #icon>
      <PlusOutlined />
    </template>
  </a-float-button>
  <Header></Header>
  <div class="body">
    <a-table :dataSource="dataSource" :columns="columns" :pagination="false" size="small" :scroll="{ x: 500 }" sticky>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'progress'">
          <a-progress :percent="record.now/record.episode*100" :showInfo="false" />
        </template>
        <template v-else-if="column.key === 'op'">
          <a>编辑</a>
          <a style="margin-left: 10px;">添加到下载器</a>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag color="green" v-if="record.onUpdate">更新中</a-tag>
          <a-tag v-else>已完结</a-tag>
        </template>
        <template v-else-if="column.key === 'title'">
          <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ record.title }}</div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { baseURL } from '@/stores/network';
import { PlusOutlined } from "@ant-design/icons-vue";
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

document.title="AnimeHelper | 列表";

let dataSource=ref([]);
const token=localStorage.getItem("token");
const router=useRouter();
if(!token){
  router.replace("/login")
}

onMounted(async ()=>{
  const response=(await axios.get(`${baseURL}/api/list`, {
    headers: {
      "token": token,
    }
  })).data;
  if(response.ok){
    dataSource.value=response.msg;
  }
})

const addHandler=()=>{

}
const columns=[
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
    width: 200,
  },
  {
    title: "状态",
    dataIndex: 'status',
    key: 'status',
    width: 70,
  },
  {
    title: "集数",
    dataIndex: 'episode',
    key: 'episode',
    width: 70,
  },
  {
    title: "看至",
    dataIndex: 'now',
    key: 'now',
    width: 70,
  },
  {
    title: "进度",
    dataIndex: 'progress',
    key: 'progress',
    width: 100,
  },
  {
    title: "操作",
    dataIndex: 'op',
    key: 'op',
    width: 180
  },
]

</script>

<style scoped>
.bi{
  color: #1677ff;
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