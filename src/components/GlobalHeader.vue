<template>
  <div id="globalHeader">
    <a-row :wrap="false" style="height: 100%;display: flex;align-items: center">
      <a-col flex="120px">
        <div class="title-bar">
          <img class="logo" src="@/assets/logo.png" alt="logo" />
          <div class="title">yPic云图库</div>
        </div>
      </a-col>
      <a-col flex="auto" >
        <div style="padding: 0 10px;">
          <a-menu
            class="menu"
            v-model:selectedKeys="current"
            mode="horizontal"
            :items="items"
            @click="doMenuClick"
            style="border-bottom: none"
          />
        </div>
      </a-col>
      <a-col flex="100px">
        <div class="login-status">
          <div v-if="loginUserStore.isLogin">
            <a-dropdown placement="bottomRight">
              <div style="display: flex; align-items: center">
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser?.userName }}
              </div>
              <template #overlay>
                <a-menu>
                  <!--                  <a-menu-item key="/setting">-->
                  <!--                    <setting-outlined />-->
                  <!--                    设置-->
                  <!--                  </a-menu-item>-->
                  <a-menu-item>
                    <router-link to="/my_space" >
                      <UserOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>
                  <a-menu-item
                    key="/logout"
                    style="text-align: center"
                    @click="loginUserStore.logout"
                  >
                    <LogoutOutlined />
                    退出
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, type VNode } from 'vue'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { ADMIN } from '@/constants/UserRole.const.ts'
const router = useRouter()
const current = ref<string[]>([])
router.afterEach((to) => {
  current.value = [to.path]
})
const doMenuClick = ({ key }:{key:string}) => {
  console.log('click', key)
  router.push({ path: key })
}
const loginUserStore = useLoginUserStore()
interface MenuItem {
  key: string;
  label: string | VNode; // 可以是字符串或 JSX/Vue 节点
  title?: string; // 可选的 title 属性
}
const originItems = [
  {
    key: '/home',
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/add_picture',
    label: '添加图片',
    title: '添加图片',
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/spaceManage',
    label: '空间管理',
    title: '空间管理',
  }
] as MenuItem[]
const filterMenus = (items:MenuItem[]) => {
  return items?.filter((item) => {
    if (item?.key?.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== ADMIN) {
        return false
      }
    }
    return true
  })
}
const items = computed(() => filterMenus(originItems))
</script>
<style scoped>
#globalHeader .title-bar {
  height: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .logo {
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }
  .title {
    text-align: center;
  }
}
#globalHeader .menu {
  flex-grow: 1;
}
#globalHeader .login-status {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
