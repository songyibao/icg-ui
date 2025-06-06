<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <BasicLayout />
    </div>
  </a-config-provider>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { ref } from 'vue'
import '@/access.ts'
const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
const locale = ref(zhCN)
</script>

<style scoped></style>
