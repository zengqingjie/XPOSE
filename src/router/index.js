import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录
  {
    path: '/',
    name: 'Login',
    component: () => import('../Login.vue'),
    meta: {
      title: 'XPOSE'
    }
  },
  // 注册
  {
    path: '/register',
    name: 'Register',
    component: () => import('../Register.vue'),
    meta: {
      title: 'XPOSE'
    }
  },
  // 主页
  {
    path: '/index',
    name: 'Index',
    meta: {
      requiresAuth: true
    },
    component: () => import('@/views/Index.vue'),
    meta: {
      title: 'XPOSE'
    }
  },
   // 切割
   {
    path: '/clip',
    name: 'Clip',
    component: () => import('@/views/Clip.vue')
  },
  {
    path: '*',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // const isLogin = JSON.parse(window.sessionStorage.getItem("isLogin"));
  const isLogin = true; //调试
  if(!isLogin && to.meta.requiresAuth) {
    next('/');
  } else {
    if(to.meta.title) { document.title = to.meta.title; }
    next();
  }
});

export default router
