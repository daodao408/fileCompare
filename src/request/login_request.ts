import request from './request'

// 登录
export function toLogin(params) {
  return request({
    url: `/api/login/toLogin`,
    method: 'post',
    data: {
      userName: params.userName,
      password: params.password
    }
  })
}

// 登出
export function toLogout() {
  return request({
    url: `/api/login/logout`,
    method: 'get'
  })
}
