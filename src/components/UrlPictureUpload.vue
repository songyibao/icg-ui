

<template>
  <div id="urlPictureUpload">
    <a-input-group compact style="margin-bottom: 16px">
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" placeholder="请输入图片 URL" />
      <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 120px">提交</a-button>
    </a-input-group>
    <div class="imgHolder">
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    </div>
  </div>

</template>
<script setup lang="ts">
import { uploadPictureUrlUsingPost } from '@/api/pictureController.ts'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()
const loading = ref<boolean>(false)
const fileUrl = ref<string>()
const handleUpload = async () =>{
  if (!fileUrl.value) {
    message.error('请输入图片 URL')
    return
  }
  loading.value = true
  const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
  if(props.spaceId) {
    params.spaceId = props.spaceId
  }
  if(props.picture) {
    params.id = props.picture.id
  }
  const res = await uploadPictureUrlUsingPost(params)
  loading.value = false
  if (res.data.code === 0 && res.data.data) {
    message.success('图片上传成功')
    // 将上传成功的图片信息传递给父组件
    props.onSuccess?.(res.data.data)
  } else {
    message.error('图片上传失败，' + res.data.message)
  }
}

</script>
<style scoped>
#urlPictureUpload .imgHolder {
  width: 100%;
  border: 1px dashed #ccc;
  border-radius: 5px;
  background: #fbfbfb;

}
#urlPictureUpload .imgHolder img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
}
</style>
