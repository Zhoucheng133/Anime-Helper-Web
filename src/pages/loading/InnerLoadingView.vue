<template>
  <div class="bg">
    <LoadingOutlined class="icon" />
    <div class="label">加载中</div>
  </div>
</template>

<script setup lang="ts">
import { LoadingOutlined } from '@ant-design/icons-vue';
</script>

<style>
.icon{
  margin-bottom: 10px;
  font-size: 20px;
}
.bg{
  width: 100%;
  height: calc(100vh - 110px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>