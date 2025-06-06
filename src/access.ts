import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import { ADMIN } from '@/constants/UserRole.const.ts';
let firstFetchLoginUser = true
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    firstFetchLoginUser = false
  }
  const loginUser = loginUserStore.loginUser
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')) {
    if (!loginUser) {
      message.error('请先登录')
      next({ path: '/login?redirect=' + toUrl })
    } else if (loginUser.userRole !== ADMIN) {
      message.error('无权限')
      next({ path: '/' })
    }else{
      next();
    }
  }else{
    next()
  }
})
