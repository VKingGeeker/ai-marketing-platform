import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('../views/MarketingCopyPage.vue')
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../views/ProductDescPage.vue')
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('../views/SocialMediaPage.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/HistoryPage.vue')
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

export default router
