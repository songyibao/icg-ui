<template>
  <div id="basicLayout">
    <GlobalHeader class="header"/>
    <div class="content">
      <RouterView />
    </div>
    <div class="footer">yPic智能协同云图库, by Syb</div>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
#basicLayout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使用 vh 单位确保占满整个视口高度 */
  width: 100%;
}

#basicLayout .header {
  position: fixed; /* 固定在视口顶部 */
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1; /* 确保 header 在最上层 */
  background: #fff;
  /* 假设 header 高度为 60px，可以根据实际情况调整 */
  height: 50px;
}

#basicLayout .content {
  flex: 1; /* 占据剩余的所有空间 */
  /* 设置上内边距，防止内容被 header 遮挡，值应等于 header 的高度 */
  padding: calc(50px + 10px) 10px 10px 10px;
  overflow-y: auto; /* 当内容溢出时，仅内容区域出现滚动条 */
}

#basicLayout .footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0; /* 增加一些内边距让页脚更好看 */
  flex-shrink: 0; /* 防止页脚被压缩 */
}
</style>
