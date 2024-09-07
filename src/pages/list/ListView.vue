<template>
  <Header></Header>
  <div class="body" v-if="!loading">
    <div class="toolbar">
      <a-button type="primary" style="margin-right: 30px;" @click="addHandler">添加</a-button>
      <a-input-search :placeholder="variables().isMobile ? '搜索': '按下/可以聚焦到这里'" v-model:value="searchKey" enter-button @change="searchChange" :allowClear="true" ref="searchRef" />
    </div>
    <a-table :dataSource="onsearch ? searchRlt : dataSource" :columns="columns" :pagination="false" size="small" :scroll="{ x: 500 }" sticky>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'progress'">
          <a-progress :percent="record.now/analyseEpisode(record)*100" :showInfo="false" />
        </template>
        <template v-else-if="column.key === 'op'">
          <a style="user-select: none;" @click="openEdit(record)">编辑</a>
          <a style="margin-left: 10px; user-select: none;">添加到...</a>
          <a style="margin-left: 10px; user-select: none;" @click="minus_one(record)">
            <i class="bi bi-dash-circle-fill"></i>
          </a>
          <a style="margin-left: 10px; user-select: none;" @click="add_one(record)">
            <i class="bi bi-plus-circle-fill"></i>
          </a>
          <a style="margin-left: 10px; user-select: none;" @click="del_item(record)">
            <i class="bi bi-trash3-fill"></i>
          </a>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag color="green" v-if="calculateEpisodesReleased(record.time)<record.episode" style="user-select: none;">更新中</a-tag>
          <a-tag v-else style="user-select: none;">已完结</a-tag>
        </template>
        <template v-else-if="column.key === 'title'">
          <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ record.title }}</div>
        </template>
        <template v-else-if="column.key === 'episode'" >
          <div style="user-select: none;">
            {{ analyseEpisode(record) }}
          </div>
        </template>
        <template v-else-if="column.key === 'now'" >
          <div style="user-select: none;">
            {{ record.now }}
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <InnerLoadingView v-else></InnerLoadingView>
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
  <a-modal v-model:open="showEdit" title="编辑信息" @ok="EditOk" centered>
    <div class="modalContent">
      <a-input placeholder="番剧标题" v-model:value="edit_title"></a-input>
      <a-checkbox style="margin-top: 10px;" v-model:checked="edit_onUpdate" @change="changeUpdate">当前在更新</a-checkbox>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">集数</div>
        <a-input-number v-model:value="edit_episodes" :min="1"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">观看至</div>
        <a-input-number v-model:value="edit_now" :min="1" :max="judgeEdit()"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;" v-show="edit_onUpdate">
        <div style="margin-right: 10px;">更新至</div>
        <a-input-number v-model:value="edit_updateTo" :min="1" :max="edit_episodes"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;" v-show="edit_onUpdate">
        <div style="margin-right: 10px;">更新日期</div>
        <a-select v-model:value="edit_weekday">
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
import InnerLoadingView from '../loading/InnerLoadingView.vue';
import Header from '@/components/Header.vue';
import { baseURL } from '@/stores/network';
import { message, Modal } from 'ant-design-vue';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import variables from '@/stores/variables';

document.title="AnimeHelper | 列表";

let loading=ref(true);

let add_title=ref("");
let add_onUpdate=ref(false);
let add_now=ref(1);
let add_episodes=ref(1);
let add_weekday=ref(0);
let add_updateTo=ref(1);

let onsearch=ref(false);
let searchRlt=ref<BangumiItem[]>([]);

let searchKey=ref("");

let showEdit=ref(false);

let edit_title=ref("");
let edit_onUpdate=ref(false);
let edit_episodes=ref(1);
let edit_now=ref(1);
let edit_updateTo=ref(1);
let edit_weekday=ref(0);
let edit_id=ref("");

const searchRef=ref<any>(null);

window.addEventListener("keydown", (event)=>{
  if(event.key=="/"){
    event.preventDefault();
    if(searchRef.value){
      searchRef.value.focus();
    }
  }
})

const judgeEdit=()=>{
  if(edit_onUpdate.value){
    return edit_episodes.value>edit_updateTo.value?edit_updateTo.value:edit_episodes.value;
  }else{
    return edit_episodes.value;
  }
}


const openEdit=(record: BangumiItem)=>{
  edit_title.value=record.title;
  edit_episodes.value=record.episode;
  edit_onUpdate.value=calculateEpisodesReleased(record.time)<record.episode;
  edit_updateTo.value=analyseEpisode(record);
  edit_now.value=record.now;
  edit_weekday.value=new Date(record.time).getDay()
  edit_id.value=record.id;
  showEdit.value=true;
}

const EditOk=async ()=>{
  const todayTimestamp = Date.now();
  await changeItem({
    id: edit_id.value,
    title: edit_title.value,
    episode: edit_episodes.value,
    now: edit_now.value,
    time: edit_onUpdate.value ? getTimestampOfFirstEpisode(todayTimestamp, edit_weekday.value, edit_updateTo.value) : 0
  });
  showEdit.value=false;
}

const searchChange=()=>{
  if(searchKey.value.length==0){
    onsearch.value=false;
  }else{
    onsearch.value=true;
    search();
  }
}

const search=()=>{
  searchRlt.value=dataSource.value.filter((item)=>{
    return item.title.includes(searchKey.value);
  })  
}

const showOpen=ref(false);

const changeUpdate=()=>{
  add_now.value=1;
  edit_now.value=1;
}

const del_item=(item: BangumiItem)=>{
  Modal.confirm({
    title: "删除项",
    content: `你确定要删除:《${item.title}》吗`,
    centered: true,
    async onOk() {
      const response=(await axios.post(`${baseURL}/api/dellist`, {
        id: item.id
      }, {
        headers: {
          token: token,
        }
      })).data;
      if(response.ok){
        message.success("删除成功")
        getList();
      }else{
        message.error("删除失败: "+response.msg);
      }
    },
  });
}

const changeItem=async (item: BangumiItem)=>{
  const response=(await axios.post(`${baseURL}/api/changeitem`, {
    data: item,
  }, {
    headers: {
      token: token
    }
  })).data;
  if(response.ok){
    getList();
  }else{
    message.error("修改参数失败: "+response.msg);
  }
}

const minus_one=async (item: BangumiItem)=>{
  if(item.now==1){
    return;
  }
  const index=dataSource.value.findIndex((i)=>item.id==i.id);
  if(index==-1){
    return;
  }else{
    dataSource.value[index].now=dataSource.value[index].now-1;
    await changeItem(dataSource.value[index]);
  }
}

const add_one=async (item: BangumiItem)=>{
  
  if(item.now>=analyseEpisode(item)){
    return;
  }
  const index=dataSource.value.findIndex((i)=>item.id==i.id);  
  if(index==-1){
    return;
  }else{
    dataSource.value[index].now=dataSource.value[index].now+1;
    await changeItem(dataSource.value[index]);
  }
  
}

export interface BangumiItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  // onUpdate: boolean
  time: number,
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
function calculateEpisodesReleased(firstEpisodeTimestamp: number): number {
  const tmp = new Date();
  const currentDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
  const difference = currentDate.getTime() - firstEpisodeTimestamp;
  const daysPassed=Math.floor(difference / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(daysPassed / 7);
  return Math.max(weeksPassed, 0) + 1;
}

const analyseEpisode=(item: BangumiItem)=>{
  if(item.time==0){
    return item.episode;
  }
  return calculateEpisodesReleased(item.time)>item.episode?item.episode:calculateEpisodesReleased(item.time);
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
    // onUpdate: add_onUpdate.value,
    time: add_onUpdate.value ? getTimestampOfFirstEpisode(todayTimestamp, add_weekday.value, add_updateTo.value) : 0
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
    add_episodes.value;
    message.success("添加成功");
    getList();
    showOpen.value=false;
    add_title.value="";
    add_onUpdate.value=false;
    add_now.value=1;
    add_episodes.value=1;
    add_weekday.value=0;
    add_updateTo.value=1;
  }
}

let dataSource=ref<BangumiItem[]>([]);
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
    dataSource.value=response.msg.reverse();
  }else{
    message.error("获取列表失败: "+response.msg);
  }
  loading.value=false;
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
    width: 150,
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
    width: 200
  },
]

</script>

<style scoped>
.toolbar{
  margin-bottom: 10px;
  display: flex;
}
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