<template>
  <div class="marketing-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">营销文案生成</h1>
        <p class="page-subtitle">输入店铺信息，AI 为你生成吸引人的营销文案</p>
      </div>

      <div class="content-layout">
        <!-- 左侧表单 -->
        <div class="form-panel">
          <div class="form-card">
            <h3 class="form-title">店铺信息</h3>
            <el-form
              ref="formRef"
              :model="formData"
              :rules="rules"
              label-position="top"
              size="large"
            >
              <el-form-item label="店铺名称" prop="shopName">
                <el-input
                  v-model="formData.shopName"
                  placeholder="请输入店铺名称"
                  :prefix-icon="Shop"
                />
              </el-form-item>

              <el-form-item label="经营类型" prop="businessType">
                <el-select
                  v-model="formData.businessType"
                  placeholder="请选择经营类型"
                  style="width: 100%"
                >
                  <el-option label="餐饮" value="餐饮" />
                  <el-option label="零售" value="零售" />
                  <el-option label="服务" value="服务" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>

              <el-form-item label="营销主题" prop="marketingTheme">
                <el-select
                  v-model="formData.marketingTheme"
                  placeholder="请选择营销主题"
                  style="width: 100%"
                >
                  <el-option label="开业促销" value="开业促销" />
                  <el-option label="会员日" value="会员日" />
                  <el-option label="节日活动" value="节日活动" />
                  <el-option label="新品推广" value="新品推广" />
                  <el-option label="清仓甩卖" value="清仓甩卖" />
                  <el-option label="周年庆" value="周年庆" />
                </el-select>
              </el-form-item>

              <el-form-item label="文案风格" prop="copyStyle">
                <el-select
                  v-model="formData.copyStyle"
                  placeholder="请选择文案风格"
                  style="width: 100%"
                >
                  <el-option label="亲切温暖" value="亲切温暖" />
                  <el-option label="专业正式" value="专业正式" />
                  <el-option label="活泼俏皮" value="活泼俏皮" />
                  <el-option label="高端大气" value="高端大气" />
                  <el-option label="简洁直白" value="简洁直白" />
                </el-select>
              </el-form-item>

              <el-form-item label="其他要求（可选）">
                <el-input
                  v-model="formData.additional"
                  type="textarea"
                  :rows="3"
                  placeholder="可输入其他特殊要求，如：突出性价比、强调服务等"
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  :loading="loading"
                  @click="handleSubmit"
                >
                  <el-icon v-if="!loading"><MagicStick /></el-icon>
                  {{ loading ? 'AI 正在生成中...' : '生成营销文案' }}
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
              共 {{ results.length }} 条文案
            </span>
          </div>

          <div v-if="results.length === 0" class="empty-state">
            <el-icon :size="64" class="empty-icon"><DocumentAdd /></el-icon>
            <p>填写左侧信息，点击生成按钮</p>
            <p class="empty-hint">AI 将为你生成多条营销文案</p>
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
            title="编辑文案"
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
import { Shop } from '@element-plus/icons-vue'
import { addHistory, getFavorites, addFavorite, removeFavorite } from '../composables/useStorage'

// 表单数据
const formRef = ref(null)
const formData = reactive({
  shopName: '',
  businessType: '',
  marketingTheme: '',
  copyStyle: '',
  additional: ''
})

// 表单验证规则
const rules = {
  shopName: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' }
  ],
  businessType: [
    { required: true, message: '请选择经营类型', trigger: 'change' }
  ],
  marketingTheme: [
    { required: true, message: '请选择营销主题', trigger: 'change' }
  ],
  copyStyle: [
    { required: true, message: '请选择文案风格', trigger: 'change' }
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

  // 模拟 AI 生成延迟
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 生成模拟文案
  const templates = generateTemplates()
  results.value = templates

  // 保存到历史记录
  addHistory({
    type: 'marketing',
    title: formData.shopName,
    inputs: { ...formData },
    results: templates
  })

  loading.value = false
  ElMessage.success('生成成功！')
}

// 生成文案模板
const generateTemplates = () => {
  const { shopName, businessType, marketingTheme, copyStyle, additional } = formData

  const stylePrefix = {
    '亲切温暖': '亲爱的顾客朋友们，',
    '专业正式': '尊敬的各位顾客，',
    '活泼俏皮': '嘿！小伙伴们看过来~',
    '高端大气': '尊贵的宾客，欢迎莅临',
    '简洁直白': ''
  }

  const themeContent = {
    '开业促销': '现盛大开业，全场限时优惠，惊喜不断！',
    '会员日': '专属会员日特权，积分翻倍，福利来袭！',
    '节日活动': '特别节日特别价，限时抢购，不容错过！',
    '新品推广': '新品上市，匠心之作，邀您品鉴！',
    '清仓甩卖': '清仓特卖，亏本清货，错过不再有！',
    '周年庆': 'X周年庆典，感恩回馈，全场钜惠！'
  }

  const templates = [
    `${stylePrefix[copyStyle]}${shopName}诚意满满，${themeContent[marketingTheme]}${additional ? '另' + additional : ''}`,
    `${shopName}感恩有您！${marketingTheme}之际，${copyStyle === '活泼俏皮' ? '赶紧来' : '诚邀'}各位${businessType === '餐饮' ? '吃货' : '顾客'}朋友们${copyStyle === '活泼俏皮' ? '围观' : '光临'}~ ${additional || ''}`,
    `【${shopName}】${marketingTheme}活动火热进行中！${copyStyle === '高端大气' ? '品质保证，服务至上' : '价格实惠，品质保证'}，${additional || '期待您的到来！'}`,
    `${shopName}温馨提示：${marketingTheme}啦！${copyStyle === '亲切温暖' ? '我们准备了惊喜等您来~' : '优惠多多，福利满满'} ${additional || ''}`,
    `${copyStyle === '专业正式' ? '公告：' : '好消息！'}${shopName}正在开展${marketingTheme}活动，${businessType === '餐饮' ? '美食' : '好物'}优惠来袭，${additional || '欢迎选购！'}`
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
      type: 'marketing',
      content: content,
      title: formData.shopName,
      inputs: { ...formData }
    })
    ElMessage.success('收藏成功！')
  }
}
</script>

<style scoped>
.marketing-page {
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
