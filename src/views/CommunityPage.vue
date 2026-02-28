<template>
  <div class="community-page">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">讨论区</h1>
          <p class="page-subtitle">与同行交流经验、分享心得、互相帮助</p>
        </div>
      </div>

      <!-- 发布话题按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="showPublishDialog = true">
          <el-icon><EditPen /></el-icon>
          发布新话题
        </el-button>
        <div class="category-tabs">
          <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="经验分享">经验分享</el-radio-button>
            <el-radio-button label="问题求助">问题求助</el-radio-button>
            <el-radio-button label="资源互换">资源互换</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 话题列表 -->
      <div class="topics-list" v-if="filteredTopics.length > 0">
        <div
          v-for="topic in filteredTopics"
          :key="topic.id"
          class="topic-card"
        >
          <div class="topic-vote" @click="handleVote(topic.id)">
            <div class="vote-count" :class="{ voted: topic.isVoted }">
              <el-icon><CaretTop /></el-icon>
              {{ topic.voteCount }}
            </div>
          </div>
          <div class="topic-content">
            <h3 class="topic-title">{{ topic.title }}</h3>
            <p class="topic-excerpt">{{ topic.content }}</p>
            <div class="topic-meta">
              <div class="meta-left">
                <el-tag :type="getCategoryType(topic.category)" size="small">
                  {{ topic.category }}
                </el-tag>
                <span class="author">
                  <el-icon><User /></el-icon>
                  {{ topic.author }}
                </span>
                <span class="date">{{ formatDate(topic.createdAt) }}</span>
              </div>
              <div class="meta-right">
                <span class="meta-item">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ topic.commentCount }} 评论
                </span>
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ topic.viewCount }} 浏览
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <el-icon :size="64"><ChatDotRound /></el-icon>
        <p>暂无话题，快来发布第一个话题吧</p>
        <el-button type="primary" @click="showPublishDialog = true">
          发布话题
        </el-button>
      </div>
    </div>

    <!-- 发布话题弹窗 -->
    <el-dialog
      v-model="showPublishDialog"
      title="发布新话题"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="topicForm"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item label="话题分类" prop="category">
          <el-select v-model="topicForm.category" placeholder="请选择话题分类" style="width: 100%">
            <el-option label="经验分享" value="经验分享" />
            <el-option label="问题求助" value="问题求助" />
            <el-option label="资源互换" value="资源互换" />
          </el-select>
        </el-form-item>
        <el-form-item label="话题标题" prop="title">
          <el-input
            v-model="topicForm.title"
            placeholder="请输入话题标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="话题内容" prop="content">
          <el-input
            v-model="topicForm.content"
            type="textarea"
            :rows="6"
            placeholder="请详细描述你的话题内容"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="你的昵称" prop="author">
          <el-input
            v-model="topicForm.author"
            placeholder="请输入你的昵称"
            maxlength="20"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPublishDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePublish" :loading="publishing">
          发布话题
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getTopics,
  initDefaultTopics,
  addTopic,
  voteTopic
} from '../composables/useStorage'

const topics = ref([])
const selectedCategory = ref('')
const showPublishDialog = ref(false)
const publishing = ref(false)
const formRef = ref(null)

const topicForm = ref({
  category: '',
  title: '',
  content: '',
  author: ''
})

const formRules = {
  category: [{ required: true, message: '请选择话题分类', trigger: 'change' }],
  title: [
    { required: true, message: '请输入话题标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入话题内容', trigger: 'blur' },
    { min: 10, max: 2000, message: '内容长度在 10 到 2000 个字符', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '请输入你的昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

// 初始化数据
onMounted(() => {
  initDefaultTopics()
  topics.value = getTopics()
})

// 筛选后的话题
const filteredTopics = computed(() => {
  if (!selectedCategory.value) {
    return topics.value
  }
  return topics.value.filter(topic => topic.category === selectedCategory.value)
})

// 分类切换
const handleCategoryChange = () => {
  // 可以在这里添加筛选逻辑
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
    '经验分享': 'success',
    '问题求助': 'warning',
    '资源互换': 'primary'
  }
  return types[category] || ''
}

// 点赞话题
const handleVote = (topicId) => {
  const updatedTopics = voteTopic(topicId)
  topics.value = updatedTopics
  ElMessage.success('点赞成功')
}

// 发布话题
const handlePublish = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      publishing.value = true
      try {
        addTopic(topicForm.value)
        topics.value = getTopics()
        showPublishDialog.value = false
        topicForm.value = {
          category: '',
          title: '',
          content: '',
          author: ''
        }
        ElMessage.success('话题发布成功')
      } catch (error) {
        ElMessage.error('发布失败，请重试')
      } finally {
        publishing.value = false
      }
    }
  })
}
</script>

<style scoped>
.community-page {
  min-height: calc(100vh - 60px);
  background: var(--bg-page);
  padding-bottom: 60px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #10B981, #059669);
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

/* 操作栏 */
.action-bar {
  max-width: 1400px;
  margin: 0 auto var(--space-lg);
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.category-tabs :deep(.el-radio-button__inner) {
  padding: 8px 16px;
}

.category-tabs :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

/* 话题列表 */
.topics-list {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

/* 话题卡片 */
.topic-card {
  display: flex;
  gap: var(--space-md);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  transition: all var(--transition);
}

.topic-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.topic-vote {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.vote-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-page);
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition);
}

.vote-count:hover,
.vote-count.voted {
  background: var(--primary-light);
  color: var(--primary-color);
}

.topic-content {
  flex: 1;
  min-width: 0;
}

.topic-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  cursor: pointer;
}

.topic-title:hover {
  color: var(--primary-color);
}

.topic-excerpt {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.topic-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
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
  color: var(--text-secondary);
  font-size: 13px;
}

.meta-left .date {
  color: var(--text-muted);
  font-size: 13px;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 13px;
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

.empty-state p {
  margin-bottom: var(--space-lg);
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: 32px 0;
  }

  .page-title {
    font-size: 28px;
  }

  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .category-tabs {
    overflow-x: auto;
    white-space: nowrap;
  }

  .topic-card {
    flex-direction: column;
  }

  .topic-vote {
    flex-direction: row;
    justify-content: flex-start;
  }

  .vote-count {
    flex-direction: row;
    gap: 4px;
  }

  .topic-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
