export default class Utils {
  // 时间补0
  static timeFilter(m) {
    return m < 10 ? '0' + m : m
  }

  // 时间格式化
  static formatDate(time: string): string {
    // if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    //     timestamp = timestamp.replace("-", "/");
    // }
    //let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    if (time) {
      let date = new Date(time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = date.getDate()
      let h = date.getHours()
      let m = date.getMinutes()
      let s = date.getSeconds()
      return `${Y}${M}${Utils.timeFilter(D)}  ${Utils.timeFilter(h)}:${Utils.timeFilter(m)}:${Utils.timeFilter(s)}`
    }
    return ''
  }

  // 获取当前时间格式化的字符串
  static formatCurrentTime(time: number) {
    let date = new Date(time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    if (time) {
      let date = new Date(time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let D = date.getDate()
      let h = date.getHours()
      let m = date.getMinutes()
      let s = date.getSeconds()
      return `${Y}${M}${Utils.timeFilter(D)}${Utils.timeFilter(h)}${Utils.timeFilter(m)}${Utils.timeFilter(s)}`
    }
    return ''
  }

  // base64图片格式转换成图片文件
  static dataURItoBlob(base64Data): any {
    base64Data = base64Data.split(',')[1]
    base64Data = window.atob(base64Data)
    var ia = new Uint8Array(base64Data.length)
    for (var i = 0; i < base64Data.length; i++) {
      ia[i] = base64Data.charCodeAt(i)
    }
    return new Blob([ia], { type: 'image/png', endings: 'transparent' })
  }
}
