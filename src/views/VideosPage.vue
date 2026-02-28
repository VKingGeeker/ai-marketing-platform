<template>
  <div class="videos-page">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">视频教程中心</h1>
          <p class="page-subtitle">观看专业视频教程，快速掌握AI营销技巧</p>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="入门教程">入门教程</el-radio-button>
          <el-radio-button label="高级技巧">高级技巧</el-radio-button>
          <el-radio-button label="案例实战">案例实战</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 视频列表 -->
      <div class="videos-grid" v-if="filteredVideos.length > 0">
        <div
          v-for="video in filteredVideos"
          :key="video.id"
          class="video-card"
          @click="playVideo(video)"
        >
          <div class="video-cover">
            <img :src="video.cover" :alt="video.title" />
            <div class="play-overlay">
              <div class="play-button">
                <el-icon :size="40"><VideoPlay /></el-icon>
              </div>
            </div>
            <div class="video-duration">{{ video.duration }}</div>
            <div class="video-category-tag">{{ video.category }}</div>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <div class="video-meta">
              <span class="video-views">
                <el-icon><View /></el-icon>
                {{ video.views }} 次播放
              </span>
              <span class="video-date">{{ formatDate(video.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <el-icon :size="64"><VideoCamera /></el-icon>
        <p>暂无视频教程</p>
      </div>
    </div>

    <!-- 视频播放弹窗 -->
    <el-dialog
      v-model="showPlayer"
      :title="currentVideo?.title"
      width="800px"
      class="video-player-dialog"
      @closed="closePlayer"
    >
      <div class="video-player">
        <div class="player-placeholder">
          <img :src="currentVideo?.cover" :alt="currentVideo?.title" class="player-bg" />
          <div class="player-overlay">
            <div class="play-icon-large">
              <el-icon :size="80"><VideoPlay /></el-icon>
            </div>
            <p class="player-text">点击播放演示视频</p>
          </div>
        </div>
      </div>
      <div class="player-info">
        <div class="player-meta">
          <el-tag :type="getCategoryType(currentVideo?.category)">
            {{ currentVideo?.category }}
          </el-tag>
          <span class="player-views">
            <el-icon><View /></el-icon>
            {{ currentVideo?.views }} 次播放
          </span>
        </div>
        <p class="player-description">{{ currentVideo?.description }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getVideos, initDefaultVideos } from '../composables/useStorage'

const videos = ref([])
const selectedCategory = ref('')
const showPlayer = ref(false)
const currentVideo = ref(null)

// 初始化数据
onMounted(() => {
  initDefaultVideos()
  videos.value = getVideos()
})

// 筛选后的视频
const filteredVideos = computed(() => {
  if (!selectedCategory.value) {
    return videos.value
  }
  return videos.value.filter(video => video.category === selectedCategory.value)
})

// 分类切换
const handleCategoryChange = () => {
  // 可以在这里添加筛选逻辑
}

// 播放视频
const playVideo = (video) => {
  currentVideo.value = video
  showPlayer.value = true
}

// 关闭播放器
const closePlayer = () => {
  showPlayer.value = false
  currentVideo.value = null
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

// 获取分类标签类型
const getCategoryType = (category) => {
  const types = {
    '入门教程': 'success',
    '高级技巧': 'warning',
    '案例实战': 'danger'
  }
  return types[category] || ''
}
</script>

<style scoped>
.videos-page {
  min-height: calc(100vh - 60px);
  background: var(--bg-page);
  padding-bottom: 60px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
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

/* 视频列表 */
.videos-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

/* 视频卡片 */
.video-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid var(--border-color);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.video-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.video-card:hover .video-cover img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition);
}

.video-card:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform var(--transition);
}

.video-card:hover .play-button {
  transform: scale(1.1);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.video-category-tag {
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

.video-info {
  padding: var(--space-md);
}

.video-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
}

.video-views {
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

/* 视频播放弹窗 */
.video-player-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.video-player-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.video-player {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.player-placeholder {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
}

.player-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6);
}

.player-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.play-icon-large {
  width: 100px;
  height: 100px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: var(--space-md);
  transition: transform var(--transition);
}

.play-icon-large:hover {
  transform: scale(1.1);
}

.player-text {
  color: white;
  font-size: 16px;
  opacity: 0.9;
}

.player-info {
  padding: 0 var(--space-md) var(--space-md);
}

.player-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.player-views {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 14px;
}

.player-description {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 1024px) {
  .videos-grid {
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

  .videos-grid {
    grid-template-columns: 1fr;
  }

  .video-player-dialog {
    width: 90% !important;
  }
}
</style>
