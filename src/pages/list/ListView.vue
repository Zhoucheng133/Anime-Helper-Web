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
  <a-modal v-model:open="showOpen" title="添加一个新的番剧" @ok="handleOk" centered>
    <div class="modalContent">
      <a-input placeholder="番剧标题" v-model:value="add_title"></a-input>
      <a-checkbox style="margin-top: 10px;" v-model:checked="add_onUpdate">当前在更新</a-checkbox>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">集数</div>
        <a-input-number v-model:value="add_episodes"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">观看至</div>
        <a-input-number v-model:value="add_now" :min="1" :max="add_episodes"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;" v-show="add_onUpdate">
        <div style="margin-right: 10px;">更新日期</div>
        <a-select v-model:value="add_weekday">
          <a-select-option :value="0">星期日</a-select-option>
          <a-select-option :value="1">星期一</a-select-option>
          <a-select-option :value="2">星期二</a-select-option>
          <a-select-option :value="3">星期三</a-select-option>
          <a-select-option :value="4">星期四</a-select-option>
          <a-select-option :value="5">星期五</a-select-option>
          <a-select-option :value="6">星期六</a-select-option>
        </a-select>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { baseURL } from '@/stores/network';
import { PlusOutlined } from "@ant-design/icons-vue";
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

document.title="AnimeHelper | 列表";

let add_title=ref("");
let add_onUpdate=ref(false);
let add_now=ref(1);
let add_episodes=ref(12);
let add_weekday=ref(0);

const showOpen=ref(false);
const handleOk=()=>{
  showOpen.value=false;
}

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
  showOpen.value=true;
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
.modalContent{
  display: flex;
  flex-direction: column;
}
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