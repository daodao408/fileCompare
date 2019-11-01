import request from './request'

// 文件上传
export function readFileToCompare(param) {
  return request({
    url: `/api/load/file`,
    method: 'put',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}

// 获取源文件夹表格中excel数据
export function getExcelFoldData(urlParams, params) {
  return request({
    url: `/api/load/queryExcelData`,
    method: 'post',
    params: {
      page: urlParams.page,
      limit: urlParams.limit
    },
    data: {
      queryKey: params.keyValue
    }
  })
}

// 获取对比word文件表格中excel数据
export function getWordFileData(urlParams, params) {
  return request({
    url: `/api/load/queryWordData`,
    method: 'post',
    params: {
      page: urlParams.page,
      limit: urlParams.limit
    },
    data: {
      queryKey: params.keyValue
    }
  })
}

// 对比文件夹和word文件
export function toCompareFile() {
  return request({
    url: `/api/load/compare`,
    method: 'put'
  })
}

// 获取对比结果表格中excel数据
export function getCompareFileResultData(urlParams) {
  return request({
    url: `/api/load/queryResultData`,
    method: 'get',
    params: {
      page: urlParams.page,
      limit: urlParams.limit
    }
  })
}

// 校验上传的Excel文件夹是否需要解密
export function validateExcelPassword(param) {
  return request({
    url: `/api/load/validateExcelPassword`,
    method: 'put',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}

// 上传的Excel文件夹解密
export function decipheringFolderPassword(params) {
  return request({
    url: `/api/load/excelFile`,
    method: 'post',
    data: params
  })
}

// 校验上传的word文件是否需要解密
export function validateWordPassword(param) {
  return request({
    url: `/api/load/validateWordPassword`,
    method: 'put',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}

// 上传的word文件解密
export function decipheringWordPassword(params) {
  return request({
    url: `/api/load/wordFile`,
    method: 'post',
    data: params
  })
}

// 导出对比结果表格中excel数据
// export function toExportCompareFileResult() {
//   return request({
//     url: `/api/load/download`,
//     method: 'get'
//   })
// }
