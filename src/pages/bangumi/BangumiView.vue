<template>
  <Header></Header>
  <div class="body" v-if="!loading">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="0" header="星期日">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[0]" :key="index" @click="addHandler(item, 0)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="1" header="星期一">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[1]" :key="index" @click="addHandler(item, 1)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="星期二">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[2]" :key="index" @click="addHandler(item, 2)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="星期三">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[3]" :key="index" @click="addHandler(item, 3)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="4" header="星期四">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[4]" :key="index" @click="addHandler(item, 4)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="5" header="星期五">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[5]" :key="index" @click="addHandler(item, 5)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="6" header="星期六">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[6]" :key="index" @click="addHandler(item, 6)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <InnerLoadingView v-else/>
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
import InnerLoadingView from '../loading/InnerLoadingView.vue';
import { baseURL } from '@/stores/network';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { testData } from '@/test/bangumi';
import { nanoid } from 'nanoid';

document.title="AnimeHelper | 每日更新";
let list=ref<string[][]>([]);

const activeKey=ref([0, 1, 2, 3, 4, 5, 6]);

const token=localStorage.getItem("token");
const router=useRouter();
if(!token){
  router.replace("/login")
}
let loading=ref(true);

let showOpen=ref(false);

let add_title=ref("");
let add_onUpdate=ref(true);
let add_now=ref(1);
let add_episodes=ref(1);
let add_weekday=ref(0);
let add_updateTo=ref(1);

const changeUpdate=()=>{
  add_now.value=1;
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

function getTimestampOfFirstEpisode(todayTimestamp: number, releaseDay: number, episodesReleased: number): number {
  const today = resetToMidnight(new Date(todayTimestamp));
  const daysPassed = (episodesReleased - 1) * 7;
  const currentDay = today.getDay();
  const offset = (currentDay - releaseDay + 7) % 7;
  const daysSinceFirstEpisode = daysPassed + offset;
  const firstEpisodeDate = new Date(today.getTime() - daysSinceFirstEpisode * 24 * 60 * 60 * 1000);
  return firstEpisodeDate.getTime();
}


const addHandler=(title: string, weekday: number)=>{
  showOpen.value=true;
  add_title.value=title;
  add_weekday.value=weekday;
}

export interface BangumiItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  // onUpdate: boolean
  time: number,
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
    showOpen.value=false;
    add_title.value="";
    add_onUpdate.value=false;
    add_now.value=1;
    add_episodes.value=1;
    add_weekday.value=0;
    add_updateTo.value=1;
  }
}

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
  // END

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