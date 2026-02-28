<template>
  <div class="articles-page">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">行业资讯</h1>
          <p class="page-subtitle">获取最新的AI营销资讯、案例分析和行业趋势</p>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="行业分析">行业分析</el-radio-button>
          <el-radio-button label="案例研究">案例研究</el-radio-button>
          <el-radio-button label="趋势预测">趋势预测</el-radio-button>
          <el-radio-button label="使用教程">使用教程</el-radio-button>
          <el-radio-button label="运营技巧">运营技巧</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 文章列表 -->
      <div class="articles-grid" v-if="filteredArticles.length > 0">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="article-card"
          @click="goToArticle(article.id)"
        >
          <div class="article-cover">
            <img :src="article.cover" :alt="article.title" />
            <div class="article-category">{{ article.category }}</div>
          </div>
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <div class="meta-left">
                <span class="author">
                  <el-icon><User /></el-icon>
                  {{ article.author }}
                </span>
                <span class="date">{{ formatDate(article.createdAt) }}</span>
              </div>
              <div class="meta-right">
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ article.viewCount }}
                </span>
                <span class="meta-item">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ article.commentCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <el-icon :size="64"><Document /></el-icon>
        <p>暂无文章</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles, initDefaultArticles } from '../../composables/useStorage'

const router = useRouter()
const articles = ref([])
const selectedCategory = ref('')

// 初始化数据
onMounted(() => {
  initDefaultArticles()
  articles.value = getArticles()
})

// 筛选后的文章
const filteredArticles = computed(() => {
  if (!selectedCategory.value) {
    return articles.value
  }
  return articles.value.filter(article => article.category === selectedCategory.value)
})

// 分类切换
const handleCategoryChange = () => {
  // 可以在这里添加筛选逻辑
}

// 跳转文章详情
const goToArticle = (id) => {
  router.push(`/article/${id}`)
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.articles-page {
  min-height: calc(100vh - 60px);
  background: var(--bg-page);
  padding-bottom: 60px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, var(--primary-color), #6366F1);
  padding: 48px 0;
  margin-bottom: var(--space-xl);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  text-align: center;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
}

/* 分类筛选 */
.category-filter {
  max-width: 1400px;
  margin: 0 auto var(--space-xl);
  padding: 0 var(--space-lg);
}

.category-filter :deep(.el-radio-button__inner) {
  padding: 8px 16px;
}

.category-filter :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

/* 文章列表 */
.articles-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

/* 文章卡片 */
.article-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid var(--border-color);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.article-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.article-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.article-content {
  padding: var(--space-lg);
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-summary {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
}

.meta-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.meta-left .author {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 空状态 */
.empty-state {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px var(--space-lg);
  text-align: center;
  color: var(--text-muted);
}

.empty-state .el-icon {
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

/* 响应式 */
@media (max-width: 1024px) {
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 32px 0;
  }

  .page-title {
    font-size: 28px;
  }

  .category-filter {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: var(--space-sm);
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
