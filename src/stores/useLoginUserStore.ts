import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet, logoutUsingPost } from '@/api/userController.ts'

export const useLoginUserStore = defineStore('loginUser', () => {
  const isLogin = ref(false)
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })

  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 0 && res.data.data) {
      setLoginUser(res.data.data)
    }
  }
  async function logout() {
    const res = await logoutUsingPost()
    if (res.data.code === 0) {
      isLogin.value = false
      loginUser.value = { userName: '未登录' }
    }
  }
  function setLoginUser(user: any) {
    loginUser.value = user
    isLogin.value = true
  }
  return { isLogin, loginUser, fetchLoginUser, setLoginUser, logout }
})
