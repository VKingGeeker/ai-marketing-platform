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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
