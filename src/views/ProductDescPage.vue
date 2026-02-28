<template>
  <div class="product-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">产品描述生成</h1>
        <p class="page-subtitle">输入商品信息，AI 为你生成吸引人的产品描述</p>
      </div>

      <div class="content-layout">
        <!-- 左侧表单 -->
        <div class="form-panel">
          <div class="form-card">
            <h3 class="form-title">商品信息</h3>
            <el-form
              ref="formRef"
              :model="formData"
              :rules="rules"
              label-position="top"
              size="large"
            >
              <el-form-item label="商品名称" prop="productName">
                <el-input
                  v-model="formData.productName"
                  placeholder="请输入商品名称"
                  :prefix-icon="Goods"
                />
              </el-form-item>

              <el-form-item label="商品类别" prop="productCategory">
                <el-select
                  v-model="formData.productCategory"
                  placeholder="请选择商品类别"
                  style="width: 100%"
                >
                  <el-option label="美食餐饮" value="美食餐饮" />
                  <el-option label="服装配饰" value="服装配饰" />
                  <el-option label="美妆护肤" value="美妆护肤" />
                  <el-option label="数码电器" value="数码电器" />
                  <el-option label="家居用品" value="家居用品" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>

              <el-form-item label="商品特点" prop="productFeatures">
                <el-input
                  v-model="formData.productFeatures"
                  type="textarea"
                  :rows="3"
                  placeholder="请描述商品的主要特点、优势等"
                />
              </el-form-item>

              <el-form-item label="目标客群" prop="targetAudience">
                <el-select
                  v-model="formData.targetAudience"
                  placeholder="请选择目标客群"
                  style="width: 100%"
                >
                  <el-option label="年轻人（18-30岁）" value="年轻人" />
                  <el-option label="中年人（30-50岁）" value="中年人" />
                  <el-option label="老年人（50岁以上）" value="老年人" />
                  <el-option label="儿童/亲子" value="儿童" />
                  <el-option label="大众消费者" value="大众" />
                  <el-option label="高端客户" value="高端" />
                </el-select>
              </el-form-item>

              <el-form-item label="描述风格" prop="descStyle">
                <el-select
                  v-model="formData.descStyle"
                  placeholder="请选择描述风格"
                  style="width: 100%"
                >
                  <el-option label="生动形象" value="生动形象" />
                  <el-option label="专业严谨" value="专业严谨" />
                  <el-option label="温馨亲切" value="温馨亲切" />
                  <el-option label="时尚潮流" value="时尚潮流" />
                  <el-option label="简约直白" value="简约直白" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  :loading="loading"
                  @click="handleSubmit"
                >
                  <el-icon v-if="!loading"><MagicStick /></el-icon>
                  {{ loading ? 'AI 正在生成中...' : '生成产品描述' }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 右侧结果 -->
        <div class="result-panel">
          <div class="result-header">
            <h3>生成结果</h3>
            <span v-if="results.length > 0" class="result-count">
              共 {{ results.length }} 条描述
            </span>
          </div>

          <div v-if="results.length === 0" class="empty-state">
            <el-icon :size="64" class="empty-icon"><DocumentAdd /></el-icon>
            <p>填写左侧信息，点击生成按钮</p>
            <p class="empty-hint">AI 将为你生成多条产品描述</p>
          </div>

          <div v-else class="results-list">
            <div
              v-for="(result, index) in results"
              :key="index"
              class="result-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="result-content">
                <p>{{ result }}</p>
              </div>
              <div class="result-actions">
                <el-button
                  type="primary"
                  text
                  @click="handleCopy(result)"
                >
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
                <el-button
                  text
                  @click="handleEdit(index)"
                >
                  <el-icon><EditPen /></el-icon>
                  编辑
                </el-button>
                <el-button
                  text
                  :type="isFavorited(result) ? 'danger' : 'default'"
                  @click="handleFavorite(result)"
                >
                  <el-icon><Star /></el-icon>
                  {{ isFavorited(result) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 编辑弹窗 -->
          <el-dialog
            v-model="editDialogVisible"
            title="编辑描述"
            width="600px"
          >
            <el-input
              v-model="editingContent"
              type="textarea"
              :rows="6"
            />
            <template #footer>
              <el-button @click="editDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveEdit">保存</el-button>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Goods } from '@element-plus/icons-vue'
import { addHistory, getFavorites, addFavorite, removeFavorite } from '../composables/useStorage'
import { generateProductDesc } from '../api/aiApi'

// 表单数据
const formRef = ref(null)
const formData = reactive({
  productName: '',
  productCategory: '',
  productFeatures: '',
  targetAudience: '',
  descStyle: ''
})

// 表单验证规则
const rules = {
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  productCategory: [
    { required: true, message: '请选择商品类别', trigger: 'change' }
  ],
  productFeatures: [
    { required: true, message: '请描述商品特点', trigger: 'blur' }
  ],
  targetAudience: [
    { required: true, message: '请选择目标客群', trigger: 'change' }
  ],
  descStyle: [
    { required: true, message: '请选择描述风格', trigger: 'change' }
  ]
}

// 加载状态
const loading = ref(false)

// 生成结果
const results = ref([])

// 编辑相关
const editDialogVisible = ref(false)
const editingContent = ref('')
const editingIndex = ref(0)

// 收藏状态检查
const isFavorited = (content) => {
  const favorites = getFavorites()
  return favorites.some(f => f.content === content)
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  results.value = []

  try {
    // 调用后端 API
    const res = await generateProductDesc({
      productName: formData.productName,
      features: formData.productFeatures.split(/[,，]/).filter(f => f.trim()),
      style: formData.descStyle
    })

    // 处理返回结果
    results.value = res.descriptions || []

    // 保存到本地历史记录
    addHistory({
      type: 'product',
      title: formData.productName,
      inputs: { ...formData },
      results: results.value
    })

    ElMessage.success('生成成功！')
  } catch (error) {
    ElMessage.error(error || '生成失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 生成文案模板
const generateTemplates = () => {
  const { productName, productCategory, productFeatures, targetAudience, descStyle } = formData

  const stylePrefix = {
    '生动形象': '想象一下，',
    '专业严谨': '本产品是一款',
    '温馨亲切': '亲爱的顾客，',
    '时尚潮流': '潮流预警！',
    '简约直白': ''
  }

  const audienceWords = {
    '年轻人': '年轻潮人',
    '中年人': '品质生活追求者',
    '老年人': '注重生活品质的朋友',
    '儿童': '小朋友们',
    '大众': '每一位顾客',
    '高端': '尊贵的您'
  }

  const templates = [
    `${stylePrefix[descStyle]}${productName}为您带来全新体验！${productFeatures}，专为${audienceWords[targetAudience]}设计。无论是自用还是送礼，都是绝佳选择。快来感受${productName}的魅力吧！`,
    `【${productName}】${productCategory}领域的明星产品！${productFeatures}。${descStyle === '时尚潮流' ? '颜值与实力并存' : '品质保证，值得信赖'}，让${audienceWords[targetAudience]}${descStyle === '温馨亲切' ? '享受美好生活' : '拥有更好的选择'}。`,
    `${productName}——${productFeatures}。${descStyle === '专业严谨' ? '产品经过严格质量检测' : '我们用心做好每一件产品'}，为${audienceWords[targetAudience]}提供优质体验。${productName}，让生活更精彩！`,
    `发现宝藏好物！${productName}了解一下~ ${productFeatures}，这也太香了吧！${audienceWords[targetAudience]}赶紧看过来，错过真的会后悔！`,
    descStyle === '简约直白'
      ? `${productName}，${productFeatures}。适合${targetAudience}，${productCategory}类优选。`
      : `${productName}，您的理想之选！${productFeatures}，${descStyle === '温馨亲切' ? '我们期待与您相遇' : '用心为您服务'}。`
  ]

  return templates
}

// 复制文案
const handleCopy = async (content) => {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('复制成功！')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 编辑文案
const handleEdit = (index) => {
  editingIndex.value = index
  editingContent.value = results.value[index]
  editDialogVisible.value = true
}

// 保存编辑
const saveEdit = () => {
  results.value[editingIndex.value] = editingContent.value
  editDialogVisible.value = false
  ElMessage.success('保存成功！')
}

// 收藏/取消收藏
const handleFavorite = (content) => {
  if (isFavorited(content)) {
    const favorites = getFavorites()
    const item = favorites.find(f => f.content === content)
    if (item) {
      removeFavorite(item.id)
    }
    ElMessage.info('已取消收藏')
  } else {
    addFavorite({
      type: 'product',
      content: content,
      title: formData.productName,
      inputs: { ...formData }
    })
    ElMessage.success('收藏成功！')
  }
}
</script>

<style scoped>
.product-page {
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

.content-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: var(--space-lg);
  align-items: start;
}

/* 表单面板 */
.form-panel {
  position: sticky;
  top: 84px;
}

.form-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

/* 结果面板 */
.result-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  min-height: 500px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.result-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.result-count {
  font-size: 13px;
  color: var(--text-muted);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text-muted);
}

.empty-icon {
  color: var(--border-color);
  margin-bottom: var(--space-md);
}

.empty-state p {
  margin-bottom: var(--space-xs);
}

.empty-hint {
  font-size: 13px;
}

/* 结果列表 */
.results-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.result-card {
  background: var(--bg-page);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  animation: fadeIn 0.4s ease-out forwards;
  opacity: 0;
}

.result-content {
  margin-bottom: var(--space-md);
}

.result-content p {
  color: var(--text-primary);
  line-height: 1.8;
  white-space: pre-wrap;
}

.result-actions {
  display: flex;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--border-color);
}

.result-actions .el-button {
  font-size: 13px;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .form-panel {
    position: static;
  }
}
</style>
