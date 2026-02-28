<template>
  <div class="article-detail-page">
    <div class="page-container">
      <!-- 返回按钮 -->
      <div class="back-nav">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
      </div>

      <!-- 文章内容 -->
      <div class="article-main" v-if="article">
        <!-- 文章头部 -->
        <header class="article-header">
          <div class="article-category-tag">{{ article.category }}</div>
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span class="author">
              <el-icon><User /></el-icon>
              {{ article.author }}
            </span>
            <span class="date">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(article.createdAt) }}
            </span>
            <span class="views">
              <el-icon><View /></el-icon>
              {{ article.viewCount }} 阅读
            </span>
          </div>
          <div class="article-tags">
            <el-tag v-for="tag in article.tags" :key="tag" size="small" type="info">
              {{ tag }}
            </el-tag>
          </div>
        </header>

        <!-- 文章封面图 -->
        <div class="article-cover">
          <img :src="article.cover" :alt="article.title" />
        </div>

        <!-- 文章正文 -->
        <div class="article-content" v-html="article.content"></div>

        <!-- 文章底部 -->
        <div class="article-footer">
          <div class="footer-stats">
            <span class="stat-item">
              <el-icon><Star /></el-icon>
              {{ article.likeCount }} 点赞
            </span>
            <span class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              {{ article.commentCount }} 评论
            </span>
          </div>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="comments-section" v-if="article">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon><ChatDotSquare /></el-icon>
            评论 ({{ comments.length }})
          </h2>
        </div>

        <!-- 发表评论 -->
        <div class="comment-form">
          <el-input
            v-model="newComment"
            type="textarea"
            :rows="3"
            placeholder="写下你的评论..."
            :disabled="!isLoggedIn"
          />
          <div class="form-footer">
            <span class="login-tip" v-if="!isLoggedIn">登录后可发表评论</span>
            <el-button type="primary" @click="submitComment" :disabled="!newComment.trim() || !isLoggedIn">
              <el-icon><Promotion /></el-icon>
              发表评论
            </el-button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list" v-if="comments.length > 0">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-avatar">
              <el-avatar :size="40" :style="{ background: getAvatarColor(comment.author) }">
                {{ comment.author?.charAt(0) || '游' }}
              </el-avatar>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author || '游客' }}</span>
                <span class="comment-time">{{ formatCommentTime(comment.createdAt) }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <el-button text type="danger" size="small" @click="handleDeleteComment(comment.id)" v-if="canDeleteComment(comment)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空评论 -->
        <div class="empty-comments" v-else>
          <el-icon><ChatLineSquare /></el-icon>
          <p>暂无评论，快来抢沙发吧~</p>
        </div>
      </div>

      <!-- 加载中 -->
      <div class="loading" v-if="!article">
        <el-skeleton :rows="10" animated />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getArticleById as getArticleByIdAPI, getMockArticles } from '../api/articleApi'
import { getArticleComments, createComment as createCommentAPI } from '../api/commentApi'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { user, isLoggedIn } = useAuth()

const article = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(false)

const loadArticle = async () => {
  loading.value = true
  try {
    const articleId = route.params.id

    // 先尝试从 API 获取
    try {
      article.value = await getArticleByIdAPI(articleId)
    } catch {
      // 如果 API 失败，使用 mock 数据
      const mockData = await getMockArticles()
      article.value = mockData.find(a => a.id === parseInt(articleId)) || mockData[0]
    }

    if (article.value) {
      // 加载评论
      loadComments(articleId)
    }
  } catch (error) {
    ElMessage.error('加载文章失败')
  } finally {
    loading.value = false
  }
}

const loadComments = async (articleId) => {
  try {
    const res = await getArticleComments(articleId)
    comments.value = res.comments || []
  } catch {
    comments.value = []
  }
}

const goBack = () => {
  router.push('/articles')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCommentTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return formatDate(dateStr)
}

const getAvatarColor = (name) => {
  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  const index = name ? name.charCodeAt(0) % colors.length : 0
  return colors[index]
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    await createCommentAPI({
      articleId: parseInt(route.params.id),
      content: newComment.value.trim()
    })

    // 刷新评论列表
    await loadComments(route.params.id)
    newComment.value = ''
    ElMessage.success('评论发表成功！')
  } catch (error) {
    ElMessage.error(error || '评论发表失败，请先登录')
  }
}

const canDeleteComment = (comment) => {
  return isLoggedIn.value && user.value && comment.author === user.value.nickname
}

const handleDeleteComment = async (commentId) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 添加删除评论 API
    comments.value = comments.value.filter(c => c.id !== commentId)
    ElMessage.success('评论已删除')
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-detail-page {
  min-height: calc(100vh - 60px);
  background: var(--bg-page);
  padding-bottom: 60px;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-lg);
}

.back-nav {
  margin-bottom: var(--space-lg);
}

.back-nav .el-button {
  color: var(--text-secondary);
}

.back-nav .el-button:hover {
  color: var(--primary-color);
}

.article-main {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
}

.article-header {
  margin-bottom: var(--space-xl);
}

.article-category-tag {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: var(--space-md);
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: var(--space-lg);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: var(--space-md);
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-tags {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.article-cover {
  margin-bottom: var(--space-xl);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: auto;
  display: block;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
}

.article-content :deep(h2) {
  font-size: 24px;
  font-weight: 700;
  margin: 32px 0 16px;
  color: var(--text-primary);
}

.article-content :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: var(--text-primary);
}

.article-content :deep(h4) {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: var(--text-primary);
}

.article-content :deep(p) {
  margin: 16px 0;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.article-content :deep(li) {
  margin: 8px 0;
}

.article-content :deep(blockquote) {
  background: var(--primary-light);
  border-left: 4px solid var(--primary-color);
  padding: 16px 20px;
  margin: 20px 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-style: italic;
  color: var(--text-secondary);
}

.article-content :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}

.article-footer {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-color);
}

.footer-stats {
  display: flex;
  gap: var(--space-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 14px;
}

.comments-section {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
}

.section-header {
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.comment-form {
  margin-bottom: var(--space-xl);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-md);
}

.login-tip {
  color: var(--text-muted);
  font-size: 13px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.comment-item {
  display: flex;
  gap: var(--space-md);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
}

.comment-author {
  font-weight: 600;
  color: var(--text-primary);
}

.comment-time {
  font-size: 13px;
  color: var(--text-muted);
}

.comment-text {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
}

.comment-actions {
  display: flex;
  gap: var(--space-sm);
}

.empty-comments {
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-muted);
}

.empty-comments .el-icon {
  font-size: 48px;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

.loading {
  padding: var(--space-xl);
}

@media (max-width: 768px) {
  .page-container {
    padding: var(--space-md);
  }

  .article-main,
  .comments-section {
    padding: var(--space-lg);
  }

  .article-title {
    font-size: 24px;
  }

  .article-meta {
    flex-wrap: wrap;
    gap: var(--space-md);
  }
}
</style>
