import request from './request'

// 提交反馈
export function createFeedback(data) {
  return request({
    url: '/feedback',
    method: 'POST',
    data
  })
}

// 获取我的反馈
export function getMyFeedbacks(params) {
  return request({
    url: '/feedback/my',
    method: 'GET',
    params
  })
}
