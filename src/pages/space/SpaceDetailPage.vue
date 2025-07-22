<template>
  <div id="SpaceDetailPage">
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}（私有空间）</h2>
      <a-space size="middle">
<!--        <a-button type="primary" :href="`/add_picture?spaceId=${space.id}`">-->
<!--          创建图片-->
<!--        </a-button>-->
        <a-button type="primary">
          <router-link :to="{path: '/add_picture', query: { spaceId: id }}">
            创建图片
          </router-link>
        </a-button>
        <a-tooltip
          :title="`占用空间 ${formatSpaceSize(space.totalSize??0)} / ${formatSpaceSize(space.maxSize??0)}`"
        >
          <a-progress
            type="circle"
            :percent="(((space.totalSize??0) * 100) / (space.maxSize??0)).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <!-- 图片列表 -->
    <PictureList :dataList="dataList" :loading="loading" :onReload="fetchData" show-operation/>
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
import { onMounted, ref } from 'vue'
import { DESC } from '@/constants/Database.const.ts'
import { listPictureVoByPageUsingPost } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController.ts'
import { formatSpaceSize } from '@/utils'
import PictureList from '@/components/PictureList.vue'

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
  const res = await listPictureVoByPageUsingPost(searchParams.value)
  if(res.data.code === 0 && res.data.data){
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  }
  loading.value = false
}
const onPageChange = (page: number) => {
  searchParams.value.currentPage = page
  fetchData()
}

onMounted(()=>{
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
