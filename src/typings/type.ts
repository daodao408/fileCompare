// 登录用户校验参数
export interface LoginValidator {
  username: ''
  password: ''
  checked?: false
}

// 新建用户校验参数
export interface Validator {
  name: string
  userName: string
  message?: string
  role: string
  password: string
  checkPassword: string
}

// 修改校验参数
export interface ChangePasswordValidator {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// 来访管理来访人员信息
export interface VisitorInfo {
  visitorId: string
  visitorName: string
  visitorAddress: string
  visitorReasonsBlacklist: string
  visitorAge: any
  visitorSex: string
  visitorIdCard: string
  visitorBlacklist: boolean
  visitorVisitCount: any
  visitorFirstVisitTime: string
  visitorLastVisitTime: string
  visitHistoryVoList: Array<Object>
}

// 消息管理显示的访客信息
export interface MessageVisitorData {
  address: string
  age: any
  blacklist: boolean
  createTime: number
  id: string
  idCard: string
  imgUrl: string
  name: string
  sex: any
  userTag: string
  reasonsBlacklist: string
}
