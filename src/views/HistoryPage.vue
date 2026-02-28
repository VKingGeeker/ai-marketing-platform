<template>
  <div class="history-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">历史记录</h1>
        <p class="page-subtitle">查看和管理你生成的所有内容</p>
      </div>

      <!-- 筛选和操作栏 -->
      <div class="filter-bar">
        <div class="filter-left">
          <el-radio-group v-model="filterType" size="default">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="marketing">营销文案</el-radio-button>
            <el-radio-button label="product">产品描述</el-radio-button>
            <el-radio-button label="social">社交媒体</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-right">
          <el-button
            type="danger"
            text
            :disabled="filteredHistory.length === 0"
            @click="handleClearAll"
          >
            <el-icon><Delete /></el-icon>
            清空全部
          </el-button>
        </div>
      </div>

      <!-- 历史记录列表 -->
      <div v-if="filteredHistory.length > 0" class="history-list">
        <div
          v-for="(item, index) in paginatedHistory"
          :key="item.id"
          class="history-card"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="card-header">
            <div class="header-left">
              <el-tag :type="getTypeTag(item.type)" size="small">
                {{ getTypeName(item.type) }}
              </el-tag>
              <span class="card-title">{{ item.title }}</span>
            </div>
            <div class="header-right">
              <span class="card-time">{{ formatTime(item.createdAt) }}</span>
            </div>
          </div>

          <div class="card-content">
            <div v-if="item.type === 'social'" class="results-preview">
              <div v-for="(platform, pIndex) in Object.keys(item.results || {})" :key="pIndex" class="platform-badge">
                {{ platform }}
              </div>
            </div>
            <div v-else class="results-preview">
              <p class="preview-text">
                {{ getPreviewText(item.results) }}
              </p>
            </div>
          </div>

          <div class="card-actions">
            <el-button type="primary" text size="small" @click="handleView(item)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button type="danger" text size="small" @click="handleDelete(item.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-icon :size="64" class="empty-icon"><Clock /></el-icon>
        <p>暂无历史记录</p>
        <p class="empty-hint">开始生成内容后会显示在这里</p>
        <el-button type="primary" @click="$router.push('/marketing')">
          立即体验
        </el-button>
      </div>

      <!-- 分页 -->
      <div v-if="filteredHistory.length > pageSize" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredHistory.length"
          layout="prev, pager, next"
          background
        />
      </div>

      <!-- 详情弹窗 -->
      <el-dialog
        v-model="detailVisible"
        title="历史详情"
        width="700px"
        destroy-on-close
      >
        <div v-if="currentDetail" class="detail-content">
          <div class="detail-header">
            <el-tag :type="getTypeTag(currentDetail.type)" size="small">
              {{ getTypeName(currentDetail.type) }}
            </el-tag>
            <span class="detail-title">{{ currentDetail.title }}</span>
            <span class="detail-time">{{ formatTime(currentDetail.createdAt) }}</span>
          </div>

          <div class="detail-section">
            <h4>输入信息</h4>
            <div class="inputs-display">
              <template v-if="currentDetail.type === 'marketing'">
                <div class="input-item">
                  <span class="label">店铺名称：</span>
                  <span class="value">{{ currentDetail.inputs?.shopName }}</span>
                </div>
                <div class="input-item">
                  <span class="label">经营类型：</span>
                  <span class="value">{{ currentDetail.inputs?.businessType }}</span>
                </div>
                <div class="input-item">
                  <span class="label">营销主题：</span>
                  <span class="value">{{ currentDetail.inputs?.marketingTheme }}</span>
                </div>
                <div class="input-item">
                  <span class="label">文案风格：</span>
                  <span class="value">{{ currentDetail.inputs?.copyStyle }}</span>
                </div>
              </template>
              <template v-else-if="currentDetail.type === 'product'">
                <div class="input-item">
                  <span class="label">商品名称：</span>
                  <span class="value">{{ currentDetail.inputs?.productName }}</span>
                </div>
                <div class="input-item">
                  <span class="label">商品类别：</span>
                  <span class="value">{{ currentDetail.inputs?.productCategory }}</span>
                </div>
                <div class="input-item">
                  <span class="label">目标客群：</span>
                  <span class="value">{{ currentDetail.inputs?.targetAudience }}</span>
                </div>
                <div class="input-item">
                  <span class="label">商品特点：</span>
                  <span class="value">{{ currentDetail.inputs?.productFeatures }}</span>
                </div>
              </template>
              <template v-else>
                <div class="input-item">
                  <span class="label">内容主题：</span>
                  <span class="value">{{ currentDetail.inputs?.contentTheme }}</span>
                </div>
                <div class="input-item">
                  <span class="label">目标受众：</span>
                  <span class="value">{{ currentDetail.inputs?.targetAudience }}</span>
                </div>
                <div class="input-item">
                  <span class="label">内容风格：</span>
                  <span class="value">{{ currentDetail.inputs?.contentStyle }}</span>
                </div>
                <div class="input-item">
                  <span class="label">选择平台：</span>
                  <span class="value">{{ currentDetail.inputs?.platforms?.join('、') }}</span>
                </div>
              </template>
            </div>
          </div>

          <div class="detail-section">
            <h4>生成结果</h4>
            <div v-if="currentDetail.type === 'social'" class="results-list">
              <div
                v-for="(platformResults, platform) in currentDetail.results"
                :key="platform"
                class="platform-group"
              >
                <div class="platform-label">{{ platform }}</div>
                <div
                  v-for="(content, idx) in platformResults"
                  :key="idx"
                  class="result-item"
                >
                  <pre>{{ content }}</pre>
                </div>
              </div>
            </div>
            <div v-else class="results-list">
              <div
                v-for="(content, idx) in currentDetail.results"
                :key="idx"
                class="result-item"
              >
                <pre>{{ content }}</pre>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleCopyAll">复制全部</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getHistory, deleteHistory, clearHistory } from '../composables/useStorage'

// 筛选状态
const filterType = ref('all')
const currentPage = ref(1)
const pageSize = 10

// 详情弹窗
const detailVisible = ref(false)
const currentDetail = ref(null)

// 获取历史记录
const history = computed(() => getHistory())

// 筛选后的历史记录
const filteredHistory = computed(() => {
  if (filterType.value === 'all') {
    return history.value
  }
  return history.value.filter(item => item.type === filterType.value)
})

// 分页后的历史记录
const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredHistory.value.slice(start, end)
})

// 获取类型名称
const getTypeName = (type) => {
  const map = {
    marketing: '营销文案',
    product: '产品描述',
    social: '社交媒体'
  }
  return map[type] || type
}

// 获取类型标签样式
const getTypeTag = (type) => {
  const map = {
    marketing: 'primary',
    product: 'success',
    social: 'warning'
  }
  return map[type] || 'info'
}

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 小于24小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  }

  // 超过7天显示日期
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取预览文本
const getPreviewText = (results) => {
  if (!results || results.length === 0) return ''
  const first = results[0]
  return first.length > 100 ? first.substring(0, 100) + '...' : first
}

// 查看详情
const handleView = (item) => {
  currentDetail.value = item
  detailVisible.value = true
}

// 删除记录
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    deleteHistory(id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 清空全部
const handleClearAll = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有历史记录吗？此操作不可恢复。', '警告', {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'error'
    })
    clearHistory()
    ElMessage.success('已清空全部历史记录')
  } catch {
    // 用户取消
  }
}

// 复制全部
const handleCopyAll = async () => {
  if (!currentDetail.value) return

  let text = ''
  if (currentDetail.value.type === 'social') {
    Object.entries(currentDetail.value.results).forEach(([platform, contents]) => {
      text += `【${platform}】\n\n`
      contents.forEach(content => {
        text += content + '\n\n'
      })
    })
  } else {
    currentDetail.value.results.forEach(content => {
      text += content + '\n\n'
    })
  }

  try {
    await navigator.clipboard.writeText(text.trim())
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 监听筛选变化，重置分页
filterType.value = 'all'
currentPage.value = 1
</script>

<style scoped>
.history-page {
  min-height: calc(100vh - 60px);
  background: var(--bg-page);
}

.page-header {
  margin-bottom: var(--space-lg);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

/* 历史列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.history-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  transition: all var(--transition);
  animation: fadeIn 0.3s ease-out forwards;
  opacity: 0;
}

.history-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.card-title {
  font-weight: 600;
  color: var(--text-primary);
}

.card-time {
  font-size: 13px;
  color: var(--text-muted);
}

.card-content {
  margin-bottom: var(--space-md);
}

.results-preview {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.platform-badge {
  padding: 4px 10px;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.preview-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.card-actions {
  display: flex;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--border-color);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.empty-icon {
  color: var(--border-color);
  margin-bottom: var(--space-md);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.empty-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: var(--space-xl);
}

/* 详情弹窗 */
.detail-content {
  max-height: 60vh;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.detail-title {
  font-weight: 600;
  color: var(--text-primary);
}

.detail-time {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-muted);
}

.detail-section {
  margin-bottom: var(--space-lg);
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-color);
}

.inputs-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
}

.input-item {
  display: flex;
  gap: var(--space-sm);
  font-size: 13px;
}

.input-item .label {
  color: var(--text-muted);
  flex-shrink: 0;
}

.input-item .value {
  color: var(--text-primary);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.platform-group {
  margin-bottom: var(--space-md);
}

.platform-label {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-xs);
  border-bottom: 1px dashed var(--border-color);
}

.result-item {
  background: var(--bg-page);
  border-radius: var(--radius-sm);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
}

.result-item pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
  font-family: inherit;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    gap: var(--space-md);
  }

  .filter-left {
    width: 100%;
  }

  .filter-left :deep(.el-radio-group) {
    width: 100%;
    display: flex;
  }

  .filter-left :deep(.el-radio-button) {
    flex: 1;
  }

  .inputs-display {
    grid-template-columns: 1fr;
  }
}
</style>
