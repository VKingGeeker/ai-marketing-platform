import request from './request'

// 获取文章列表
export function getArticles(params) {
  return request({
    url: '/articles',
    method: 'GET',
    params
  })
}

// 获取文章详情
export function getArticleById(id) {
  return request({
    url: `/articles/${id}`,
    method: 'GET'
  })
}

// 获取mock文章列表（备用）
export function getMockArticles() {
  return request({
    url: '/articles/mock',
    method: 'GET'
  })
}
