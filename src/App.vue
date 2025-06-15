<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>
<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import '@/access.ts'
const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
</script>

<style>
* {
  box-sizing: border-box;
}
html,body,#app{
  height: 100vh;
}
</style>
