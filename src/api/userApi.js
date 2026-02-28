import request from './request'

// 获取用户信息
export function getUserProfile() {
  return request({
    url: '/user/profile',
    method: 'GET'
  })
}

// 更新用户信息
export function updateUserProfile(data) {
  return request({
    url: '/user/profile',
    method: 'PUT',
    data
  })
}
