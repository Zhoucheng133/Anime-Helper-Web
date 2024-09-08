<template>
  <Header></Header>
  <div class="body">
    <div class="item">
      <div class="label">运行状态</div>
      <div class="item_content">
        <a-tag :color="dl().running ? 'success' : 'warning'" style="margin-right: 20px;">{{ dl().running ? '运行中' : "等待中" }}</a-tag>
        <a-switch v-model:checked="dl().running" @change="toggleRun" />
      </div>
    </div>
    <div class="item">
      <div class="label">系统操作</div>
      <div class="item_content">
        <a-button type="link">查看日志</a-button>
        <a-button type="link">保存表单</a-button>
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
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import token from '@/stores/token';
import { onMounted } from 'vue';
import dl from '@/stores/dl';

document.title="AnimeHelper | 下载器";

const toggleRun=()=>{

}

onMounted(()=>{
  token().getToken();
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
</style>