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
      <a-checkbox style="margin-top: 10px;" v-model:checked="add_onUpdate" @change="changeUpdate">当前在更新</a-checkbox>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">集数</div>
        <a-input-number v-model:value="add_episodes" :min="1"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">观看至</div>
        <a-input-number v-model:value="add_now" :min="1" :max="judge()"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;" v-show="add_onUpdate">
        <div style="margin-right: 10px;">更新至</div>
        <a-input-number v-model:value="add_updateTo" :min="1" :max="add_episodes"></a-input-number>
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
import { message } from 'ant-design-vue';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

document.title="AnimeHelper | 列表";

let add_title=ref("");
let add_onUpdate=ref(false);
let add_now=ref(1);
let add_episodes=ref(12);
let add_weekday=ref(0);
let add_updateTo=ref(1);

const showOpen=ref(false);

const changeUpdate=()=>{
  add_now.value=1;
}

export interface BangumiItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  onUpdate: boolean,
  time: string,
}

const judge=()=>{
  if(add_onUpdate.value){
    return add_episodes.value>add_updateTo.value?add_updateTo.value:add_episodes.value;
  }else{
    return add_episodes.value;
  }
}

function resetToMidnight(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// 获取某一周的指定星期几的时间戳
function getTimestampOfFirstEpisode(todayTimestamp: number, releaseDay: number, episodesReleased: number): number {
  const today = resetToMidnight(new Date(todayTimestamp));
  const daysPassed = (episodesReleased - 1) * 7;
  const currentDay = today.getDay();
  const offset = (currentDay - releaseDay + 7) % 7;
  const daysSinceFirstEpisode = daysPassed + offset;
  const firstEpisodeDate = new Date(today.getTime() - daysSinceFirstEpisode * 24 * 60 * 60 * 1000);
  return firstEpisodeDate.getTime();
}

// 计算截至到今天的已更新集数
function calculateEpisodesReleased(todayTimestamp: number, releaseDay: number, firstEpisodeTimestamp: number): number {
  const firstEpisodeDate = new Date(firstEpisodeTimestamp);
  const daysSinceFirstEpisode = Math.floor((todayTimestamp - firstEpisodeDate.getTime()) / (24 * 60 * 60 * 1000));
  const weeksSinceFirstEpisode = Math.floor(daysSinceFirstEpisode / 7);
  const today = new Date(todayTimestamp);
  const isTodayReleaseDay = today.getDay() === releaseDay;
  return weeksSinceFirstEpisode + (isTodayReleaseDay ? 1 : 0);
}


const handleOk=async ()=>{
  if(add_title.value.length==0){
    message.error("标题不能为空");
    return;
  }
  const todayTimestamp = Date.now();
  const jsonItem:BangumiItem={
    id: nanoid(),
    title: add_title.value,
    episode: add_episodes.value,
    now: add_now.value,
    onUpdate: add_onUpdate.value,
    time: add_onUpdate.value ? getTimestampOfFirstEpisode(todayTimestamp, add_weekday.value, add_updateTo.value).toString() : ""
  }
  const response=(await axios.post(`${baseURL}/api/addlist`, {
    data: jsonItem,
  }, {
    headers: {
      "token": token
    }
  })).data;
  if(!response.ok){
    message.error("添加失败: "+response.msg);
  }else{
    message.success("添加成功");
    getList();
    showOpen.value=false;
  }
  
}

let dataSource=ref([]);
const token=localStorage.getItem("token");
const router=useRouter();
if(!token){
  router.replace("/login")
}

const getList=async ()=>{
  const response=(await axios.get(`${baseURL}/api/list`, {
    headers: {
      "token": token,
    }
  })).data;
  if(response.ok){
    dataSource.value=response.msg;
  }
}

onMounted(()=>{
  getList();
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