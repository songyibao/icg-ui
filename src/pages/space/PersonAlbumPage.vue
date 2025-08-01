<template>
  <div class="person-album-page">
    <a-page-header
      :title="pageTitle"
      :sub-title="`共 ${photos.length} 张照片`"
      @back="goBack"
    />

    <div class="page-content">
      <div v-if="isLoading" class="loading-container">
        <a-spin size="large" />
      </div>

      <a-empty v-else-if="photos.length === 0" description="暂无照片" />

      <div v-else class="photo-grid">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="photo-card"
          @click="openPhotoModal(photo)"
        >
          <img :src="photo.pictureUrl" :alt="`Photo ${photo.id}`" class="photo-img" loading="lazy" />
        </div>
      </div>
    </div>

    <a-modal
      v-model:open="isModalVisible"
      :title="modalTitle"
      :footer="null"
      centered
      width="80vw"
      class="photo-modal"
    >
      <img
        v-if="selectedPhoto"
        :src="selectedPhoto.pictureUrl"
        alt="Selected Photo"
        style="width: 100%; height: auto; display: block;"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PageHeader as APageHeader, Spin as ASpin, Empty as AEmpty, Modal as AModal } from 'ant-design-vue';
import { listClusterDetectedFacesUsingGet } from '@/api/aiPersonClusterController.ts'


// --- 响应式状态定义 ---

const photos = ref<API.AiDetectedFaceVO[]>([]);
const isLoading = ref(true);
const isModalVisible = ref(false);
const selectedPhoto = ref<API.AiDetectedFaceVO | null>(null);

const route = useRoute();
const router = useRouter();



// --- 页面生命周期与事件处理 ---

onMounted(async () => {
  const clusterId = route.params.id as string;
  if (!clusterId) {
    console.error("未在路由中找到 clusterId！");
    isLoading.value = false;
    // 可以选择性地导航回上一页或显示错误信息
    // router.back();
    return;
  }

  isLoading.value = true;
  const res = await listClusterDetectedFacesUsingGet({
    id:clusterId
  });
  if(res.data.code === 0 && res.data.data) {
    photos.value = res.data.data;
  } else {
    console.error("获取照片列表失败:", res.data.message);
    // 可在此处添加错误提示，例如使用 antd-vue 的 message.error
  }
  isLoading.value = false;
});

const goBack = () => {
  router.back();
};

const openPhotoModal = (photo: API.AiDetectedFaceVO) => {
  selectedPhoto.value = photo;
  isModalVisible.value = true;
};


// --- 计算属性 ---

// 从路由的查询参数中获取人物名称，提供更好的用户体验
const personName = computed(() => route.query.name || '未命名人物');

const pageTitle = computed(() => `${personName.value}的相册`);

const modalTitle = computed(() => `照片预览 (ID: ${selectedPhoto.value?.id || 'N/A'})`);

</script>

<style scoped>
.person-album-page {
  background-color: #fff;
  min-height: 100vh;
}

.page-content {
  padding: 0 24px 24px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.photo-grid {
  display: grid;
  /* 响应式网格布局，最小列宽150px，最大1fr，自动填充 */
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.photo-card {
  /* 保持1:1的正方形比例 */
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #f0f0f0; /* 图片加载时的占位背景色 */
}

.photo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.photo-img {
  width: 100%;
  height: 100%;
  /* 保证图片不变形地填满容器 */
  object-fit: cover;
}

/* 移除Modal的内边距，让图片填满 */
:deep(.photo-modal .ant-modal-body) {
  padding: 0;
}
</style>
