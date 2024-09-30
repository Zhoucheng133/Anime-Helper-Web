<template>
  <PageHeader class="header" :login="true" :page-name="'list'" />
  <div class="body">
    <a-table :dataSource="list" :columns="listColumn" :pagination="false" size="small" :scroll="{ x: 500 }" sticky>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'progress'">
          <a-progress :percent="record.now/analyseEpisode(record as BangumiItem)*100" :showInfo="false" />
        </template>
        <template v-else-if="column.key === 'op'">
          <a style="user-select: none;" @click="openEdit(record as BangumiItem)">编辑</a>
          <a style="margin-left: 10px; user-select: none;" @click="addDownloader(record.title)">添加到...</a>
          <a style="margin-left: 10px; user-select: none;" @click="minus_one(record as BangumiItem)">
            <i class="bi bi-dash-circle-fill"></i>
          </a>
          <a style="margin-left: 10px; user-select: none;" @click="add_one(record as BangumiItem)">
            <i class="bi bi-plus-circle-fill"></i>
          </a>
          <a style="margin-left: 10px; user-select: none;" @click="del_item(record as BangumiItem)">
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
            {{ analyseEpisode(record as BangumiItem) }}
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
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';
import init from '~/hooks/init';
import { getList, type BangumiItem, listColumn, analyseEpisode, calculateEpisodesReleased } from '~/hooks/list';

const del_item=(record: BangumiItem)=>{

}

const add_one=(record: BangumiItem)=>{

}

const minus_one=(record: BangumiItem)=>{

}

const addDownloader=(title: string)=>{

}

const openEdit=(record: BangumiItem)=>{

}

let list=ref<BangumiItem[]>([]);
let showEdit=ref(false);
let showAdd=ref(false);
let showDownloader=ref(false);

useHead({
  title: 'AnimeHelper | 列表'
})

const islogin=await init();
if(!islogin){
  onMounted(()=>{
    window.location.href='/login';
  })
}else{
  list.value=await getList();
}

</script>