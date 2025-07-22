<template>
  <div id="addSpacePage">
    <h2 class="title">{{buttonText}}空间</h2>
    <a-form layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item
        label="名称"
        name="spaceName"
        rules="[{ required: true, message: '空间名称不能为空' }]"
      >
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="空间等级" name="spaceLevel">
        <a-select :options="SPACE_LEVEL_OPTIONS" v-model:value="spaceForm.spaceLevel"></a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">{{buttonText}}</a-button>
      </a-form-item>
    </a-form>
    <!-- 展示空间等级相关的配额信息 -->
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        * 目前仅支持开通普通版，如需升级空间，请联系管理员。
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in sapceLevelList" :key="spaceLevel.value">
        {{ spaceLevel.text }}： 大小 {{ formatSpaceSize(spaceLevel.maxSize ?? 0) }}， 数量
        {{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/spaceController.ts'
import { SPACE_LEVEL_OPTIONS } from '@/constants/Space.const.ts'
import { formatSpaceSize } from '@/utils'
import { useRoute } from 'vue-router'
import router from '@/router'

// export type API.SpaceLevel = {
//   maxCount?: number
//   maxSize?: number
//   text?: string
//   value?: number
// }
const route = useRoute()
const oldSpace = ref<API.SpaceVO>()
const sapceLevelList = ref<API.SpaceLevel[]>([])
const spaceForm = reactive<API.SpaceAddRequest>({})
const buttonText = ref('创建')
/**
 * 提交表单
 * @param values
 */
const handleSubmit = async () => {
  if (spaceForm.spaceLevel !== 0) {
    message.warning('目前仅支持开通普通版空间，请联系管理员进行升级')
    return
  }
  const spaceId = oldSpace.value?.id
  if (spaceId) {
    // 更新
    const params: API.SpaceUpdateRequest = {
      id: spaceId,
      spaceName: spaceForm.spaceName,
    }
    const res = await updateSpaceUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('更新成功')
      // 跳转到空间详情页
      router.push({
        path: router.currentRoute.value.query.redirect as string || '/',
        replace: true
      })
    }
  } else {
    const res = await addSpaceUsingPost(spaceForm)
    if (res.data.code === 0 && res.data.data) {
      message.success('创建成功')
      router.push({
        path: router.currentRoute.value.query.redirect as string || '/',
        replace: true
      })
    }
  }
}
// 获取老数据
const getOldSpace = async () => {
  // 获取数据
  const id = route.query?.id
  if (id) {
    const res = await getSpaceVoByIdUsingGet({
      id: id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      oldSpace.value = data
      spaceForm.spaceName = data.spaceName
      spaceForm.spaceLevel = data.spaceLevel
      buttonText.value = '更新'
    }
  }
}
const getSpaceLevelInfo = async () => {
  // 获取空间等级相关的配额信息
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    sapceLevelList.value = res.data.data
  } else {
    message.error('获取空间等级信息失败，' + res.data.message)
  }
}

onMounted(() => {
  // 获取空间等级相关的配额信息
  getSpaceLevelInfo()
  getOldSpace()
})
</script>
<style scoped>
#addSpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
