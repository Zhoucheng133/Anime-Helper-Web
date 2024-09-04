<template>
  <Header></Header>
  <div class="body">
    bangumi
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';

document.title="AnimeHelper | 每日更新";
</script>

<style scoped>
.body{
  margin: auto;
  width: 1000px;
}
@media screen and (max-width: 1000px) {
  .body {
    width: 100%
  }
}
</style>