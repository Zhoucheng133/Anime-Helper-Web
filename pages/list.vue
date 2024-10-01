<template>
  <a-config-provider :locale="locale">
    <PageHeader class="header" :login="true" :page-name="'list'" />
    <div class="body">
      <div class="toolbar">
        <UButton style="margin-right: 10px;" @click="openAdd">添加</UButton>
        <USelectMenu v-model="filterType" :options="typs" />
        <UInput style="margin-left: 10px;" v-model="searchKey" :disabled="filterType!='搜索'"></UInput>
      </div>
      <UTable :rows="filter" :columns="listColumn" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: '没有数据' }">
        <template #status-data="{ row }">
          <UBadge color="green" v-if="calculateEpisodesReleased(row.time)<row.episode">更新中</UBadge>
          <UBadge color="gray" v-else>已完结</UBadge>
        </template>
        <template #title-data="{ row }">
          <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ row.title }}</div>
        </template>
        <template #episode-data="{ row }">
          <div>{{ analyseEpisode(row as BangumiItem) }}</div>
        </template>
        <template #progress-data="{ row }">
          <div style="width: 120px;"><UProgress :value="row.now/analyseEpisode(row as BangumiItem)*100" /></div>
        </template>
        <template #op-data="{ row }">
          <ULink @click="openEdit(row as BangumiItem)" style="user-select: none;">编辑</ULink>
          <ULink style="margin-left: 10px; user-select: none;" @click="openDownloader(row.title)">添加到...</ULink>
          <ULink style="margin-left: 10px; user-select: none;" @click="minusOne(row as BangumiItem)">
            <i class="bi bi-dash-circle-fill"></i>
          </ULink>
          <ULink style="margin-left: 10px; user-select: none;" @click="addOne(row as BangumiItem)">
            <i class="bi bi-plus-circle-fill"></i>
          </ULink>
          <ULink style="margin-left: 10px; user-select: none;" @click="delItem(row as BangumiItem)">
            <i class="bi bi-trash3-fill"></i>
          </ULink>
        </template>
      </UTable>
      <a-modal v-model:open="showAdd" title="添加" @ok="onAddOk" centered>
        <div class="modalContent">
          <a-input placeholder="番剧标题" v-model:value="addItem.title"></a-input>
          <a-checkbox style="margin-top: 10px;" v-model:checked="addItem.onUpdate" @change="changeUpdate">当前在更新</a-checkbox>
          <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;">
            <div style="margin-right: 10px;">集数</div>
            <a-input-number v-model:value="addItem.episodes" :min="1"></a-input-number>
          </div>
          <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;">
            <div style="margin-right: 10px;">观看至</div>
            <a-input-number v-model:value="addItem.now" :min="0" :max="judgeAdd()"></a-input-number>
          </div>
          <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;" v-show="addItem.onUpdate">
            <div style="margin-right: 10px;">更新至</div>
            <a-input-number v-model:value="addItem.updateTo" :min="1" :max="addItem.episodes"></a-input-number>
          </div>
          <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;" v-show="addItem.onUpdate">
            <div style="margin-right: 10px;">更新日期</div>
            <a-select v-model:value="addItem.weekday">
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
      <a-modal v-model:open="showEdit" title="编辑信息" @ok="onEditOk" centered>
        <div class="modalContent">
          <a-input placeholder="番剧标题" v-model:value="editItem.title"></a-input>
          <a-checkbox style="margin-top: 10px;" v-model:checked="editItem.onUpdate" @change="changeUpdate">当前在更新</a-checkbox>
          <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;">
            <div style="margin-right: 10px;">集数</div>
            <a-input-number v-model:value="editItem.episodes" :min="1"></a-input-number>
          </div>
          <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;">
            <div style="margin-right: 10px;">观看至</div>
            <a-input-number v-model:value="editItem.now" :min="0" :max="judgeEdit()"></a-input-number>
          </div>
          <div style="margin-top: 10px; display: grid; align-items: center; grid-template-columns: 70px auto;" v-show="editItem.onUpdate">
            <div style="margin-right: 10px;">更新至</div>
            <a-input-number v-model:value="editItem.updateTo" :min="1" :max="editItem?.episodes"></a-input-number>
          </div>
          <div style="margin-top: 10px; display: grid; align-items: center;  grid-template-columns: 70px auto;" v-show="editItem.onUpdate">
            <div style="margin-right: 10px;">更新日期</div>
            <a-select v-model:value="editItem.weekday">
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
      <a-modal v-model:open="showDownloader" title="添加一个番剧" @ok="onDownloaderOk" centered>
        <div class="bangumiItem" style="margin-top: 10px;">
          <div class="bangumiItem_title">字幕组</div>
          <div class="bangumiItem_content">
            <a-input v-model:value="downloaderItem.ass"></a-input>
          </div>
        </div>
        <div class="bangumiItem" style="margin-top: 10px;">
          <div class="bangumiItem_title">标题</div>
          <div class="bangumiItem_content">
            <a-input v-model:value="downloaderItem.title"></a-input>
          </div>
        </div>
      </a-modal>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';
import { analyseEpisode, calculateEpisodesReleased } from '~/hooks/cals';
import { type EditItem, editOk } from '~/hooks/edit';
import init from '~/hooks/init';
import { initList, type BangumiItem, listColumn, changeItem, getList } from '~/hooks/list';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import axios from 'axios';
import { reqHost } from '~/hooks/network';
import { addOk } from '~/hooks/add';
import { onAddDownloaderOk, type DownloaderItem } from '~/hooks/adddownloader';
const locale=zhCN;

let filterType=ref('进行中');
const typs=['所有', '进行中', '更新中', '已完结', '已看完', '搜索'];
let searchKey=ref('');

const onDownloaderOk=async ()=>{
  if(await onAddDownloaderOk(downloaderItem.value)){
    showDownloader.value=false;
    downloaderItem.value={
      title: '',
      ass: ''
    }
    return;
  }
}

let downloaderItem=ref<DownloaderItem>({
  title: '',
  ass: ''
})

let addItem=ref<EditItem>({
  title: '',
  onUpdate: false,
  episodes: 1,
  now: 0,
  updateTo: 0,
  weekday: 0,
  id: ''
})

const openAdd=()=>{
  showAdd.value=true;
}

const onAddOk=async ()=>{
  if(await addOk(addItem.value)){
    showAdd.value=false;
    list.value=await getList();
    addItem.value={
      title: '',
      onUpdate: false,
      episodes: 1,
      now: 0,
      updateTo: 0,
      weekday: 0,
      id: ''
    }
    return;
  }
}

let filter=computed(()=>{
  if(filterType.value=='所有'){
    return list.value;
  }else if(filterType.value=='进行中'){
    return list.value.filter((item)=>{
      return !(calculateEpisodesReleased(item.time)>=item.episode && item.now==item.episode);
    })
  }else if(filterType.value=='更新中'){
    return list.value.filter((item)=>{
      return calculateEpisodesReleased(item.time)<item.episode
    });
  }else if(filterType.value=='已完结'){
    return list.value.filter((item)=>{
      return calculateEpisodesReleased(item.time)>=item.episode
    });
  }else if(filterType.value=='已看完'){
    return list.value.filter((item)=>{
      return calculateEpisodesReleased(item.time)>=item.episode && item.now==item.episode;
    });
  }else if(filterType.value=='搜索'){
    return list.value.filter((item)=>{
      return item.title.includes(searchKey.value);
    })
  }
})

const delItem=(record: BangumiItem)=>{
  const token=useCookie('token');
  if(!token.value){
    return;
  }
  Modal.confirm({
    title: "删除项",
    content: `你确定要删除:《${record.title}》吗`,
    centered: true,
    okText: '删除',
    cancelText: '取消',
    async onOk() {
      const response=(await axios.post(`${reqHost}/api/dellist`, {
        id: record.id
      }, {
        headers: {
          token: token.value,
        }
      })).data;
      if(response.ok){
        message.success("删除成功")
        list.value=await getList();
      }else{
        message.error("删除失败: "+response.msg);
      }
    },
  });
}

const addOne=async (record: BangumiItem)=>{
  if(record.now>=analyseEpisode(record)){
    return;
  }
  const index=list.value.findIndex((i)=>record.id==i.id);  
  if(index==-1){
    return;
  }else{
    list.value[index].now=list.value[index].now+1;
    if(await changeItem(list.value[index])){
      list.value=await getList();
    }
  }
}

const minusOne=async (record: BangumiItem)=>{
  if(record.now==0){
    return;
  }
  const index=list.value.findIndex((i)=>record.id==i.id);
  if(index==-1){
    return;
  }else{
    list.value[index].now=list.value[index].now-1;
    if(await changeItem(list.value[index])){
      list.value=await getList();
    }
  }
}

const openDownloader=(title: string)=>{
  downloaderItem.value.title=title;
  showDownloader.value=true;
}

const onEditOk=async ()=>{
  if(await editOk(editItem.value)){
    showEdit.value=false;
    list.value=await getList();
    return;
  }
  message.error("编辑失败");
}

const openEdit=(record: BangumiItem)=>{
  showEdit.value=true;
  editItem.value={
    title: record.title,
    onUpdate: calculateEpisodesReleased(record.time)<record.episode,
    episodes: record.episode,
    now: record.now,
    updateTo: analyseEpisode(record as BangumiItem),
    weekday: new Date(record.time).getDay(),
    id: record.id,
  };
}

const judgeAdd=()=>{
  if(addItem.value.onUpdate){
    return addItem.value.episodes>addItem.value.updateTo?addItem.value.updateTo:addItem.value.episodes;
  }else{
    return addItem.value.episodes;
  }
}

const judgeEdit=()=>{
  if(editItem.value.onUpdate){
    return editItem.value.episodes>editItem.value.updateTo?editItem.value.updateTo:editItem.value.episodes;
  }else{
    return editItem.value.episodes;
  }
}

const changeUpdate=()=>{
  editItem.value.now=1;
  addItem.value.now=1;
}

let list=ref<BangumiItem[]>([]);
let showEdit=ref(false);
let showAdd=ref(false);
let showDownloader=ref(false);
let editItem=ref<EditItem>({
  title: '',
  onUpdate: false,
  episodes: 0,
  now: 0,
  updateTo: 0,
  weekday: 0,
  id: ''
})

useHead({
  title: 'AnimeHelper | 列表'
})

const islogin=await init();
if(!islogin){
  onMounted(()=>{
    window.location.href='/login';
  })
}else{
  list.value=await initList();
}

</script>

<style>
.toolbar{
  margin-bottom: 10px;
  display: flex;
}
</style>