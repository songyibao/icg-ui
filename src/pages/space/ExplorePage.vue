<template>
  <div class="explore-page">
    <div class="section">
      <div class="section-header">
        <h2>人物 ({{ aiPersonClusterList.length }})</h2>
        <button class="rebuild-btn" @click="handleReconstructFaceCluster">
          重建人脸索引
        </button>
      </div>

      <div v-if="aiPersonClusterList.length > 0" class="person-grid">
        <div
          v-for="cluster in aiPersonClusterList"
          :key="cluster.id"
          class="person-card"
          @click="handleClusterClick(cluster)"
        >
          <div class="person-photo-container">
            <img
              :src="cluster.coverFacePictureUrl"
              :alt="cluster.displayName || '未命名'"
              class="person-photo"
              @load="handleImageLoad($event, cluster.coverFaceArea)"
            />
          </div>
          <div class="person-details">
            <div class="person-name">{{ cluster.displayName || '未命名' }}</div>
            <div class="person-count">{{ cluster.faceCount || 0 }} 张</div>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        暂无人物数据
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listPersionClusterUsingGet, reconstructPersonClusterUsingGet } from '@/api/aiPersonClusterController.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router';
const router = useRouter();

// 假设的 API 类型定义
namespace API {
  export interface AiPersonClusterVO {
    id: string;
    displayName: string | null;
    coverFacePictureUrl: string;
    coverFaceArea: {
      h?: number;
      w?: number;
      x?: number;
      y?: number;
    } | null;
    faceCount: number;
  }
}

// --- 主要改动点 ---
// 添加一个留白系数。值越大，人脸在圆形中显示的越小，周围的区域就越多。
// 1.0 表示人脸占满容器，1.8 表示我们希望展示的区域是人脸框的1.8倍。
const PADDING_FACTOR = 1.8;
// --- 改动结束 ---


const aiPersonClusterList = ref<API.AiPersonClusterVO[]>([])

const fetchAiPersonClusters = async () => {
  const res = await listPersionClusterUsingGet()
  if(res.data.code===0 && res.data.data) {
    aiPersonClusterList.value = res.data.data
  }
}

const handleClusterClick = (cluster) => {
  router.push({
    name: 'ClusterDetail',
    params: { id: cluster.id },
    query: { name: cluster.displayName || '未命名', count: cluster.faceCount }
  });
};

const handleReconstructFaceCluster = async() =>{
  const res = await reconstructPersonClusterUsingGet()
  if(res.data.code===0 && res.data.data) {
    message.success('开始重建人脸聚类任务，请稍后查看结果')
  }
}

const handleImageLoad = (event: Event, faceArea: API.AiPersonClusterVO['coverFaceArea']) => {
  const imgElement = event.target as HTMLImageElement;
  const container = imgElement.parentElement;

  if (!container) return;

  if (!faceArea || !faceArea.w || !faceArea.h) {
    imgElement.style.position = 'static';
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    imgElement.style.objectFit = 'cover';
    imgElement.style.left = '';
    imgElement.style.top = '';
    return;
  }

  const { x, y, w, h } = faceArea;
  const containerSize = container.clientWidth;

  const naturalWidth = imgElement.naturalWidth;
  const naturalHeight = imgElement.naturalHeight;

  if (naturalWidth === 0 || naturalHeight === 0) return;

  // --- 主要改动点 ---
  // 在计算缩放比例时，将人脸的宽高乘以留白系数，相当于让算法基于一个更大的虚拟框来计算缩放
  const scale = Math.max(containerSize / (w * PADDING_FACTOR), containerSize / (h * PADDING_FACTOR));
  // --- 改动结束 ---

  const newWidth = naturalWidth * scale;
  const newHeight = naturalHeight * scale;

  const left = (containerSize / 2) - ((x + w / 2) * scale);
  const top = (containerSize / 2) - ((y + h / 2) * scale);

  imgElement.style.position = 'absolute';
  imgElement.style.width = `${newWidth}px`;
  imgElement.style.height = `${newHeight}px`;
  imgElement.style.left = `${left}px`;
  imgElement.style.top = `${top}px`;
  imgElement.style.objectFit = 'initial';
  imgElement.style.transform = 'none';
}

onMounted(() => {
  fetchAiPersonClusters()
})
</script>

<style scoped>
/* 样式部分与上一版完全相同，此处省略以保持简洁 */
.explore-page {
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 40px;
  border-bottom: 1px solid #eee;
  padding-bottom: 30px;
}

.section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.rebuild-btn {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.rebuild-btn:hover {
  background: #40a9ff;
}

.status-badge {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.person-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.person-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.person-card:hover {
  background: #fafafa;
}

.person-photo-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
  border: 1px solid #e5e5e5;
  position: relative;
  background-color: #f0f0f0;
}

.person-photo {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: all 0.3s ease;
}

.person-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.person-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  text-align: center;
}

.person-count {
  color: #666;
  font-size: 12px;
}

.empty {
  text-align: center;
  color: #999;
  padding: 30px 0;
  font-size: 14px;
}
</style>
