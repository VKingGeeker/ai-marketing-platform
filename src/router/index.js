import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('../views/MarketingCopyPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../views/ProductDescPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('../views/SocialMediaPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/HistoryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/ArticlesPage.vue')
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetailPage.vue')
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('../views/GuidePage.vue')
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../views/FAQPage.vue')
  },
  {
    path: '/videos',
    name: 'Videos',
    component: () => import('../views/VideosPage.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('../views/CommunityPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const token = getToken()

  if (requiresAuth && !token) {
    // 需要登录但未登录，跳转到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    // 已登录访问登录/注册页，跳转到首页
    next('/')
  } else {
    next()
  }
})

export default router
