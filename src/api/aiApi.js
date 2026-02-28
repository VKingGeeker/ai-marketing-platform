import request from './request'

// 营销文案生成
export function generateMarketingCopy(data) {
  return request({
    url: '/ai/marketing-copy',
    method: 'POST',
    data
  })
}

// 产品描述生成
export function generateProductDesc(data) {
  return request({
    url: '/ai/product-desc',
    method: 'POST',
    data
  })
}

// 社交媒体内容生成
export function generateSocialContent(data) {
  return request({
    url: '/ai/social-content',
    method: 'POST',
    data
  })
}

// 获取用户生成历史
export function getUserHistory(params) {
  return request({
    url: '/ai/history',
    method: 'GET',
    params
  })
}
