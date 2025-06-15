<template>
<div id="pictureDetailPage">
  <div class="imageWindow">
    <a-image
      :src="picture.url"
      :alt="picture.name"
      :preview="false"
      class="responsive-image"
    />
  </div>
  <div class="picture-info">
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">名称:</span>
        <span class="info-content">{{ picture.name }}</span>
      </div>

      <div class="info-item">
        <span class="info-label">简介:</span>
        <span class="info-content">{{ picture.introduction }}</span>
      </div>

      <div class="info-item">
        <span class="info-label">类型:</span>
        <span class="info-content">{{ picture.category }}</span>
      </div>

      <div class="info-item">
        <span class="info-label">标签:</span>
        <span class="info-content">{{ picture.tags?.join(',') || '无' }}</span>
      </div>

      <div class="info-item">
        <span class="info-label">创建用户:</span>
        <span class="info-content user-info">
        <a-image
          :src="picture.user?.userAvatar"
          style="height: 20px;width: 20px; border-radius: 5px; margin-right: 8px"
        />
        {{ picture.user?.userName }}
      </span>
      </div>

      <div class="info-item">
        <span class="info-label">创建时间:</span>
        <span class="info-content">{{ dayjs(picture.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </div>

      <div class="info-item">
        <span class="info-label">编辑时间:</span>
        <span class="info-content">{{ dayjs(picture.editTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </div>
    </div>

    <a-button
      type="primary"
      @click="doDownload"
      class="download-btn"
    >
      <DownloadOutlined />
      免费下载
    </a-button>
  </div>
</div>
</template>
<script setup lang="ts">
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { getPictureVoByIdUsingGet } from '@/api/pictureController.ts'
import dayjs from 'dayjs'
import { downloadImage } from '@/utils'

const props = defineProps<{
  id: string | number
}>()
const picture = ref<API.PictureVO>({})

// 获取图片详情
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取图片详情失败：' + e.message)
  }
}
// 处理下载
const doDownload = () => {
  downloadImage(picture.value.url,picture.value.name+'.'+picture.value.picFormat)
}

onMounted(() => {
  fetchPictureDetail()
})

</script>
<style scoped>
#pictureDetailPage{
  height: calc(100% - 20px);
  display: flex;
  margin: 10px;
  flex-direction: row;
}
#pictureDetailPage .imageWindow {
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  width: 70%;
  height: 100%; /* 设置一个固定高度或使用其他适合的值 */
  display: flex;
  justify-content: center;
  align-items: center; /* 垂直居中 */
}
.responsive-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持比例，完整显示图片 */
  /* 或者使用 object-fit: cover; 填充容器，可能会裁剪图片 */
}
#pictureDetailPage .picture-info {
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px 24px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
  margin-right: 8px;
}

.info-content {
  flex: 1;
  word-break: break-word;
}

.user-info {
  display: flex;
  align-items: center;
}

.download-btn {
  margin-top: 8px;
}
</style>
