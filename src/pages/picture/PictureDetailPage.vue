<template>
<div id="pictureDetailPage">
  <div class="imageWindow">
    <a-image
      :src="picture.url"
      :alt="picture.name"
      :preview="false"
      style="width: 100%; height: auto; max-height: 800px; object-fit: contain;"
    />
  </div>
  <div class="picture-info">
    <p><strong>名称:</strong>{{picture.name}}</p>
    <p><strong>简介:</strong> {{ picture.introduction }}</p>
    <p><strong>类型:</strong> {{ picture.category }}</p>
    <p><strong>标签:</strong> {{ picture.tags?.join(',') || '无' }}</p>
    <p><strong>图片信息:</strong> {{ picture.introduction }}</p>
    <p><strong>创建用户:</strong> <a-image :src="picture.user?.userAvatar" style="height: 20px;border-radius: 5px"></a-image>  {{ picture.user?.userName }}</p>
    <p><strong>创建时间:</strong> {{ dayjs(picture.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
    <p><strong>编辑时间:</strong> {{ dayjs(picture.editTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
    <a-button type="primary" @click="doDownload">
      免费下载
      <template #icon>
        <DownloadOutlined />
      </template>
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
  display: flex;
}
#pictureDetailPage .imageWindow{
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  width: 70%;
  display: flex;
  justify-content: center;
}
#pictureDetailPage .pictureInfo{
  flex: 1;
}
</style>
