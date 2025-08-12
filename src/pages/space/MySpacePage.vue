<template>
  <div id="mySpace">
    <p>正在跳转，请稍候...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSpaceVoByLoginUserUsingGet } from '@/api/spaceController'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const router = useRouter()
const loginUserStore = useLoginUserStore()

// 检查用户是否有个人空间
const checkUserSpace = async () => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser?.id) {
    router.replace('/user/login')
    return
  }
  const res = await getSpaceVoByLoginUserUsingGet()
  if (res.data.code === 0 && res.data.data) {
    const space = res.data.data
    if (space.id) {
      // 如果有空间，跳转到空间详情页
      await router.replace(`/space/${space.id}`)
    } else {
      message.error('加载我的空间失败，' + res.data.message)
    }
  }
}

// 在页面加载时检查用户空间
onMounted(() => {
  checkUserSpace()
})
</script>
