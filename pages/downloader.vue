<template>
  <PageHeader class="header" :login="true" :page-name="'downloader'" />
  <div class="body">
    <div class="dl_item">
      <div>运行状态</div>
      <div class="dl_item_content">
        <UBadge :color="running ? 'green' : 'yellow'" style="margin-right: 20px;">{{ running ? '运行中' : "等待中" }}</UBadge>
        <UToggle v-model="running" @change="toggleRun" />
      </div>
    </div>
    <div class="dl_item">
      <div>系统操作</div>
      <div class="dl_item_content">
        <UButton size="xs" variant="soft" @click="showLog">显示日志</UButton>
        <UButton size="xs" variant="soft" style="margin-left: 20px;" @click="saveForm(formData)" :disabled='running'>保存表单</UButton>
      </div>
    </div>
    <div class="dl_item">
      <div>RSS 来源</div>
      <div class="dl_item_content">
        <USelectMenu :options="rssOptions" v-model="formData.type" :disabled='running'>
          <template #label>
            {{ formData.type=='mikan' ? 'Mikan' : 'Acgrip' }}
          </template>
          <template #option="{ option: item }">
            {{ item=='mikan' ? 'Mikan' : 'Acgrip' }}
          </template>
        </USelectMenu>
      </div>
    </div>
    <div class="dl_item">
      <div>更新频率</div>
      <div class="dl_item_content">
        <div style="width: 100px;"><UInput v-model="formData.freq" type="number" :disabled='running'></UInput></div>
        <div style="margin-left: 10px;">分钟</div>
      </div>
    </div>
    <div class="dl_item">
      <div>Aria2 地址</div>
      <div class="dl_item_content">
        <div style="width: 100%;"><UInput v-model="formData.ariaLink" placeholder="http(s)://" :disabled='running' /></div>
      </div>
    </div>
    <div class="dl_item">
      <div>Aria2 密钥</div>
      <div class="dl_item_content">
        <div style="width: 100%;"><UInput v-model="formData.ariaSecret" placeholder="" type="password" :disabled='running' /></div>
      </div>
    </div>
    <UAccordion :items="items" style="margin-top: 20px;" multiple>
      <template #bangumi>
        <UButton :disabled='running' variant="soft" @click="showAddBangumiDialog=true;">添加</UButton>
        <UTable :rows="formData.bangumi" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: '没有数据' }" :columns="bangumiColumn">
          <template #op-data="{ row }">
            <div><UButton size="xs" color="red" variant="soft" :disabled='running' @click="delBangumiItem(row)">删除</UButton></div>
          </template>
        </UTable>
      </template>
      <template #exclusion>
        <UButton :disabled='running' variant="soft" @click="showAddExclusionDialog=true">添加</UButton>
        <UTable :rows="exclusionRow" :columns="exclusionColumn" >
          <template #op-data="{ row }">
            <div><UButton size="xs" color="red" variant="soft" :disabled='running' @click="delExclusionItem(row)">删除</UButton></div>
          </template>
        </UTable>
      </template>
    </UAccordion>
  </div>
  <a-modal v-model:open="showAddBangumiDialog" title="添加一个番剧" @ok="addBangumiOk" @cancel="onDialogCancel" centered>
    <div class="bangumiItem" style="margin-top: 10px;">
      <div class="bangumiItem_title">字幕组</div>
      <div class="bangumiItem_content">
        <a-input v-model:value="addBangumi.ass"></a-input>
      </div>
    </div>
    <div class="bangumiItem" style="margin-top: 10px;">
      <div class="bangumiItem_title">标题</div>
      <div class="bangumiItem_content">
        <a-input v-model:value="addBangumi.title"></a-input>
      </div>
    </div>
  </a-modal>
  <a-modal v-model:open="showAddExclusionDialog" title="添加一个排除关键字" @ok="addExclusionOk" @cancel="onDialogCancel" centered>
    <div class="exclutionItem" style="margin-top: 10px;">
      <div class="exclutionItem_title">关键字</div>
      <div class="exclutionItem_content">
        <a-input v-model:value="addExclusion"></a-input>
      </div>
    </div>
  </a-modal>
  <a-modal v-model:open="showLogDialog" title="日志" okText="完成" @ok="showLogDialog=false" :width="width<720?width-20 : 700" centered :footer="null">
    <div class="logContent">
      <div v-for="(item, index) in logContent" :key="index" :style="item.ok ? {'color': 'green'}:{'color': 'red'}" class="logItem">
        <div class="log_label">{{ item.msg }}</div>
        <div class="log_time">{{ dayjs(item.time).format("YYYY-MM-DD HH:mm") }}</div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';
import { type DownloaderForm, type DownloaderItem, type Log, bangumiColumn, exclusionColumn, getLog, initFormData, initStatus, saveForm, toggle } from '~/hooks/dl';
import init from '~/hooks/init';
import dayjs from 'dayjs';
const toast = useToast()
const items = [
  {label: '番剧表', defaultOpen: true, slot: 'bangumi'},
  {label: '排除关键字', defaultOpen: true, slot: 'exclusion'}
]
const rssOptions=['mikan', 'acgrip'];
let inputPort=ref('');
let showAddBangumiDialog=ref(false);
let showAddExclusionDialog=ref(false);
let width=ref(800);
let addBangumi=ref<DownloaderItem>({
  title: '',
  ass: ''
})
let addExclusion=ref('');
let showLogDialog=ref(false);
let logContent=ref<Log[]>([]);
const showLog=async ()=>{
  const temp=await getLog();
  if(temp){
    logContent.value=temp;
    showLogDialog.value=true;
  }
}

onMounted(()=>{
  width.value=window.innerWidth;
})

const exclusionRow=computed(()=>{
  return formData.value.exclusions.map((item)=>({value: item}));
})

const delExclusionItem=(record: any)=>{
  Modal.confirm({
    title: '你确定要删除这个关键字吗',
    centered: true,
    okText: '删除',
    cancelText: '取消',
    onOk() {
      formData.value.exclusions=formData.value.exclusions.filter((item)=>{
        if(item==record.value){
          return false
        }
        return true;
      })
      toast.add({
        title: '删除成功',
      })
    },
    onCancel() {},
  });
}

const onDialogCancel=()=>{
  addBangumi.value={
    title: '',
    ass: ''
  };
  addExclusion.value='';
}

const addExclusionOk=()=>{
  if(addExclusion.value.length==0){
    toast.add({
      title: '关键字不能为空',
    })
    return;
  }
  if(formData.value.exclusions.includes(addExclusion.value)){
    toast.add({
      title: '该关键字已存在',
    })
    return;
  }

  formData.value.exclusions.push(addExclusion.value);
  onDialogCancel();
  toast.add({
    title: '添加成功',
  })
  showAddExclusionDialog.value=false;
}

const addBangumiOk=()=>{
  if(addBangumi.value.ass.length==0){
    toast.add({
      title: '字幕组不能为空',
    })
    return;
  }else if(addBangumi.value.title.length==0){
    toast.add({
      title: '标题不能为空',
    })
    return;
  }
  const exists = formData.value.bangumi.some(item => 
    item.ass === addBangumi.value.ass && item.title ===addBangumi.value.title
  );

  if(exists){
    toast.add({
      title: '番剧表已有该数据',
    })
    return;
  }
  formData.value.bangumi.push({
    "ass": addBangumi.value.ass,
    "title": addBangumi.value.title,
  })
  onDialogCancel();
  toast.add({
    title: '添加成功',
  })
  showAddBangumiDialog.value=false;
}
const delBangumiItem=(record: DownloaderItem)=>{
  Modal.confirm({
    title: '你确定要删除这个番剧吗',
    okText: '删除',
    cancelText: '取消',
    centered: true,
    onOk() {
      formData.value.bangumi=formData.value.bangumi.filter((item)=>{
        if(item.ass==record.ass && item.title==record.title){
          return false
        }
        return true;
      })
      toast.add({
        title: '删除成功',
      })
    },
    onCancel() {},
  });
}

const toggleRun=async ()=>{
  if(!(await toggle(running.value, formData.value))){
    running.value=!running.value;
  }
}

let running=ref(false);
let formData=ref<DownloaderForm>({
  ariaLink: '',
  ariaSecret: '',
  bangumi: [],
  exclusions: [],
  freq: 15,
  type: 'mikan'
})

useHead({
  title: 'AnimeHelper | 下载器'
})

const islogin=await init();
if(!islogin){
  onMounted(()=>{
    window.location.href='/login';
  })
}else{
  const temp=await initFormData();
  if(temp){
    formData.value=temp;
    inputPort.value=temp.freq.toString();
  }
  running.value=await initStatus();
}


</script>

<style scoped>
.dl_item_content{
  display: flex;
  align-items: center;
}
.dl_item{
  display: grid;
  grid-template-columns: 100px auto;
  height: 35px;
  align-items: center;
  margin-top: 10px;
}
.body{
  margin: auto;
  width: 800px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
  overflow: hidden;
}
@media screen and (max-width: 800px) {
  .body {
    width: 100%
  }
}
.bangumiItem{
  display: grid;
  grid-template-columns: 50px auto;
  column-gap: 10px;
}
.bangumiItem_title{
  display: flex;
  align-items: center;
}
.bangumiItem_content{
  display: flex;
  align-items: center;
}

.exclutionItem{
  display: grid;
  grid-template-columns: 50px auto;
  column-gap: 10px;
}

.exclutionItem_title{
  display: flex;
  align-items: center;
}
.exclutionItem_content{
  display: flex;
  align-items: center;
}
.logContent{
  max-height: 500px;
  overflow: auto;
}
.logItem{
  display: grid;
  grid-template-columns: auto 150px 10px;
  align-items: center;
}
.log_label{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.log_time{
  display: flex;
  justify-content: flex-end;
}
</style>