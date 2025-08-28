<template>
  <div id="userLoginPage">
    <h2 class="title">yPic - 用户登陆</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码长度至少8位' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>
      <div class="tips">
        没有账号？
        <router-link to="/user/register">去注册</router-link>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { loginUsingPost } from '@/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { message } from 'ant-design-vue'

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})
const loginUserStore = useLoginUserStore()
const { isLogin } = storeToRefs(loginUserStore)

const goBackAfterLogin = () => {
  const redirect = router.currentRoute.value.query.redirect as string
  router.push({ path: redirect || '/', replace: true })
}

onMounted(async () => {
  // 若已登录，直接跳转回来源页/首页；否则尝试刷新登录态
  if (isLogin.value) {
    goBackAfterLogin()
  } else {
    await loginUserStore.fetchLoginUser()
    if (isLogin.value) {
      goBackAfterLogin()
    }
  }
})

const handleSubmit = async (values: API.UserLoginRequest) => {
  const { data } = await loginUsingPost(values)
  if (data.code === 0 && data.data) {
    loginUserStore.setLoginUser(data.data)
    if (isLogin.value) {
      message.success('登录成功')
      goBackAfterLogin()
    }
  }
}
</script>
<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 120px auto;
}
.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 16px;
}
.desc {
  text-align: center;
  color: #bbbbbb;
  font-size: 16px;
  margin-bottom: 16px;
}
.tips {
  text-align: right;
  color: #bbbbbb;
  margin-bottom: 12px;
}
</style>
