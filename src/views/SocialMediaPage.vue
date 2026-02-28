<template>
  <div class="social-page">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">社交媒体内容生成</h1>
        <p class="page-subtitle">选择平台和内容主题，AI 为你生成社交媒体推广内容</p>
      </div>

      <div class="content-layout">
        <!-- 左侧表单 -->
        <div class="form-panel">
          <div class="form-card">
            <h3 class="form-title">内容设置</h3>
            <el-form
              ref="formRef"
              :model="formData"
              :rules="rules"
              label-position="top"
              size="large"
            >
              <el-form-item label="选择平台" prop="platforms">
                <el-checkbox-group v-model="formData.platforms">
                  <el-checkbox label="微信" value="微信">
                    <span class="platform-label">
                      <el-icon><ChatDotRound /></el-icon>
                      微信
                    </span>
                  </el-checkbox>
                  <el-checkbox label="微博" value="微博">
                    <span class="platform-label">
                      <el-icon><ChatLineRound /></el-icon>
                      微博
                    </span>
                  </el-checkbox>
                  <el-checkbox label="抖音" value="抖音">
                    <span class="platform-label">
                      <el-icon><VideoCamera /></el-icon>
                      抖音
                    </span>
                  </el-checkbox>
                  <el-checkbox label="小红书" value="小红书">
                    <span class="platform-label">
                      <el-icon><Picture /></el-icon>
                      小红书
                    </span>
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="内容主题" prop="contentTheme">
                <el-input
                  v-model="formData.contentTheme"
                  placeholder="请描述你想要推广的内容主题"
                  :prefix-icon="EditPen"
                />
              </el-form-item>

              <el-form-item label="目标受众" prop="targetAudience">
                <el-select
                  v-model="formData.targetAudience"
                  placeholder="请选择目标受众"
                  style="width: 100%"
                >
                  <el-option label="年轻人（18-30岁）" value="年轻人" />
                  <el-option label="中年人（30-50岁）" value="中年人" />
                  <el-option label="亲子/儿童" value="亲子" />
                  <el-option label="白领上班族" value="白领" />
                  <el-option label="学生群体" value="学生" />
                  <el-option label="大众消费者" value="大众" />
                </el-select>
              </el-form-item>

              <el-form-item label="内容风格" prop="contentStyle">
                <el-select
                  v-model="formData.contentStyle"
                  placeholder="请选择内容风格"
                  style="width: 100%"
                >
                  <el-option label="种草推荐" value="种草推荐" />
                  <el-option label="知识分享" value="知识分享" />
                  <el-option label="活动宣传" value="活动宣传" />
                  <el-option label="日常分享" value="日常分享" />
                  <el-option label="互动话题" value="互动话题" />
                </el-select>
              </el-form-item>

              <el-form-item label="是否添加话题标签">
                <el-switch v-model="formData.addHashtags" />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  :loading="loading"
                  :disabled="formData.platforms.length === 0"
                  @click="handleSubmit"
                >
                  <el-icon v-if="!loading"><MagicStick /></el-icon>
                  {{ loading ? 'AI 正在生成中...' : '生成社交内容' }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 右侧结果 -->
        <div class="result-panel">
          <div class="result-header">
            <h3>生成结果</h3>
            <span v-if="Object.keys(results).length > 0" class="result-count">
              {{ Object.keys(results).length }} 个平台内容
            </span>
          </div>

          <div v-if="Object.keys(results).length === 0" class="empty-state">
            <el-icon :size="64" class="empty-icon"><DocumentAdd /></el-icon>
            <p>选择平台并填写内容主题</p>
            <p class="empty-hint">AI 将为每个平台生成适配的内容</p>
          </div>

          <div v-else class="results-list">
            <div
              v-for="(platformResults, platform) in results"
              :key="platform"
              class="platform-section"
            >
              <div class="platform-header">
                <span class="platform-name">{{ platform }}</span>
                <el-tag size="small" type="success">{{ platformResults.length }} 条</el-tag>
              </div>

              <div
                v-for="(result, index) in platformResults"
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
                    size="small"
                    @click="handleCopy(result)"
                  >
                    <el-icon><CopyDocument /></el-icon>
                    复制
                  </el-button>
                  <el-button
                    text
                    size="small"
                    @click="handleEdit(platform, index)"
                  >
                    <el-icon><EditPen /></el-icon>
                    编辑
                  </el-button>
                  <el-button
                    text
                    size="small"
                    :type="isFavorited(result) ? 'danger' : 'default'"
                    @click="handleFavorite(result, platform)"
                  >
                    <el-icon><Star /></el-icon>
                    {{ isFavorited(result) ? '已收藏' : '收藏' }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 编辑弹窗 -->
          <el-dialog
            v-model="editDialogVisible"
            title="编辑内容"
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
import { EditPen } from '@element-plus/icons-vue'
import { addHistory, getFavorites, addFavorite, removeFavorite } from '../composables/useStorage'

// 表单数据
const formRef = ref(null)
const formData = reactive({
  platforms: [],
  contentTheme: '',
  targetAudience: '',
  contentStyle: '',
  addHashtags: true
})

// 表单验证规则
const rules = {
  platforms: [
    {
      validator: (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请至少选择一个平台'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  contentTheme: [
    { required: true, message: '请输入内容主题', trigger: 'blur' }
  ],
  targetAudience: [
    { required: true, message: '请选择目标受众', trigger: 'change' }
  ],
  contentStyle: [
    { required: true, message: '请选择内容风格', trigger: 'change' }
  ]
}

// 加载状态
const loading = ref(false)

// 生成结果
const results = ref({})

// 编辑相关
const editDialogVisible = ref(false)
const editingContent = ref('')
const editingPlatform = ref('')
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
  results.value = {}

  // 模拟 AI 生成延迟
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 为每个平台生成内容
  formData.platforms.forEach(platform => {
    results.value[platform] = generateTemplates(platform)
  })

  // 保存到历史记录
  addHistory({
    type: 'social',
    title: formData.contentTheme,
    inputs: { ...formData },
    results: results.value
  })

  loading.value = false
  ElMessage.success('生成成功！')
}

// 生成文案模板
const generateTemplates = (platform) => {
  const { contentTheme, targetAudience, contentStyle, addHashtags } = formData

  const hashtags = addHashtags
    ? `\n\n#${contentTheme.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')} #${contentStyle} #推广`
    : ''

  const platformTemplates = {
    '微信': [
      `【${contentTheme}】\n\n亲们，告诉大家一个好消息！${contentTheme}正在火热进行中~\n\n${targetAudience === '年轻人' ? '年轻的小哥哥小姐姐们' : targetAudience === '中年人' ? '各位叔叔阿姨' : '亲爱的朋友们'}，快来了解一下吧！\n\n点击链接查看详情 >>${hashtags}`,
      `📢 重要通知！\n\n${contentTheme}，错过等一年！\n\n💡 亮点推荐：\n- 超值优惠\n- 品质保证\n- 服务周到\n\n${targetAudience === '年轻人' ? '这么棒的活动，小伙伴们快冲！' : '欢迎各位顾客朋友们的到来！'}${hashtags}`,
      `【今日推荐】${contentTheme}\n\n大家好呀～今天来给大家分享一个好消息！\n\n${contentTheme}正在火热进行中，${targetAudience === '年轻人' ? '超级适合我们年轻人的' : '不容错过的'}好机会！\n\n有兴趣的朋友可以私信我了解详情哦～${hashtags}`
    ],
    '微博': [
      `【${contentTheme}】\n\n好消息！${contentTheme}啦！${targetAudience === '年轻人' ? '年轻人们' : '小伙伴们'}快看过来！\n\n🔥 限时优惠错过无\n💫 品质保证\n✨ 超值体验\n\n📍 了解更多：点击链接\n${hashtags}`,
      `${contentTheme} | 姐妹们！${contentTheme}真的香！\n\n${targetAudience === '年轻人' ? '作为一个精致的猪猪女孩' : '亲身体验后'}，我真的爱了！\n\n💕 强烈推荐给${targetAudience === '年轻人' ? '各位小仙女' : '朋友们'}！\n\n你们get了吗？？${hashtags}`,
      `⚡️${contentTheme}⚡️\n\n好消息！${contentTheme}正在火热进行！\n\n✨ 亮点：\n✅ 超值优惠\n✅ 品质保证\n✅ 限时活动\n\n⏰ 活动时间有限，快来参与吧！\n${hashtags}`
    ],
    '抖音': [
      `📢 紧急通知！${contentTheme}啦！\n\n家人们，${contentTheme}真的绝！错过亏一个亿！\n\n👆 点击上方链接了解详情\n\n#${contentTheme.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')} #${contentStyle} #${targetAudience === '年轻人' ? '年轻人' : '推荐'} #dou来发现好物`,
      `［${contentTheme}］\n\n姐妹们！${contentTheme}也太香了吧！\n\n${targetAudience === '年轻人' ? '真的哭死，太好用了' : '亲测有效'}！\n\n👍 点赞收藏+关注\n💬 评论区见\n\n#${contentStyle} #${contentTheme.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')} #种草`,
      `🤩 ${contentTheme}\n\n家人们！今天必须给你们安利${contentTheme}！\n\n✅ 超值\n✅ 优惠\n✅ 错过不再有\n\n👇 戳链接看看\n\n#${contentTheme.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')} #${contentStyle} #抖音种草`
    ],
    '小红书': [
      `【${contentTheme}】\n\n👭 姐妹们！今天来给大家分享${contentTheme}！\n\n✨ 使用感受：\n真的绝绝子！${targetAudience === '年轻人' ? '太适合我们年轻人了' : '非常好'}！\n\n💰 性价比：⭐️⭐️⭐️⭐️⭐️\n👀 颜值：⭐️⭐️⭐️⭐️⭐️\n\n📍 总结：值得入手！\n\n💕 喜欢的姐妹记得点❤️收藏\n\n#${contentStyle} #${contentTheme.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')} #${targetAudience === '年轻人' ? '年轻人' : '好物分享'}`,
      `📝 ${contentTheme}\n\n·\n·\n·\n\nhalo 各位小可爱们～\n\n今天来聊聊${contentTheme}这个话题！\n\n🌟 亮点：\n1. 超值优惠\n2. 品质保证\n3. 限时活动\n\n${targetAudience === '年轻人' ? '真的是yyds！' : '非常推荐！'}\n\n💭 你们觉得怎么样呢？\n欢迎在评论区留言～\n\n❤️ 点个赞再走吧~\n\n#${contentTheme.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')} #${contentStyle} #真实分享`,
      `【${contentTheme}探店打卡】\n\n📍 今日打卡：${contentTheme}\n\n🎀 体验分享：\n${targetAudience === '年轻人' ? '作为一个精致的都市女孩' : '亲身体验后'}，真的要给这家店打call！\n\n💡 特色：\n• 环境超棒\n• 服务周到\n• 性价比高\n\n📝 总结：${targetAudience === '年轻人' ? '姐妹们冲！' : '值得推荐！'}\n\n👍 点赞收藏关注我～\n\n#${contentTheme.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')} #${contentStyle} #探店打卡 #真实测评`
    ]
  }

  return platformTemplates[platform] || platformTemplates['微信']
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
const handleEdit = (platform, index) => {
  editingPlatform.value = platform
  editingIndex.value = index
  editingContent.value = results.value[platform][index]
  editDialogVisible.value = true
}

// 保存编辑
const saveEdit = () => {
  results.value[editingPlatform.value][editingIndex.value] = editingContent.value
  editDialogVisible.value = false
  ElMessage.success('保存成功！')
}

// 收藏/取消收藏
const handleFavorite = (content, platform) => {
  if (isFavorited(content)) {
    const favorites = getFavorites()
    const item = favorites.find(f => f.content === content)
    if (item) {
      removeFavorite(item.id)
    }
    ElMessage.info('已取消收藏')
  } else {
    addFavorite({
      type: 'social',
      platform: platform,
      content: content,
      title: formData.contentTheme,
      inputs: { ...formData }
    })
    ElMessage.success('收藏成功！')
  }
}
</script>

<style scoped>
.social-page {
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

.platform-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.platform-label .el-icon {
  font-size: 16px;
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

/* 平台区域 */
.platform-section {
  margin-bottom: var(--space-lg);
}

.platform-section:last-child {
  margin-bottom: 0;
}

.platform-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px dashed var(--border-color);
}

.platform-name {
  font-weight: 600;
  color: var(--primary-color);
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
  font-size: 13px;
}

.result-actions {
  display: flex;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--border-color);
}

.result-actions .el-button {
  font-size: 12px;
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
