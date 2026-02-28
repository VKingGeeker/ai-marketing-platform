import { ref, computed } from 'vue'

// 用户信息
const user = ref(null)

// 计算属性：是否已登录
const isLoggedIn = computed(() => !!user.value)

// 初始化用户信息（从 localStorage 恢复）
export function initAuth() {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch {
      user.value = null
    }
  }
}

// 设置用户信息
export function setUser(userData) {
  user.value = userData
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData))
  } else {
    localStorage.removeItem('user')
  }
}

// 设置 token
export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

// 获取 token
export function getToken() {
  return localStorage.getItem('token')
}

// 退出登录
export function logout() {
  user.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// 导出 composable
export function useAuth() {
  return {
    user,
    isLoggedIn,
    initAuth,
    setUser,
    setToken,
    getToken,
    logout
  }
}
