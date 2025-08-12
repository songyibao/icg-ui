<template>
  <div id="basicLayout">
    <a-layout class="layout-wrapper">
      <a-layout-header class="layout-header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout>
        <a-layout-sider class="layout-sider">
          <GlobalSider />
        </a-layout-sider>
        <a-layout-content class="layout-content">
          <router-view />
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="layout-footer">
        yPic智能协同云图库, by Syb
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalSider from '@/components/GlobalSider.vue';
// 移除了未使用的 store 和 CSSProperties
</script>

<style scoped>
#basicLayout {
  /* 确保根容器占满整个视口 */
  height: 100vh;
  width: 100%;
}

.layout-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #ddd;
  height: 64px;
  padding-inline: 20px; /* 使用内联边距替代 text-align */
  line-height: 64px;
  flex-shrink: 0; /* 防止 Header 在 flex 布局中被压缩 */
}

.layout-sider {
  background: #fff;
  border-right: 1px solid #ddd;
  flex-shrink: 0; /* 防止 Sider 被压缩 */
}

.layout-content {
  /* flex: 1 让内容区自动填充剩余空间 */
  flex: 1;
  /* 当内容超出时，允许垂直滚动 */
  overflow-y: auto;
  padding: 10px;
  background: #f0f2f5; /* 使用一个更柔和的背景色 */
}

.layout-footer {
  background: #efefef;
  padding: 16px 0;
  text-align: center;
  flex-shrink: 0; /* 防止 Footer 被压缩 */
}

/* Ant Design Menu 样式覆盖 */
#basicLayout :deep(.ant-menu-root) {
  border: none !important;
}
</style>
