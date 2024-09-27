<template>
  <Header></Header>
  <div class="body" v-if="!loading">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="0" header="星期日">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[0]" :key="index" :color="follow(item) ? 'blue' : ''" @click="addHandler(item, 0)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="1" header="星期一">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[1]" :key="index" :color="follow(item) ? 'blue' : ''" @click="addHandler(item, 1)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="星期二">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[2]" :key="index" :color="follow(item) ? 'blue' : ''" @click="addHandler(item, 2)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="星期三">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[3]" :key="index" :color="follow(item) ? 'blue' : ''" @click="addHandler(item, 3)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="4" header="星期四">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[4]" :key="index" :color="follow(item) ? 'blue' : ''" @click="addHandler(item, 4)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="5" header="星期五">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[5]" :key="index" :color="follow(item) ? 'blue' : ''" @click="addHandler(item, 5)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="6" header="星期六">
        <a-flex wrap="wrap" gap="middle">
          <a-tag class="item" v-for="(item, index) in list[6]" :key="index" :color="follow(item) ? 'blue' : ''" @click="addHandler(item, 6)">{{ item }}</a-tag>
        </a-flex>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <InnerLoadingView v-else/>
  <a-modal v-model:open="adder().showAdd" title="添加一个新的番剧" @ok="adder().handleOk" centered>
    <div class="modalContent">
      <a-input placeholder="番剧标题" v-model:value="adder().add_title"></a-input>
      <a-checkbox style="margin-top: 10px;" v-model:checked="adder().add_onUpdate" @change="adder().changeUpdate">当前在更新</a-checkbox>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">集数</div>
        <a-input-number v-model:value="adder().add_episodes" :min="1"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">观看至</div>
        <a-input-number v-model:value="adder().add_now" :min="0" :max="adder().judge()"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;" v-show="adder().add_onUpdate">
        <div style="margin-right: 10px;">更新至</div>
        <a-input-number v-model:value="adder().add_updateTo" :min="1" :max="adder().add_episodes"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;" v-show="adder().add_onUpdate">
        <div style="margin-right: 10px;">更新日期</div>
        <a-select v-model:value="adder().add_weekday">
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
import { onMounted, ref } from 'vue';
// import { testData } from '@/test/bangumi';
import token from '@/stores/token';
import adder from '@/stores/adder';
import axios from 'axios';
import { baseURL } from '@/stores/network';
import { message } from 'ant-design-vue';
import ls from '@/stores/list';

document.title="AnimeHelper | 每日更新";
let list=ref<string[][]>([]);

const follow=(title: string)=>{
  const index=ls().dataSource.find((item)=>item.title==title)
  if(index){
    return true;
  }
  return false;
}

const activeKey=ref([0, 1, 2, 3, 4, 5, 6]);
let loading=ref(true);
const addHandler=(title: string, weekday: number)=>{
  if(follow(title)){
    message.error("列表中已存在");
    return;
  }
  adder().showAdd=true;
  adder().add_title=title;
  adder().add_weekday=weekday;
  adder().add_onUpdate=true;
}

export interface BangumiItem{
  id: string,
  title: string,
  episode: number,
  now: number,
  // onUpdate: boolean
  time: number,
}


onMounted(async ()=>{
  token().getToken();
  // 下面是正式内容
  const response=(await axios.get(`${baseURL}/api/calendar`, {
    headers: {
      token: localStorage.getItem("token")
    }
  })).data
  if(response.ok){
    list.value=response.msg;
  }else{
    message.error("请求失败")
  }
  // 下面这行是测试用代码
  // list.value=testData;
  // END

  if(ls().dataSource.length==0){
    await ls().getList();
  }

  loading.value=false;
  
})


</script>

<style>
.ant-collapse-content-box{
  overflow: hidden !important;
}
</style>

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
  overflow: hidden;
}
@media screen and (max-width: 1000px) {
  .body {
    width: 100%
  }
}
</style>