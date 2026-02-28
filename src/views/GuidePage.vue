<template>
  <div class="guide-page">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">使用指南</h1>
        <p class="page-subtitle">快速上手AI营销工具，让获客更简单</p>
      </div>

      <!-- 快捷导航 -->
      <div class="quick-nav">
        <div
          v-for="(item, index) in quickNavItems"
          :key="index"
          class="quick-nav-item"
          @click="scrollToSection(item.id)"
        >
          <div class="nav-icon">
            <el-icon :size="24"><component :is="item.icon" /></el-icon>
          </div>
          <span>{{ item.title }}</span>
        </div>
      </div>

      <!-- 功能介绍 -->
      <section id="marketing" class="guide-section">
        <div class="section-header">
          <div class="section-number">01</div>
          <div class="section-title-wrap">
            <h2>营销文案生成</h2>
            <p>快速生成吸引人的营销活动文案</p>
          </div>
        </div>
        <div class="section-content">
          <div class="feature-steps">
            <div class="step-card">
              <div class="step-badge">Step 1</div>
              <div class="step-content">
                <h3>选择营销类型</h3>
                <p>根据您的活动场景，选择合适的营销文案类型：开业促销、会员日活动、节日营销、新品推广等。</p>
                <div class="step-image">
                  <img src="https://picsum.photos/seed/guide1/600/300" alt="选择营销类型" />
                </div>
              </div>
            </div>
            <div class="step-card">
              <div class="step-badge">Step 2</div>
              <div class="step-content">
                <h3>填写店铺信息</h3>
                <p>输入您的店铺名称、经营品类、核心卖点等信息，AI将根据这些信息生成定制化文案。</p>
                <div class="step-image">
                  <img src="https://picsum.photos/seed/guide2/600/300" alt="填写店铺信息" />
                </div>
              </div>
            </div>
            <div class="step-card">
              <div class="step-badge">Step 3</div>
              <div class="step-content">
                <h3>生成与编辑</h3>
                <p>点击生成按钮，AI将秒级产出多条营销文案。您可以查看、编辑并选择最满意的一条。</p>
                <div class="step-image">
                  <img src="https://picsum.photos/seed/guide3/600/300" alt="生成与编辑" />
                </div>
              </div>
            </div>
          </div>
          <div class="feature-tips">
            <h4><el-icon><InfoFilled /></el-icon> 优化建议</h4>
            <ul>
              <li>提供越详细的店铺信息，生成的文案越精准</li>
              <li>突出店铺特色和差异化优势，让文案更有吸引力</li>
              <li>结合节日或热点话题，提升文案时效性</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 产品描述 -->
      <section id="product" class="guide-section">
        <div class="section-header">
          <div class="section-number">02</div>
          <div class="section-title-wrap">
            <h2>产品描述优化</h2>
            <p>为商品打造极具吸引力的描述文字</p>
          </div>
        </div>
        <div class="section-content">
          <div class="feature-steps">
            <div class="step-card">
              <div class="step-badge">Step 1</div>
              <div class="step-content">
                <h3>输入商品信息</h3>
                <p>填写商品名称、主要特点、材质规格、适用人群等基本信息。</p>
              </div>
            </div>
            <div class="step-card">
              <div class="step-badge">Step 2</div>
              <div class="step-content">
                <h3>选择文案风格</h3>
                <p>根据您的品牌调性和目标客群，选择合适的文案风格：专业型、活泼型、文艺型等。</p>
              </div>
            </div>
            <div class="step-card">
              <div class="step-badge">Step 3</div>
              <div class="step-content">
                <h3>一键生成</h3>
                <p>AI自动生成富有吸引力的产品描述，让顾客一眼爱上您的商品。</p>
              </div>
            </div>
          </div>
          <div class="feature-example">
            <h4><el-icon><Document /></el-icon> 效果示例</h4>
            <div class="example-box">
              <div class="example-before">
                <span class="label">优化前</span>
                <p>这件衣服是纯棉的，穿起来很舒服。</p>
              </div>
              <div class="example-arrow">
                <el-icon><ArrowRight /></el-icon>
              </div>
              <div class="example-after">
                <span class="label">优化后</span>
                <p>100%新疆长绒棉，柔软透气如同第二层肌肤。精致做工，舒适版型，让每一次穿搭都是享受。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 社交媒体 -->
      <section id="social" class="guide-section">
        <div class="section-header">
          <div class="section-number">03</div>
          <div class="section-title-wrap">
            <h2>社交媒体运营</h2>
            <p>生成适合各平台的推广内容</p>
          </div>
        </div>
        <div class="section-content">
          <div class="platform-grid">
            <div class="platform-card">
              <div class="platform-icon wechat">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <h3>微信</h3>
              <p>适合朋友圈文案、公众号推文、私域运营内容</p>
            </div>
            <div class="platform-card">
              <div class="platform-icon weibo">
                <el-icon><Connection /></el-icon>
              </div>
              <h3>微博</h3>
              <p>适合话题营销、热点借势、品牌互动内容</p>
            </div>
            <div class="platform-card">
              <div class="platform-icon douyin">
                <el-icon><VideoCamera /></el-icon>
              </div>
              <h3>抖音</h3>
              <p>适合短视频脚本、热门文案、带货话术</p>
            </div>
            <div class="platform-card">
              <div class="platform-icon xiaohongshu">
                <el-icon><Notebook /></el-icon>
              </div>
              <h3>小红书</h3>
              <p>适合种草笔记、攻略分享、好物推荐</p>
            </div>
          </div>
          <div class="feature-tips">
            <h4><el-icon><MagicStick /></el-icon> 平台特点</h4>
            <ul>
              <li><strong>微信</strong>：适合深度内容，注重价值传递</li>
              <li><strong>微博</strong>：适合热点话题，互动性强</li>
              <li><strong>抖音</strong>：简短有力，突出视觉冲击</li>
              <li><strong>小红书</strong>：真实分享，图文并茂</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 高级功能 -->
      <section id="advanced" class="guide-section">
        <div class="section-header">
          <div class="section-number">04</div>
          <div class="section-title-wrap">
            <h2>高级功能</h2>
            <p>让您的营销效率更上一层楼</p>
          </div>
        </div>
        <div class="section-content">
          <div class="advanced-features">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><Star /></el-icon>
              </div>
              <h3>一键收藏</h3>
              <p>生成满意的文案可以一键收藏，随时查看复用</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><Clock /></el-icon>
              </div>
              <h3>历史记录</h3>
              <p>自动保存生成历史，重复使用更便捷</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><EditPen /></el-icon>
              </div>
              <h3>灵活编辑</h3>
              <p>生成内容可自定义编辑，满足个性化需求</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><CopyDocument /></el-icon>
              </div>
              <h3>一键复制</h3>
              <p>快速复制文案内容，直接粘贴到各平台使用</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 反馈建议 -->
      <section id="feedback" class="guide-section feedback-section">
        <div class="feedback-card">
          <div class="feedback-content">
            <h2>有问题？提建议？</h2>
            <p>我们重视每一位用户的反馈，不断优化产品体验</p>
          </div>
          <el-button type="primary" size="large" @click="showFeedbackDialog = true" :disabled="!isLoggedIn">
            <el-icon><Message /></el-icon>
            {{ isLoggedIn ? '提交反馈' : '登录后提交反馈' }}
          </el-button>
        </div>
      </section>

      <!-- 反馈对话框 -->
      <el-dialog v-model="showFeedbackDialog" title="提交反馈" width="500px">
        <el-form :model="feedbackForm" label-position="top">
          <el-form-item label="反馈类型">
            <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型" style="width: 100%">
              <el-option label="功能建议" value="suggestion" />
              <el-option label="问题反馈" value="bug" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="反馈内容">
            <el-input
              v-model="feedbackForm.content"
              type="textarea"
              :rows="4"
              placeholder="请详细描述您的建议或遇到的问题..."
            />
          </el-form-item>
          <el-form-item label="联系方式（选填）">
            <el-input v-model="feedbackForm.contact" placeholder="邮箱或微信号" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showFeedbackDialog = false">取消</el-button>
          <el-button type="primary" @click="submitFeedback" :loading="submitting">提交</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createFeedback } from '../api/feedbackApi'
import { useAuth } from '../composables/useAuth'

const { isLoggedIn } = useAuth()

const showFeedbackDialog = ref(false)
const feedbackForm = ref({
  type: '',
  content: '',
  contact: ''
})
const submitting = ref(false)

const quickNavItems = [
  { id: 'marketing', title: '营销文案', icon: 'Document' },
  { id: 'product', title: '产品描述', icon: 'Goods' },
  { id: 'social', title: '社交媒体', icon: 'Connection' },
  { id: 'advanced', title: '高级功能', icon: 'Star' },
  { id: 'feedback', title: '反馈建议', icon: 'Message' }
]

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const submitFeedback = async () => {
  if (!feedbackForm.value.type || !feedbackForm.value.content) {
    ElMessage.warning('请填写反馈类型和内容')
    return
  }

  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再提交反馈')
    return
  }

  submitting.value = true

  try {
    await createFeedback({
      type: feedbackForm.value.type,
      content: feedbackForm.value.content,
      contact: feedbackForm.value.contact || undefined
    })

    ElMessage.success('感谢您的反馈！')
    showFeedbackDialog.value = false
    feedbackForm.value = { type: '', content: '', contact: '' }
  } catch (error) {
    ElMessage.error(error || '提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.guide-page {
  min-height: calc(100vh - 60px);
  background: var(--bg-page);
  padding-bottom: 60px;
}

.page-container {
  max-width: 1200px;
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

/* 快捷导航 */
.quick-nav {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.quick-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 12px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition);
}

.quick-nav-item:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.nav-icon {
  color: var(--primary-color);
}

/* 通用章节样式 */
.guide-section {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.section-number {
  font-size: 48px;
  font-weight: 800;
  color: var(--primary-light);
  line-height: 1;
}

.section-title-wrap h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.section-title-wrap p {
  color: var(--text-secondary);
}

/* 步骤卡片 */
.feature-steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.step-card {
  display: flex;
  gap: var(--space-lg);
}

.step-badge {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color), #6366F1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.step-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.step-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.step-image {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.step-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* 功能提示 */
.feature-tips {
  background: var(--primary-light);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-top: var(--space-lg);
}

.feature-tips h4 {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--primary-color);
  font-size: 16px;
  margin-bottom: var(--space-md);
}

.feature-tips ul {
  list-style: none;
  padding: 0;
}

.feature-tips li {
  color: var(--text-secondary);
  padding: var(--space-xs) 0;
  padding-left: var(--space-md);
  position: relative;
}

.feature-tips li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 50%;
}

/* 效果示例 */
.feature-example {
  margin-top: var(--space-lg);
}

.feature-example h4 {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.example-box {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  background: var(--bg-page);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.example-before,
.example-after {
  flex: 1;
}

.example-before .label,
.example-after .label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.example-before p {
  color: var(--text-secondary);
}

.example-after p {
  color: var(--primary-color);
  font-weight: 500;
}

.example-arrow {
  color: var(--text-muted);
  font-size: 24px;
}

/* 平台网格 */
.platform-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.platform-card {
  text-align: center;
  padding: var(--space-lg);
  background: var(--bg-page);
  border-radius: var(--radius-md);
}

.platform-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto var(--space-md);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.platform-icon.wechat { background: #07C160; }
.platform-icon.weibo { background: #E6162D; }
.platform-icon.douyin { background: #000000; }
.platform-icon.xiaohongshu { background: #FE2C55; }

.platform-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.platform-card p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 高级功能 */
.advanced-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.feature-card {
  text-align: center;
  padding: var(--space-lg);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-md);
  background: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 28px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.feature-card p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 反馈区域 */
.feedback-section {
  background: linear-gradient(135deg, var(--primary-color), #6366F1);
  border: none;
}

.feedback-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.feedback-content h2 {
  color: white;
  font-size: 24px;
  margin-bottom: var(--space-xs);
}

.feedback-content p {
  color: rgba(255, 255, 255, 0.85);
}

.feedback-card .el-button {
  background: white;
  color: var(--primary-color);
  border: none;
}

.feedback-card .el-button:hover {
  background: var(--primary-light);
}

/* 响应式 */
@media (max-width: 1024px) {
  .platform-grid,
  .advanced-features {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .quick-nav {
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding-bottom: var(--space-sm);
  }

  .quick-nav-item {
    flex-shrink: 0;
  }

  .step-card {
    flex-direction: column;
  }

  .step-badge {
    width: 60px;
    height: 60px;
    font-size: 12px;
  }

  .platform-grid,
  .advanced-features {
    grid-template-columns: 1fr;
  }

  .example-box {
    flex-direction: column;
  }

  .example-arrow {
    transform: rotate(90deg);
  }

  .feedback-card {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
}
</style>
