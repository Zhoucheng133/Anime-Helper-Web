<template>
  <Header></Header>
  <div class="body" v-if="!list().loading">
    <div class="toolbar">
      <a-button type="primary" style="margin-right: 30px;" @click="adder().addHandler">添加</a-button>
      <a-input-search :placeholder="variables().isMobile ? '搜索': '按下/可以聚焦到这里'" v-model:value="searchKey" enter-button @change="searchChange" :allowClear="true" ref="searchRef" />
    </div>
    <a-table :dataSource="onsearch ? searchRlt : list().dataSource" :columns="columns" :pagination="false" size="small" :scroll="{ x: 500 }" sticky>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'progress'">
          <a-progress :percent="record.now/analyseEpisode(record)*100" :showInfo="false" />
        </template>
        <template v-else-if="column.key === 'op'">
          <a style="user-select: none;" @click="edit().openEdit(record)">编辑</a>
          <a style="margin-left: 10px; user-select: none;">添加到...</a>
          <a style="margin-left: 10px; user-select: none;" @click="list().minus_one(record)">
            <i class="bi bi-dash-circle-fill"></i>
          </a>
          <a style="margin-left: 10px; user-select: none;" @click="list().add_one(record)">
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
        <a-input-number v-model:value="adder().add_now" :min="1" :max="adder().judge()"></a-input-number>
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
  <a-modal v-model:open="edit().showEdit" title="编辑信息" @ok="edit().EditOk" centered>
    <div class="modalContent">
      <a-input placeholder="番剧标题" v-model:value="edit().edit_title"></a-input>
      <a-checkbox style="margin-top: 10px;" v-model:checked="edit().edit_onUpdate" @change="edit().changeUpdate">当前在更新</a-checkbox>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">集数</div>
        <a-input-number v-model:value="edit().edit_episodes" :min="1"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;">
        <div style="margin-right: 10px;">观看至</div>
        <a-input-number v-model:value="edit().edit_now" :min="1" :max="edit().judgeEdit()"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;" v-show="edit().edit_onUpdate">
        <div style="margin-right: 10px;">更新至</div>
        <a-input-number v-model:value="edit().edit_updateTo" :min="1" :max="edit().edit_episodes"></a-input-number>
      </div>
      <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;" v-show="edit().edit_onUpdate">
        <div style="margin-right: 10px;">更新日期</div>
        <a-select v-model:value="edit().edit_weekday">
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
import edit from '@/stores/edit';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import adder from '@/stores/adder';
import list from '@/stores/list';
import token from '@/stores/token';
import variables from '@/stores/variables';
import type { BangumiItem } from '../bangumi/BangumiView.vue';
import { analyseEpisode, calculateEpisodesReleased } from '@/stores/cal';

document.title="AnimeHelper | 列表";


let onsearch=ref(false);
let searchRlt=ref<BangumiItem[]>([]);

let searchKey=ref("");

const searchRef=ref<any>(null);

window.addEventListener("keydown", (event)=>{
  if(event.key=="/"){
    event.preventDefault();
    if(searchRef.value){
      searchRef.value.focus();
    }
  }
})

const searchChange=()=>{
  if(searchKey.value.length==0){
    onsearch.value=false;
  }else{
    onsearch.value=true;
    search();
  }
}

const search=()=>{
  searchRlt.value=list().dataSource.filter((item)=>{
    return item.title.includes(searchKey.value);
  })  
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
          token: token().token,
        }
      })).data;
      if(response.ok){
        message.success("删除成功")
        list().getList();
      }else{
        message.error("删除失败: "+response.msg);
      }
    },
  });
}

onMounted(()=>{
  token().getToken();
  list().getList();
})

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