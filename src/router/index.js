import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 注册
  {
    path: '/',
    name: 'Register',
    component: () => import('../Register.vue')
  },
  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import('../Login.vue')
  },
  // 主页
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/Index.vue')
  },
  // 拖拽组件
  {
    path: '/tz',
    name: 'Tz',
    component: () => import('../Tz.vue')
  },
  // 自由拖拽
  {
    path: '/free',
    name: 'Free',
    component: () => import('../FreeDom.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
