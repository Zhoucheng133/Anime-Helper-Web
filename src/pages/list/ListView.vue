<template>
  <Header></Header>
  <div class="body">
    hello?
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';

document.title="AnimeHelper | 列表";
</script>

<style scoped>
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