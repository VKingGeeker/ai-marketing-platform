<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-left">
        <router-link to="/" class="logo">
          <el-icon class="logo-icon"><MagicStick /></el-icon>
          <span class="logo-text">AI 营销宝</span>
        </router-link>
      </div>

      <nav class="header-nav">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link to="/marketing" class="nav-item" :class="{ active: $route.path === '/marketing' }">
          <el-icon><Document /></el-icon>
          <span>营销文案</span>
        </router-link>
        <router-link to="/product" class="nav-item" :class="{ active: $route.path === '/product' }">
          <el-icon><Goods /></el-icon>
          <span>产品描述</span>
        </router-link>
        <router-link to="/social" class="nav-item" :class="{ active: $route.path === '/social' }">
          <el-icon><Connection /></el-icon>
          <span>社交媒体</span>
        </router-link>
        <el-dropdown trigger="hover" class="nav-dropdown">
          <span class="nav-item">
            <el-icon><MoreFilled /></el-icon>
            <span>更多</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/articles" class="dropdown-link">
                  <el-icon><Reading /></el-icon>
                  <span>行业资讯</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/guide" class="dropdown-link">
                  <el-icon><Guide /></el-icon>
                  <span>使用指南</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/faq" class="dropdown-link">
                  <el-icon><QuestionFilled /></el-icon>
                  <span>常见问题</span>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/history" class="dropdown-link">
                  <el-icon><Clock /></el-icon>
                  <span>历史记录</span>
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </nav>

      <div class="header-right">
        <el-badge :value="historyCount" :hidden="historyCount === 0" class="history-badge">
          <el-button circle @click="$router.push('/history')">
            <el-icon><Clock /></el-icon>
          </el-button>
        </el-badge>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { getHistory } from '../../composables/useStorage'

const historyCount = computed(() => {
  return getHistory().length
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-lg);
}

.header-left {
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
}

.logo-icon {
  font-size: 28px;
  color: var(--primary-color);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition);
  cursor: pointer;
}

.nav-item:hover {
  background: var(--primary-light);
  color: var(--primary-color);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
}

.nav-item .el-icon {
  font-size: 16px;
}

.nav-dropdown {
  display: flex;
  align-items: center;
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--text-primary);
  width: 100%;
}

.dropdown-link:hover {
  color: var(--primary-color);
}

.header-right {
  flex-shrink: 0;
}

.history-badge :deep(.el-badge__content) {
  background: var(--accent-color);
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 var(--space-md);
  }

  .logo-text {
    display: none;
  }

  .nav-item span {
    display: none;
  }

  .nav-item {
    padding: 8px 12px;
  }
}
</style>
