<template>
  <div id="userManagePage">
    <a-form layout="inline" :model="searchParams" @finish="doSearch" class="searchForm">
      <a-form-item label="账户">
        <a-input v-model:value="searchParams.userAccount" allow-clear />
      </a-form-item>
      <a-form-item label="昵称">
        <a-input v-model:value="searchParams.userName" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">检索</a-button>
      </a-form-item>
    </a-form>
    <a-table :columns="columns" :data-source="dataList" :pagination="pagination">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-avatar :src="record[column.dataIndex]" />
        </template>
        <template v-if="column.dataIndex === 'userRole'">
          <div v-if="record[column.dataIndex] === ADMIN">
            <a-tag color="blue"> 管理员 </a-tag>
          </div>
          <div v-else>
            <a-tag color="green"> 普通用户 </a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record[column.dataIndex]).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.key === 'action'">
          <!--删除-->
          <a-popconfirm
            title="确定删除吗？"
            @confirm="() => handleDelete(record)"
            ok-text="确定"
            cancel-text="取消"
          ><a-button danger>删除</a-button></a-popconfirm
          >
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteUserUsingPost, listUserVoByPageUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { ADMIN } from '@/constants/UserRole.const.ts'
const columns = [
  {
    title: '账户',
    dataIndex: 'userAccount',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
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
const searchParams = reactive<API.UserQueryRequest>({
  currentPage: 1,
  pageSize: 10,
  userAccount: '',
  userName: '',
  userProfile: '',
  userRole: '',
})

// 分页
const pagination = computed(() => {
  return {
    current: searchParams.currentPage,
    pageSize: searchParams.pageSize,
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
  console.log(searchParams)
  // 重置页码，不然可能搜不到数据
  searchParams.currentPage = 1
  fetchData()
}
// 获取数据
const fetchData = async () => {
  const { data } = await listUserVoByPageUsingPost(searchParams)
  if (data.code === 0 && data.data) {
    dataList.value = data.data.records ?? []
    total.value = data.data.total ?? 0
  } else {
    message.error('获取数据失败')
  }
}

const handleDelete = async (record: API.UserVO) => {
  const { data } = await deleteUserUsingPost({ id: record.id } as API.DeleteRequest)
  if (data.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败')
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
