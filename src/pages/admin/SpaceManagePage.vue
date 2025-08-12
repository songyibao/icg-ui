<template>
  <div id="spaceManagePage">
    <a-form layout="inline" :model="searchParams" @finish="doSearch" class="searchForm">
      <a-form-item label="空间名称">
        <a-input v-model:value="searchParams.spaceName" allow-clear />
      </a-form-item>
      <a-form-item label="空间级别">
        <a-select
          v-model:value="searchParams.spaceLevel"
          placeholder="请选择空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          style="min-width: 180px"
          allow-clear
        >
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">检索</a-button>
      </a-form-item>
      <a-space>
        <a-button type="primary" href="/add_space" target="_blank">+ 创建空间</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1" target="_blank">
          分析公共图库
        </a-button>
        <a-button type="primary" ghost href="/space_analyze?queryAll=1" target="_blank">
          分析全空间
        </a-button>
      </a-space>
    </a-form>
    <a-table :columns="columns" :data-source="dataList" :pagination="pagination">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <a-tag :color="SPACE_LEVEL_A_TAG_COLOR_MAP[record.spaceLevel]">
            {{ SPACE_LEVEL_MAP[record.spaceLevel] }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'spaceType'">
          <a-tag :color="SPACE_TYPE_A_TAG_COLOR_MAP[record.spaceType]">
            {{ SPACE_TYPE_MAP[record.spaceType] }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>
            大小：{{ formatSpaceSize(record.totalSize) }} / {{ formatSpaceSize(record.maxSize) }}
          </div>
          <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record[column.dataIndex]).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs(record[column.dataIndex]).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.key === 'action'">
          <!--删除-->
          <a-popconfirm
            title="确定删除吗？"
            @confirm="() => handleDelete(record)"
            ok-text="确定"
            cancel-text="取消"
          >
            <a-button danger>删除</a-button>
          </a-popconfirm>
          <a-button type="link" @click="goToUpdatePage(record.id)">编辑</a-button>
          <a-button type="link" :href="`/space_analyze?spaceId=${record.id}`" target="_blank">
            分析
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { DESC } from '@/constants/Database.const.ts'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController.ts'
import {
  SPACE_LEVEL_A_TAG_COLOR_MAP,
  SPACE_LEVEL_MAP,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_A_TAG_COLOR_MAP,
  SPACE_TYPE_ENUM,
  SPACE_TYPE_MAP,
} from '@/constants/Space.const.ts'
import { formatSpaceSize } from '@/utils'
import { useRoute } from 'vue-router'
import router from '@/router'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '空间类别',
    dataIndex: 'spaceType',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref<API.UserVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  currentPage: 1,
  pageSize: 10,
  spaceName: '',
  sortField: 'createTime',
  sortOrder: DESC,
})

// 分页
const pagination = computed(() => {
  return {
    current: searchParams.currentPage ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number) => {
      searchParams.currentPage = page
      fetchData()
    },
    onShowSizeChange: (current: number, size: number) => {
      searchParams.currentPage = current
      searchParams.pageSize = size
      fetchData()
    },
  }
})
// 搜索数据
const doSearch = () => {
  // 重置页码，不然可能搜不到数据
  searchParams.currentPage = 1
  fetchData()
}
// 获取数据
const fetchData = async () => {
  const { data } = await listSpaceByPageUsingPost(searchParams)
  if (data.code === 0 && data.data) {
    dataList.value = data.data.records ?? []
    total.value = data.data.total ?? 0
  } else {
    message.error('获取数据失败')
  }
}
const handleDelete = async (record: API.UserVO) => {
  const { data } = await deleteSpaceUsingPost({ id: record.id } as API.DeleteRequest)
  if (data.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败')
  }
}
const goToUpdatePage = (itemId: number) => {
  router.push({
    name: 'createSpace',
    query: { id: itemId, redirect: router.currentRoute.value.fullPath },
  })
}
const goToAddPage = () => {
  router.push({
    name: 'createSpace',
    query: { redirect: router.currentRoute.value.fullPath },
  })
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})
</script>
<style scoped>
.searchForm {
  margin-bottom: 16px;
}
</style>
