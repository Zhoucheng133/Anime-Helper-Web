<template>
  <Header></Header>
  <div class="body" v-if="!dl().loading">
    <div class="item">
      <div class="label">运行状态</div>
      <div class="item_content">
        <a-tag :color="dl().running ? 'success' : 'warning'" style="margin-right: 20px;">{{ dl().running ? '运行中' : "等待中" }}</a-tag>
        <a-switch v-model:checked="dl().running" @change="dl().toggleRun" />
      </div>
    </div>
    <div class="item">
      <div class="label">系统操作</div>
      <div class="item_content">
        <a-button type="link" @click="log().showLog">查看日志</a-button>
        <a-button type="link" @click="dl().saveForm(false)">保存表单</a-button>
      </div>
    </div>
    <div class="item">
      <div class="label">RSS来源</div>
      <div class="item_content">
        <a-radio-group v-model:value="dl().data.type" button-style="solid" :disabled="dl().running">
          <a-radio-button value="mikan">Mikan</a-radio-button>
          <a-radio-button value="acgrip">Acgrip</a-radio-button>
        </a-radio-group>
        <i class="bi bi-box-arrow-up-right" @click="sourceLink"></i>
      </div>
    </div>
    <div class="item">
      <div class="label">更新频率</div>
      <div class="item_content">
        <a-input-number id="inputNumber" v-model:value="dl().data.freq" :min="10" :max="1440" :disabled="dl().running" />
        <div style="margin-left: 10px;">分钟</div>
      </div>
    </div>
    <div class="item">
      <div class="label">Aria 地址</div>
      <div class="item_content">
        <a-input v-model:value="dl().data.ariaLink" placeholder="http(s)://<ip>:16800/jsonrpc" :disabled="dl().running" />
      </div>
    </div>
    <div class="item">
      <div class="label">Aria 密钥</div>
      <div class="item_content">
        <a-input-password v-model:value="dl().data.ariaSecret" placeholder="" :disabled="dl().running" />
      </div>
    </div>
    <a-collapse style="margin-top: 20px;" v-model:activeKey="showFold">
      <a-collapse-panel key="1" header="番剧表">
        <a-button type="link" @click="dl().addBangumi" :disabled="dl().running">添加</a-button>
        <a-table :columns="dl().bangumiColumn" :data-source="dl().data.bangumi" :pagination="false">
          <template #headerCell="{ column }">
            <template v-if="column.key === 'ass'">
              <span>
                字幕组
              </span>
            </template>
            <template v-else-if="column.key === 'title'">
              <span>
                标题
              </span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                操作
              </span>
            </template>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'ass'">
              <a-tag>{{ record.ass }}</a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button type="link" danger @click="dl().delBangumi(record.ass, record.title)" :disabled="dl().running">删除</a-button>
            </template>
          </template>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="排除关键字">
        <a-button type="link" @click="dl().addExclusion" :disabled="dl().running">添加</a-button>
        <a-table :columns="dl().exclusionsColumn" :data-source="dl().data.exclusions" :pagination="false">
          <template #headerCell="{ column }">
            <template v-if="column.key === 'value'">
              <span>
                值
              </span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                操作
              </span>
            </template>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'value'">
              {{record}}
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button type="link" danger @click="dl().delExclusions(record)" :disabled="dl().running">删除</a-button>
            </template>
          </template>
        </a-table>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <InnerLoadingView v-else/>
  <a-modal v-model:open="dl().showAddBangumiDialog" title="添加一个番剧" @ok="dl().addBangumiOk" @cancel="dl().onDialogCancel" centered>
      <div class="bangumiItem" style="margin-top: 10px;">
        <div class="bangumiItem_title">字幕组</div>
        <div class="bangumiItem_content">
          <a-input v-model:value="dl().bangumiAddAss"></a-input>
        </div>
      </div>
      <div class="bangumiItem" style="margin-top: 10px;">
        <div class="bangumiItem_title">标题</div>
        <div class="bangumiItem_content">
          <a-input v-model:value="dl().bangumiAddTitle"></a-input>
        </div>
      </div>
    </a-modal>
    <a-modal v-model:open="dl().showAddExclusionDialog" title="添加一个排除关键字" @ok="dl().addExclusionOk" @cancel="dl().onDialogCancel" centered>
      <div class="exclutionItem" style="margin-top: 10px;">
        <div class="exclutionItem_title">关键字</div>
        <div class="exclutionItem_content">
          <a-input v-model:value="dl().exclusionAddValue"></a-input>
        </div>
      </div>
    </a-modal>
    <a-modal v-model:open="log().showLogDialog" title="日志" :cancel-button-props="{ style: { display: 'none' } }" okText="完成" @ok="log().showLogDialog=false" :width="width<720?width-20 : 700" centered>
      <div class="logContent">
        <div v-for="(item, index) in log().logContent" :key="index" :style="item.ok ? {'color': 'green'}:{'color': 'red'}" class="logItem">
          <div class="log_label">{{ item.msg }}</div>
          <div class="log_time">{{ dayjs(item.time).format("YYYY-MM-DD HH:mm") }}</div>
        </div>
      </div>
    </a-modal>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import Header from '@/components/Header.vue';
import token from '@/stores/token';
import { onMounted, ref } from 'vue';
import dl from '@/stores/dl';
import log from '@/stores/log';
document.title="AnimeHelper | 下载器";
import InnerLoadingView from '../loading/InnerLoadingView.vue';

let width=ref(800);

let showFold=ref(['1', '2']);

onMounted(()=>{
  token().getToken();
  dl().getStatus();
  dl().getForm();
  width.value=window.innerWidth;
})

const sourceLink=()=>{
  if(dl().data.type=='mikan'){
    window.open("https://mikanime.tv/");
  }else if(dl().data.type=="acgrip"){
    window.open("https://acgrip.art/")
  }
}
</script>

<style scoped>
.item_content{
  display: flex;
  align-items: center;
}
.bi-box-arrow-up-right{
  margin-left: 20px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
.item{
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