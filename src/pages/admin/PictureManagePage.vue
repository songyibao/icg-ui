<template>
  <div id="userManagePage">
    <a-modal
      v-model:open="modalVisible"
      title="批量创建图片"
      :confirm-loading="confirmLoading"
      width="70%"
      wrap-class-name="full-modal"
      @ok="handleUploadPictureByBatch"
    >
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" :model="batchParams">
        <!-- 批量抓取图片表单参数，包括数量、搜索关键词 -->
        <a-form-item label="数量" name="count">
          <a-input-number v-model:value="batchParams.count" :min="1" :max="30" />
        </a-form-item>
        <a-form-item label="关键词" name="searchText">
          <a-input
            v-model:value="batchParams.searchText"
            placeholder="请输入关键词"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="图片名称前缀" name="searchText">
          <a-input
            v-model:value="batchParams.namePrefix"
            placeholder="请指定图片名称前缀，留空默认使用关键词"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-flex>
        <a-button type="primary" href="/add_picture" target="_blank">+ 创建图片</a-button>
        <a-button type="primary" style="margin-left: 10px" @click="showModal">批量创建</a-button>
      </a-flex>
    </a-flex>
    <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 16px">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="类型" name="category">
        <a-input v-model:value="searchParams.category" placeholder="请输入类型" allow-clear />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          placeholder="请输入标签"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="审核状态" name="reviewStatus">
        <a-select
          v-model:value="searchParams.reviewStatus"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          placeholder="请选择审核状态"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">筛选</a-button>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :width="120" style="border: #f0f1f2 1px solid" />
        </template>
        <!-- 标签 -->
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
          </a-space>
        </template>
        <!-- 图片信息 -->
        <template v-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picScale }}</div>
          <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'reviewStatus'">
          <!-- 居中显示上面的icon -->
          <div style="text-align: center">
            <CheckOutlined
              v-if="record.reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS"
              style="color: #52c41a"
            />
            <CloseOutlined
              v-else-if="record.reviewStatus === PIC_REVIEW_STATUS_ENUM.REJECT"
              style="color: #ff4d4f"
            />
            <ClockCircleOutlined v-else style="color: #faad14" />
          </div>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="link"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
              >通过
            </a-button>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              danger
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
              >拒绝
            </a-button>
            <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank"
              >编辑</a-button
            >
            <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost, uploadPictureByBatchUsingPost
} from '@/api/pictureController.ts'
import { DESC } from '@/constants/Database.const.ts'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/Picture.const.ts'
const modalVisible = ref<boolean>(false)
const showModal = () => {
  modalVisible.value = true
}
const confirmLoading = ref<boolean>(false)
const batchParams = reactive<API.PictureUploadByBatchRequest>({
  count: 10,
  searchText: undefined,
  namePrefix: undefined
})
const handleUploadPictureByBatch = async() =>{
  confirmLoading.value = true
  const res = await uploadPictureByBatchUsingPost(batchParams)
  if (res.data.code === 0) {
    message.success('批量创建图片成功')
    modalVisible.value = false
    confirmLoading.value = false
    // 重新获取列表
    fetchData()
  } else {
    message.error('批量创建图片失败，' + res.data.message)
  }
}
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '图片',
    dataIndex: 'url',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'category',
  },
  {
    title: '标签',
    dataIndex: 'tags',
  },
  // {
  //   title: '图片信息',
  //   dataIndex: 'picInfo',
  // },
  // {
  //   title: '用户 id',
  //   dataIndex: 'userId',
  //   width: 80,
  // },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '审核信息',
    dataIndex: 'reviewStatus',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  currentPage: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: DESC,
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.currentPage ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0) {
    message.success('审核操作成功')
    // 重新获取列表
    fetchData()
  } else {
    message.error('审核操作失败，' + res.data.message)
  }
}

// 获取数据
const fetchData = async () => {
  console.log(searchParams)
  // const res = await listPictureByPageUsingPost(searchParams)
  const res = await listPictureByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 获取数据
const doSearch = () => {
  // 重置搜索条件
  searchParams.currentPage = 1
  fetchData()
}

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.currentPage = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
const handleDelete = async (record: API.PictureVO) => {
  const res = await deletePictureUsingPost({ id: record.id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 重新获取数据
    fetchData()
  } else {
    message.error('删除失败，' + res.data.message)
  }
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
