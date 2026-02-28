import { ref, watch } from 'vue'

// 存储键名
const STORAGE_KEYS = {
  HISTORY: 'ai_marketing_history',
  FAVORITES: 'ai_marketing_favorites'
}

// 解析 JSON，失败返回默认值
function parseJSON(value, defaultValue = []) {
  try {
    return JSON.parse(value) || defaultValue
  } catch {
    return defaultValue
  }
}

// 获取历史记录
export function getHistory() {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
  return parseJSON(data, [])
}

// 保存历史记录
export function saveHistory(history) {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
}

// 获取收藏列表
export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEYS.FAVORITES)
  return parseJSON(data, [])
}

// 保存收藏列表
export function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
}

// 生成唯一ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 添加历史记录
export function addHistory(item) {
  const history = getHistory()
  const newItem = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...item
  }
  history.unshift(newItem)
  // 最多保留100条记录
  if (history.length > 100) {
    history.pop()
  }
  saveHistory(history)
  return newItem
}

// 删除历史记录
export function deleteHistory(id) {
  const history = getHistory()
  const index = history.findIndex(item => item.id === id)
  if (index > -1) {
    history.splice(index, 1)
    saveHistory(history)
  }
  return history
}

// 添加收藏
export function addFavorite(item) {
  const favorites = getFavorites()
  const exists = favorites.some(f => f.id === item.id)
  if (!exists) {
    favorites.unshift({
      ...item,
      favoriteAt: new Date().toISOString()
    })
    saveFavorites(favorites)
  }
  return favorites
}

// 移除收藏
export function removeFavorite(id) {
  const favorites = getFavorites()
  const index = favorites.findIndex(f => f.id === id)
  if (index > -1) {
    favorites.splice(index, 1)
    saveFavorites(favorites)
  }
  return favorites
}

// 检查是否已收藏
export function isFavorite(id) {
  const favorites = getFavorites()
  return favorites.some(f => f.id === id)
}

// 清空历史记录
export function clearHistory() {
  saveHistory([])
}

// 组合式 API hook
export function useStorage() {
  const history = ref(getHistory())
  const favorites = ref(getFavorites())

  // 监听变化并同步
  watch(history, (newVal) => {
    saveHistory(newVal)
  }, { deep: true })

  watch(favorites, (newVal) => {
    saveFavorites(newVal)
  }, { deep: true })

  return {
    history,
    favorites,
    addHistory,
    deleteHistory,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearHistory,
    getHistory,
    getFavorites
  }
}
