import request from './request'

// 获取文章评论
export function getArticleComments(articleId, params) {
  return request({
    url: `/articles/${articleId}/comments`,
    method: 'GET',
    params
  })
}

// 发表评论
export function createComment(data) {
  return request({
    url: '/comments',
    method: 'POST',
    data
  })
}
