<template>
  <div id="userRegisterPage">
    <h2 class="title">yPic - 用户登陆</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form
      ref="formRef"
      name="custom-validation"
      :model="formState"
      :rules="rules"
      @finish="handleFinish"
      @validate="handleValidate"
    >
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item has-feedback name="userPassword">
        <a-input
          v-model:value="formState.userPassword"
          type="password"
          autocomplete="off"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item has-feedback name="checkPassword">
        <a-input
          v-model:value="formState.checkPassword"
          type="password"
          autocomplete="off"
          placeholder="请确认密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">Submit</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { type FormInstance, message } from 'ant-design-vue'
import { registerUsingPost } from '@/api/userController.ts'
import router from '@/router'
const formRef = ref<FormInstance>()
const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})
const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码')
  } else if (value.length < 8) {
    return Promise.reject('密码长度至少8位')
  } else {
    if (formState.checkPassword !== '') {
      formRef.value.validateFields('checkPassword')
    }
    return Promise.resolve()
  }
}
const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请确认密码')
  } else if (value !== formState.userPassword) {
    return Promise.reject('两次输入的密码不一致')
  } else {
    return Promise.resolve()
  }
}

const rules: Record<string, Rule[]> = {
  userPassword: [{ required: true, validator: validatePass, trigger: 'change' }],
  checkPassword: [{ validator: validatePass2, trigger: 'change' }],
}
const handleFinish = async (values: API.UserRegisterRequest) => {
  console.log(values, formState)
  const { data } = await registerUsingPost(values)
  if (data) {
    if (data.code === 0) {
      message.success('注册成功，正在前往登录页面')
      // 跳转到登录页面
      router.push({ path: '/user/login', replace: true })
    } else {
      message.error(data.message)
    }
  }
}
const resetForm = () => {
  formRef.value.resetFields()
}
const handleValidate = (...args) => {
  console.log(args)
}
</script>
<style scoped>
#userRegisterPage {
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
