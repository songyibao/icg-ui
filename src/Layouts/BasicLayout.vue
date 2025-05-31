<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">Header</a-layout-header>
      <a-layout-content class="content"><router-view/></a-layout-content>
      <a-layout-footer class="footer">
        <a href="http://124.221.115.182:6001" target="_blank">智能协同云图库 by Syb</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
#basicLayout .header{
  background-color: #efefef;
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
  box-shadow: 0 2px 8px rgba(0, 21, 41, 0.06);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Ensure header is above other content */
}
#basicLayout .content{
  padding: 24px;
  margin-bottom: 60px; /* Footer height */
  margin-top: 64px; /* Header height */
  background-color: #fff;
  min-height: calc(100vh - 60px - 64px); /* Full height minus header and footer */
}

#basicLayout .footer {
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #efefef;
}
</style>
