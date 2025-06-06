<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <GlobalHeader />
      <a-layout-content class="content"><RouterView /></a-layout-content>
      <a-layout-footer class="footer">yPic智能协同云图库,by Syb</a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>
<style scoped>
#basicLayout .header {
  background: #ffffff;
  color: #fff;
}

#basicLayout .content {
  margin: 8px;
  padding: 16px;
  background: #fff;
}
#basicLayout .footer {
  display: flex;
  justify-content: center;
  align-items: center;

  background: #efefef;
}
</style>
