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
        <UButton size="xs" variant="soft">显示日志</UButton>
        <UButton size="xs" variant="soft" style="margin-left: 20px;">保存表单</UButton>
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
        <div style="width: 100px;"><UInput v-model="formData.freq" type="number"></UInput></div>
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
    <a-collapse style="margin-top: 20px;" v-model:activeKey="showFold">
      <a-collapse-panel key="1" header="番剧表">
        <UButton :disabled='running' variant="soft">添加</UButton>
        <UTable :rows="formData.bangumi" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: '没有数据' }" :columns="bangumiColumn">
          <template #op-data="{ row }">
            <div><UButton size="xs" color="red" variant="soft">删除</UButton></div>
          </template>
        </UTable>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="排除关键字">
        <UButton :disabled='running' variant="soft">添加</UButton>
        <UTable :rows="exclusionRow" :columns="exclusionColumn" >
          <template #op-data="{ row }">
            <div><UButton size="xs" color="red" variant="soft">删除</UButton></div>
          </template>
        </UTable>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';
import { type DownloaderForm, bangumiColumn, exclusionColumn, initFormData, initStatus } from '~/hooks/dl';
import init from '~/hooks/init';

const rssOptions=['mikan', 'acgrip'];
let inputPort=ref('');
let showFold=ref(['1', '2']);

const exclusionRow=computed(()=>{
  return formData.value.exclusions.map((item)=>({value: item}));
})

const toggleRun=()=>{
  
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
</style>