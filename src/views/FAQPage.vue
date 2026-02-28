<template>
  <div class="faq-page">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">常见问题</h1>
        <p class="page-subtitle">解答您在使用过程中可能遇到的疑问</p>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索问题..."
          size="large"
          :prefix-icon="Search"
          clearable
        />
      </div>

      <!-- 问题分类 -->
      <div class="category-tabs">
        <el-tabs v-model="activeCategory">
          <el-tab-pane label="全部" name="" />
          <el-tab-pane label="基础使用" name="basic" />
          <el-tab-pane label="功能问题" name="feature" />
          <el-tab-pane label="账号问题" name="account" />
          <el-tab-pane label="其他" name="other" />
        </el-tabs>
      </div>

      <!-- FAQ列表 -->
      <div class="faq-list">
        <div
          v-for="(faq, index) in filteredFAQs"
          :key="index"
          class="faq-item"
        >
          <div
            class="faq-question"
            @click="toggleAnswer(index)"
          >
            <span class="question-text">{{ faq.question }}</span>
            <el-icon class="arrow-icon" :class="{ expanded: expandedIndex === index }">
              <ArrowDown />
            </el-icon>
          </div>
          <div class="faq-answer" v-show="expandedIndex === index">
            <div class="answer-content" v-html="faq.answer"></div>
          </div>
        </div>
      </div>

      <!-- 没有找到结果 -->
      <div class="no-result" v-if="filteredFAQs.length === 0">
        <el-icon :size="48"><QuestionFilled /></el-icon>
        <p>没有找到相关问题</p>
        <el-button type="primary" @click="showFeedbackDialog = true">
          提交问题
        </el-button>
      </div>

      <!-- 联系客服 -->
      <div class="contact-section">
        <div class="contact-card">
          <div class="contact-content">
            <h3>没有找到答案？</h3>
            <p>联系我们的客服团队，获取一对一帮助</p>
          </div>
          <div class="contact-actions">
            <el-button type="primary" @click="showFeedbackDialog = true">
              <el-icon><Message /></el-icon>
              提交问题
            </el-button>
          </div>
        </div>
      </div>

      <!-- 反馈对话框 -->
      <el-dialog v-model="showFeedbackDialog" title="提交问题" width="500px">
        <el-form :model="feedbackForm" label-position="top">
          <el-form-item label="问题类型">
            <el-select v-model="feedbackForm.type" placeholder="请选择问题类型" style="width: 100%">
              <el-option label="功能咨询" value="feature" />
              <el-option label="使用问题" value="usage" />
              <el-option label="账号问题" value="account" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述">
            <el-input
              v-model="feedbackForm.content"
              type="textarea"
              :rows="4"
              placeholder="请详细描述您遇到的问题..."
            />
          </el-form-item>
          <el-form-item label="联系方式（选填）">
            <el-input v-model="feedbackForm.contact" placeholder="邮箱或微信号" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showFeedbackDialog = false">取消</el-button>
          <el-button type="primary" @click="submitFeedback">提交</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { submitFeedback as saveFeedback } from '../composables/useStorage'

const searchKeyword = ref('')
const activeCategory = ref('')
const expandedIndex = ref(0)
const showFeedbackDialog = ref(false)
const feedbackForm = ref({
  type: '',
  content: '',
  contact: ''
})

const faqs = ref([
  {
    category: 'basic',
    question: 'AI营销工具是什么？',
    answer: 'AI营销工具是一款智能营销内容生成平台，专为中小餐饮店、零售店打造。它可以快速生成营销文案、产品描述、社交媒体内容等，帮助商家提升获客效率。'
  },
  {
    category: 'basic',
    question: '如何使用AI生成营销文案？',
    answer: '使用步骤非常简单：<br>1. 选择您需要的文案类型（营销文案/产品描述/社交媒体）<br>2. 填写店铺和活动相关信息<br>3. 点击生成按钮，AI会自动产出多条文案<br>4. 选择满意的文案，进行适当编辑后即可使用'
  },
  {
    category: 'basic',
    question: '生成的内容可以免费使用吗？',
    answer: '是的，AI生成的所有内容都可以免费使用，包括商业用途。我们鼓励商家根据自身需求进行适当修改后使用，以达到最佳效果。'
  },
  {
    category: 'feature',
    question: '支持哪些平台的文案生成？',
    answer: '目前支持生成以下平台的内容：<br>- 微信：朋友圈文案、公众号推文<br>- 微博：话题营销、热点借势<br>- 抖音：短视频脚本、热门文案<br>- 小红书：种草笔记、好物推荐<br>- 美团/大众点评：店铺描述、活动文案'
  },
  {
    category: 'feature',
    question: '生成的文案可以修改吗？',
    answer: '当然可以！所有生成的文案都支持在线编辑。您可以根据实际情况调整文案内容、添加或删除部分信息，使文案更符合您的品牌调性。'
  },
  {
    category: 'feature',
    question: '如何收藏喜欢的文案？',
    answer: '生成满意的文案后，只需点击文案下方的收藏按钮即可保存。收藏的文案可以在"历史记录"中查看和管理，方便日后复用。'
  },
  {
    category: 'feature',
    question: '历史记录会保存多久？',
    answer: '系统会自动保存您生成的所有文案历史，最多保留100条记录。超过100条后，系统会自动删除最早的记录。建议您及时收藏重要的文案。'
  },
  {
    category: 'account',
    question: '需要注册账号才能使用吗？',
    answer: '目前版本无需注册即可使用所有功能。所有数据都保存在您的浏览器本地存储中，换设备后数据不会同步。'
  },
  {
    category: 'account',
    question: '数据保存在哪里？',
    answer: '您的所有数据（包括生成的文案、收藏、历史记录等）都保存在浏览器本地存储（localStorage）中，不会上传至服务器，确保数据安全。'
  },
  {
    category: 'account',
    question: '如何清除历史记录？',
    answer: '您可以在"历史记录"页面点击"清空记录"按钮来清除所有历史数据。请注意，清除后数据无法恢复，请谨慎操作。'
  },
  {
    category: 'other',
    question: 'AI生成的文案有数量限制吗？',
    answer: '目前没有使用次数限制，您可以无限次生成文案。建议每次生成后及时收藏或使用，避免重要内容丢失。'
  },
  {
    category: 'other',
    question: '如何联系客服？',
    answer: '您可以通过以下方式联系我们：<br>1. 点击页面底部的"提交反馈"按钮<br>2. 在"使用指南"页面提交问题反馈<br>3. 发送邮件至 support@example.com<br>我们的客服团队工作时间为工作日9:00-18:00。'
  },
  {
    category: 'other',
    question: '如何提供改进建议？',
    answer: '我们非常重视用户的反馈和建议！您可以通过以下方式提出建议：<br>1. 使用页面底部的反馈功能<br>2. 在"使用指南"页面提交建议<br>3. 关注我们的公众号留言<br>优秀建议被采纳后，我们将有精美礼品相送！'
  }
])

const filteredFAQs = computed(() => {
  let result = faqs.value

  // 按分类筛选
  if (activeCategory.value) {
    result = result.filter(faq => faq.category === activeCategory.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(faq =>
      faq.question.toLowerCase().includes(keyword) ||
      faq.answer.toLowerCase().includes(keyword)
    )
  }

  return result
})

const toggleAnswer = (index) => {
  expandedIndex.value = expandedIndex.value === index ? -1 : index
}

const submitFeedback = () => {
  if (!feedbackForm.value.type || !feedbackForm.value.content) {
    ElMessage.warning('请填写问题类型和问题描述')
    return
  }

  saveFeedback(feedbackForm.value)
  ElMessage.success('感谢您的提交！我们会尽快回复您')
  showFeedbackDialog.value = false
  feedbackForm.value = { type: '', content: '', contact: '' }
}
</script>

<style scoped>
.faq-page {
  min-height: calc(100vh - 60px);
  background: var(--bg-page);
  padding-bottom: 60px;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-lg);
}

/* 页面头部 */
.page-header {
  text-align: center;
  padding: 48px 0;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
}

/* 搜索框 */
.search-box {
  max-width: 600px;
  margin: 0 auto var(--space-xl);
}

.search-box :deep(.el-input__wrapper) {
  padding: 8px 16px;
}

/* 分类标签 */
.category-tabs {
  margin-bottom: var(--space-xl);
}

.category-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.category-tabs :deep(.el-tabs__item) {
  font-size: 15px;
}

.category-tabs :deep(.el-tabs__item.is-active) {
  color: var(--primary-color);
  font-weight: 600;
}

.category-tabs :deep(.el-tabs__active-bar) {
  background-color: var(--primary-color);
}

/* FAQ列表 */
.faq-list {
  margin-bottom: var(--space-xl);
}

.faq-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
  overflow: hidden;
  transition: box-shadow var(--transition);
}

.faq-item:hover {
  box-shadow: var(--shadow-md);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  cursor: pointer;
  transition: background var(--transition);
}

.faq-question:hover {
  background: var(--bg-page);
}

.question-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.arrow-icon {
  color: var(--text-muted);
  transition: transform var(--transition);
}

.arrow-icon.expanded {
  transform: rotate(180deg);
}

.faq-answer {
  border-top: 1px solid var(--border-color);
}

.answer-content {
  padding: var(--space-lg);
  color: var(--text-secondary);
  line-height: 1.8;
}

.answer-content :deep(ul),
.answer-content :deep(ol) {
  margin: 12px 0;
  padding-left: 20px;
}

.answer-content :deep(li) {
  margin: 6px 0;
}

/* 无结果 */
.no-result {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}

.no-result .el-icon {
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

.no-result p {
  margin-bottom: var(--space-lg);
}

/* 联系客服 */
.contact-section {
  margin-top: var(--space-xl);
}

.contact-card {
  background: linear-gradient(135deg, var(--primary-color), #6366F1);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.contact-content h3 {
  font-size: 20px;
  margin-bottom: var(--space-xs);
}

.contact-content p {
  opacity: 0.85;
}

.contact-card .el-button {
  background: white;
  color: var(--primary-color);
  border: none;
}

.contact-card .el-button:hover {
  background: var(--primary-light);
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: 32px 0;
  }

  .page-title {
    font-size: 28px;
  }

  .category-tabs :deep(.el-tabs__nav-wrap) {
    overflow-x: auto;
  }

  .category-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 14px;
  }

  .faq-question {
    padding: var(--space-md);
  }

  .question-text {
    font-size: 15px;
  }

  .answer-content {
    padding: var(--space-md);
  }

  .contact-card {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
}
</style>
