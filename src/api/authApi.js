import request from './request'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}

// 注册
export function register(data) {
  return request({
    url: '/login/register',
    method: 'POST',
    data
  })
}
