import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import AddPicturePage from '@/pages/picture/AddPicturePage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailPage from '@/pages/picture/PictureDetailPage.vue'
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
import AddSpacePage from '@/pages/space/AddSpacePage.vue'
import MySpacePage from '@/pages/space/MySpacePage.vue'
import SpaceDetailPage from '@/pages/space/SpaceDetailPage.vue'
import ExplorePage from '@/pages/space/ExplorePage.vue'
import PersonAlbumPage from '@/pages/space/PersonAlbumPage.vue'
import SearchPicturePage from '@/pages/picture/SearchPicturePage.vue'
import SpaceAnalyzePage from '@/pages/Analyze/SpaceAnalyzePage.vue'
import SpaceUserManagePage from '@/pages/space/SpaceUserManagePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '首页',
      redirect: '/home',
    },
    {
      path: '/user/login',
      name: '用户登陆',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: ' 用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
    },
    {
      path: '/add_picture',
      name: '添加图片',
      component: AddPicturePage
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagePage,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
    },
    {
      path: '/add_space',
      name: 'createSpace',
      component: AddSpacePage,
    },
    {
      path: '/my_space',
      name: 'mySpace',
      component: MySpacePage,
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetailPage,
      props: true,
    },
    {
      path: '/space/explore',
      name: '空间探索',
      component: ExplorePage
    },
    {
      path: '/cluster/:id', // :id 是动态的，对应人物簇的ID
      name: 'ClusterDetail',
      component: PersonAlbumPage // 确保路径正确
    },
    {
      path: '/search_picture',
      name: 'SearchPicture',
      component: SearchPicturePage,
    },
    {
      path: '/space_analyze',
      name: '空间分析',
      component: SpaceAnalyzePage,
    },
    {
      path: '/spaceUserManage/:id',
      name: '空间成员管理',
      component: SpaceUserManagePage,
      props: true,
    },


  ],
})

export default router
