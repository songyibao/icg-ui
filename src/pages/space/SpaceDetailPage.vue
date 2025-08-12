<template>
  <div id="SpaceDetailPage">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}</h2>
      <a-space size="middle">
        <!--        <a-button type="primary" :href="`/add_picture?spaceId=${space.id}`">-->
        <!--          创建图片-->
        <!--        </a-button>-->
        <a-button type="primary" v-if="canUploadPicture">
          <router-link :to="{ path: '/add_picture', query: { spaceId: id } }">
            创建图片
          </router-link>
        </a-button>
        <a-button
          type="primary"
          ghost
          :icon="h(BarChartOutlined)"
          :href="`/space_analyze?spaceId=${id}`"
          target="_blank"
        >
          空间分析
        </a-button>
        <a-button
          v-if="canManageSpaceUser"
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          :href="`/spaceUserManage/${id}`"
          target="_blank"
        >
          成员管理
        </a-button>

        <a-tooltip
          :title="`占用空间 ${formatSpaceSize(space.totalSize ?? 0)} / ${formatSpaceSize(space.maxSize ?? 0)}`"
        >
          <a-progress
            type="circle"
            :percent="(((space.totalSize ?? 0) * 100) / (space.maxSize ?? 0)).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <!-- 搜索表单 -->
    <PictureSearchForm :onSearch="onSearch" />
    <!-- 按颜色搜索 -->
    <a-form-item label="按颜色搜索" style="margin-top: 16px">
      <color-picker format="hex" @pureColorChange="onColorChange" />
    </a-form-item>
    <div style="height: 5px"></div>
    <!-- 图片列表 -->
    <PictureList
      :dataList="dataList"
      :loading="loading"
      :onReload="fetchData"
      show-operation
      :can-delete="canDeletePicture"
      :can-edit="canEditPicture"
    />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.currentPage"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
      @change="onPageChange"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, h, watch } from 'vue'
import { BarChartOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue'
import { DESC } from '@/constants/Database.const.ts'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController.ts'
import { formatSpaceSize } from '@/utils'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import { SPACE_PERMISSION_ENUM, SPACE_TYPE_ENUM } from '@/constants/Space.const.ts'

const props = defineProps<{
  id: number
}>()
const space = ref<API.SpaceVO>({})

const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(false)
const searchParams = ref<API.PictureQueryRequest>({
  currentPage: 1,
  pageSize: 10,
  spaceId: props.id,
  sortField: 'createTime',
  sortOrder: DESC,
})

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)
const onColorChange = async (color: string) => {
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

const fetchSpaceDetail = async () => {
  if (!props.id) {
    message.error('空间参数为空')
    return
  }
  const res = await getSpaceVoByIdUsingGet({
    id: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    space.value = res.data.data
  } else {
    message.error('获取空间信息失败')
  }
}
const fetchData = async () => {
  loading.value = true
  const res = await listPictureVoByPageUsingPost({
    ...searchParams.value,
    spaceId: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  }
  loading.value = false
}
const onSearch = (params: API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...params,
    currentPage: 1, // 重置到第一页
  }
  fetchData()
}
const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.currentPage = page
  searchParams.value.pageSize = pageSize
  fetchData()
}
watch(
  () => props.id,
  (newSpaceId) => {
    fetchSpaceDetail()
    fetchData()
  },
)

onMounted(() => {
  fetchSpaceDetail()
  fetchData()
  // 获取空间信息
  if (props.id) {
    space.value = {
      id: props.id,
      spaceName: '加载中...',
      maxSize: 0,
      totalSize: 0,
      maxCount: 0,
    }
  }
})
</script>
<style scoped></style>
