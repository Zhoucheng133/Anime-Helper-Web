<template>
    <PageHeader class="header" :login="true" :page-name="'bangumi'" />
    <div class="body">
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel key="0" header="星期日">
          <a-flex wrap="wrap" gap="middle">
            <UBadge class="bangumi_item" v-for="(item, index) in list[0]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 0)">{{ item }}</UBadge>
          </a-flex>
        </a-collapse-panel>
        <a-collapse-panel key="1" header="星期一">
          <a-flex wrap="wrap" gap="middle">
            <UBadge class="bangumi_item" v-for="(item, index) in list[1]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 1)">{{ item }}</UBadge>
          </a-flex>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="星期二">
          <a-flex wrap="wrap" gap="middle">
            <UBadge class="bangumi_item" v-for="(item, index) in list[2]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 2)">{{ item }}</UBadge>
          </a-flex>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="星期三">
          <a-flex wrap="wrap" gap="middle">
            <UBadge class="bangumi_item" v-for="(item, index) in list[3]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 3)">{{ item }}</UBadge>
          </a-flex>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="星期四">
          <a-flex wrap="wrap" gap="middle">
            <UBadge class="bangumi_item" v-for="(item, index) in list[4]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 4)">{{ item }}</UBadge>
          </a-flex>
        </a-collapse-panel>
        <a-collapse-panel key="5" header="星期五">
          <a-flex wrap="wrap" gap="middle">
            <UBadge class="bangumi_item" v-for="(item, index) in list[5]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 5)">{{ item }}</UBadge>
          </a-flex>
        </a-collapse-panel>
        <a-collapse-panel key="6" header="星期六">
          <a-flex wrap="wrap" gap="middle">
            <UBadge class="bangumi_item" v-for="(item, index) in list[6]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 6)">{{ item }}</UBadge>
          </a-flex>
        </a-collapse-panel>
      </a-collapse>
      
      <a-modal v-model:open="showAdd" title="添加一个新的番剧" @ok="onAddOk" centered>
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
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';
import { addOk } from '~/hooks/add';
import { initUpdates } from '~/hooks/bangumi';
import type { EditItem } from '~/hooks/edit';
import init from '~/hooks/init';
import { getList, initList, type BangumiItem } from '~/hooks/list';

let list=ref<string[][]>([]);
let followList=ref<BangumiItem[]>([])

const items = [
  { label: '星期日', defaultOpen: true, slot: 'sunday' },
  { label: '星期一', defaultOpen: true, slot: 'monday' },
  { label: '星期二', defaultOpen: true, slot: 'tuesday' },
  { label: '星期三', defaultOpen: true, slot: 'wednesday' },
  { label: '星期四', defaultOpen: true, slot: 'thursday' },
  { label: '星期五', defaultOpen: true, slot: 'friday' },
  { label: '星期六', defaultOpen: true, slot: 'saturday' }
];

const changeUpdate=()=>{
  addItem.value.now=0;
}

const judgeAdd=()=>{
  if(addItem.value.onUpdate){
    return addItem.value.episodes>addItem.value.updateTo?addItem.value.updateTo:addItem.value.episodes;
  }else{
    return addItem.value.episodes;
  }
}

let addItem=ref<EditItem>({
  title: '',
  onUpdate: false,
  episodes: 1,
  now: 0,
  updateTo: 0,
  weekday: 0,
  id: ''
})

let showAdd=ref(false);

const onAddOk=async ()=>{
  if(await addOk(addItem.value)){
    showAdd.value=false;
    followList.value=await getList();
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

useHead({
  title: 'AnimeHelper | 每日放送'
})

const addHandler=(title: string, weekday: number)=>{
  addItem.value.title=title;
  addItem.value.onUpdate=true;
  addItem.value.weekday=weekday;
  showAdd.value=true;
}

const follow=(title: string)=>{
  const index=followList.value.find((item)=>item.title==title)
  if(index){
    return true;
  }
  return false;
}

const activeKey=ref([0, 1, 2, 3, 4, 5, 6]);

const islogin=await init();
if(!islogin){
  onMounted(()=>{
    window.location.href='/login';
  })
}else{
  followList.value=await initList();
  list.value=await initUpdates();
}

</script>

<style>
.bangumi_item{
  font-size: 15px;
  user-select: none;
  /* padding: 5px; */
  cursor: pointer;
}
</style>