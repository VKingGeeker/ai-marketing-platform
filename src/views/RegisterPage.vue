<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo">
            <el-icon class="logo-icon"><MagicStick /></el-icon>
            <span class="logo-text">AI 营销宝</span>
          </div>
          <h1 class="title">创建账号</h1>
          <p class="subtitle">注册成为会员，享受 AI 智能营销服务</p>
        </div>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="nickname">
            <el-input
              v-model="formData.nickname"
              placeholder="请输入昵称"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码（至少6位）"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleRegister"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="loading"
              @click="handleRegister"
            >
              {{ loading ? '注册中...' : '注 册' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          <span class="footer-text">已有账号？</span>
          <router-link to="/login" class="footer-link">立即登录</router-link>
        </div>
      </div>

      <div class="register-decoration">
        <div class="decoration-content">
          <h2>加入我们</h2>
          <p>注册成为会员，解锁更多 AI 营销功能</p>
          <div class="benefit-list">
            <div class="benefit-item">
              <el-icon class="benefit-icon"><Check /></el-icon>
              <span>AI 智能文案生成</span>
            </div>
            <div class="benefit-item">
              <el-icon class="benefit-icon"><Check /></el-icon>
              <span>个性化内容推荐</span>
            </div>
            <div class="benefit-item">
              <el-icon class="benefit-icon"><Check /></el-icon>
              <span>历史记录云同步</span>
            </div>
            <div class="benefit-item">
              <el-icon class="benefit-icon"><Check /></el-icon>
              <span>专属客户支持</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Message, Lock, MagicStick, Check } from '@element-plus/icons-vue'
import { register } from '../api/authApi'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { setUser, setToken } = useAuth()

const formRef = ref(null)
const loading = ref(false)

const formData = reactive({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 验证确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为2-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    const res = await register({
      nickname: formData.nickname,
      email: formData.email,
      password: formData.password
    })

    // 保存 token 和用户信息
    setToken(res.access_token)
    setUser(res.user)

    ElMessage.success('注册成功！')

    // 跳转到首页
    router.push('/')
  } catch (error) {
    ElMessage.error(error || '注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-container {
  display: flex;
  max-width: 900px;
  width: 100%;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.register-card {
  flex: 1;
  padding: 50px 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 36px;
  color: var(--primary-color);
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.register-form {
  margin-bottom: 30px;
}

.register-form :deep(.el-input__wrapper) {
  border-radius: 10px;
}

.register-footer {
  text-align: center;
}

.footer-text {
  color: var(--text-muted);
  font-size: 14px;
}

.footer-link {
  color: var(--primary-color);
  font-size: 14px;
  text-decoration: none;
  margin-left: 5px;
}

.footer-link:hover {
  text-decoration: underline;
}

.register-decoration {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.decoration-content {
  color: white;
  text-align: center;
}

.decoration-content h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
}

.decoration-content p {
  font-size: 15px;
  opacity: 0.9;
  margin-bottom: 40px;
  line-height: 1.6;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
}

.benefit-icon {
  font-size: 20px;
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .register-decoration {
    display: none;
  }

  .register-card {
    padding: 30px 20px;
  }
}
</style>
