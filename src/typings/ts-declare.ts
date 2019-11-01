declare global {
  interface Window {
    vm: Object
    url: any
    webkitURL: any
    // 首页winform提供的接口对象
    IndexActions: {
      loadData: Function
      getFiles: Function
      getMenuFile: Function
      getDirectoryInfo: Function
      createObjectURL: Function
    }
  }
}
export default global
