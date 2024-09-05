<template>
  <a-float-button @click="addHandler">
    <template #icon>
      <PlusOutlined />
    </template>
  </a-float-button>
  <Header></Header>
  <div class="body">
    <a-table :dataSource="dataSource" :columns="columns" :pagination="false" size="small" :scroll="{ x: 500 }" sticky>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'progress'">
          <a-progress :percent="record.now/record.episode*100" :showInfo="false" />
        </template>
        <template v-else-if="column.key === 'op'">
          <a>编辑</a>
          <a style="margin-left: 10px;">添加到下载器</a>
        </template>
        <template v-else-if="column.key === 'title'">
          <div style="display: grid; grid-template-columns: auto 70px;" v-if="record.onUpdate">
            <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ record.title }}</div>
            <div><a-tag style="margin-left: 5px;" color="green">更新中</a-tag></div>
          </div>
          <div v-else style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ record.title }}</div>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <p style="margin: 0">
          {{ record.title }}
        </p>
      </template>
      <template #expandColumnTitle>
        <PlusOutlined />
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { PlusOutlined } from "@ant-design/icons-vue";
import { ref } from 'vue';

document.title="AnimeHelper | 列表";

const addHandler=()=>{

}

interface ListItem{
  id: string,
  title: string,
  episode: number | undefined,
  now: number | undefined,
  onUpdate: boolean | undefined,
  time: string | undefined,
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
    width: 180
  },
]
const dataSource=ref<ListItem[]>([
  {
    id: "12121",
    title: "测试一个非常非常长的标题会显示什么",
    episode: 24,
    now: 20,
    onUpdate: true,
    time: undefined,
  },
]);

</script>

<style scoped>
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