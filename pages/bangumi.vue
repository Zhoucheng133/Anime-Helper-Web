<template>
  <PageHeader class="header" :login="true" :page-name="'bangumi'" />
  <div class="body">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="0" header="星期日">
        <a-flex wrap="wrap" gap="middle">
          <UBadge class="item" v-for="(item, index) in list[0]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 0)">{{ item }}</UBadge>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="1" header="星期一">
        <a-flex wrap="wrap" gap="middle">
          <UBadge class="item" v-for="(item, index) in list[1]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 1)">{{ item }}</UBadge>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="星期二">
        <a-flex wrap="wrap" gap="middle">
          <UBadge class="item" v-for="(item, index) in list[2]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 2)">{{ item }}</UBadge>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="星期三">
        <a-flex wrap="wrap" gap="middle">
          <UBadge class="item" v-for="(item, index) in list[3]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 3)">{{ item }}</UBadge>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="4" header="星期四">
        <a-flex wrap="wrap" gap="middle">
          <UBadge class="item" v-for="(item, index) in list[4]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 4)">{{ item }}</UBadge>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="5" header="星期五">
        <a-flex wrap="wrap" gap="middle">
          <UBadge class="item" v-for="(item, index) in list[5]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 5)">{{ item }}</UBadge>
        </a-flex>
      </a-collapse-panel>
      <a-collapse-panel key="6" header="星期六">
        <a-flex wrap="wrap" gap="middle">
          <UBadge class="item" v-for="(item, index) in list[6]" :key="index" :color="follow(item) ? 'blue' : 'gray'" @click="addHandler(item, 6)">{{ item }}</UBadge>
        </a-flex>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';
import { initUpdates } from '~/hooks/bangumi';
import init from '~/hooks/init';
import { initList, type BangumiItem } from '~/hooks/list';

let list=ref<string[][]>([]);
let followList=ref<BangumiItem[]>([])

useHead({
  title: 'AnimeHelper | 每日放送'
})

const addHandler=(title: string, weekday: number)=>{

}

const follow=(title: string): boolean=>{
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
.item{
  font-size: 15px;
  user-select: none;
  /* padding: 5px; */
  cursor: pointer;
}
</style>