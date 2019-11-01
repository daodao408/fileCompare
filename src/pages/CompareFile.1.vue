<template>
  <div class="compare-file-container clearfloat">
    <head-div :currentStep="currentStep"></head-div>
    <div class="first-step-page"
         v-show="currentStep === 0"
         v-loading="isLoading">
      <div class="first-step-content">
        <div class="chose-file-left">
          <div class="chose-file-left-zone">
            <!-- <input ref="file"
                   class="fileUploaderClass"
                   type='file'
                   name="file"
                   webkitdirectory
                   @change.stop="changesData" /> -->
            <uploader :options="uploaderFolderOptions"
                      ref="uploaderFolder"
                      @files-added="onFolderAdded"
                      class="uploader-container">
              <div class="border-left-top"></div>
              <div class="border-right-top"></div>
              <div class="border-left-middle"></div>
              <div class="border-left-bottom"></div>
              <div class="border-right-middle"></div>
              <div class="border-right-bottom"></div>
              <uploader-drop>
                <div class="upload-info"
                     :class="[uploadFoldFlag ? 'upload-success' : 'upload-warning']"
                     v-show="!uploadFoldFlag">
                  <i></i>
                  <span>未选择文件</span>
                </div>
                <div class="upload-info"
                     :class="[uploadFoldFlag ? 'upload-success' : 'upload-warning']"
                     v-show="uploadFoldFlag">
                  <i></i>
                  <span>已选择文件</span>
                </div>
                <img class="circle-icon"
                     src="../assets/images/icon-folder.png" />
                <div class="upload-title">选择源文件</div>
                <p class="upload-text">上传一个包含对比文件的文件夹，<br/>此文件夹中信息将作为对比的源对象</p>

                <uploader-btn class="file-upload-btn"
                              :directory="true">
                  <i class="icon-upload"></i>点击选择</uploader-btn>
              </uploader-drop>
            </uploader>
          </div>
        </div>
        <div class="chose-file-right">
          <div class="chose-file-right-zone">
            <uploader :options="uploaderFileOptions"
                      ref="uploaderFile"
                      @files-added="onFileAdded"
                      class="uploader-container">
              <div class="border-left-top"></div>
              <div class="border-right-top"></div>
              <div class="border-left-middle"></div>
              <div class="border-left-bottom"></div>
              <div class="border-right-middle"></div>
              <div class="border-right-bottom"></div>
              <uploader-drop>
                <div class="upload-info"
                     :class="[uploadFileFlag ? 'upload-success' : 'upload-warning']"
                     v-show="!uploadFileFlag">
                  <i></i>
                  <span>未选择文件</span>
                </div>
                <div class="upload-info"
                     :class="[uploadFileFlag ? 'upload-success' : 'upload-warning']"
                     v-show="uploadFileFlag">
                  <i></i>
                  <span>已选择文件</span>
                </div>
                <img class="circle-icon"
                     src="../assets/images/icon-word.png" />
                <div class="upload-title">选择比对文件</div>
                <p class="upload-text">上传需要信息比对的文件，<br/>仅限Word文件</p>

                <uploader-btn class="file-upload-btn"
                              :single="true">
                  <i class="icon-upload"></i>点击选择</uploader-btn>
              </uploader-drop>
            </uploader>
          </div>
        </div>
      </div>
      <div class="first-step-btn compare-btn-container">
        <div class="next-step-btn"
             @click="toReadFile">读取文件</div>
      </div>
    </div>
    <read-file-table v-if="currentStep === 1"
                     :currentStep="currentStep"
                     @toNext="toNextStep"
                     @toPre="toPreStep"></read-file-table>
    <compare-file-result-table v-if="currentStep === 2"
                               :currentStep="currentStep"
                               @toPre="toPreStep"></compare-file-result-table>
    <el-dialog :title="dialogTitle"
               class="vm-dialog"
               :close-on-click-modal="false"
               top="35vh"
               :visible.sync="isDecipheringPassword"
               append-to-body>
      <deciphering-password @close="getCloseDialog"
                            :isFolderOrFile="isFolderOrFile"
                            v-if="isDecipheringPassword" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import HeadDiv from '../components/Head.vue'
import VmSearch from '../components/VmSearch.vue'
import DecipheringPassword from '../components/DecipheringPassword.vue'
import ReadFileTable from '../components/ReadFileTable.vue'
import CompareFileResultTable from '../components/CompareFileResultTable.vue'
import {
  validateExcelPassword,
  decipheringFolderPassword,
  validateWordPassword,
  decipheringWordPassword
} from '../request/compare_request'
import Utils from '../utils/utils'

@Component({
  components: { VmSearch, HeadDiv, ReadFileTable, CompareFileResultTable, DecipheringPassword },
  filters: {
    formatDate: Utils.formatDate
  }
})
export default class Main extends Vue {
  currentStep: any = 0
  uploaderFolderOptions: any = {
    allowDuplicateUploads: true
  } // 上传文件夹选项
  uploaderFileOptions: any = {
    allowDuplicateUploads: true,
    autoStart: false
  } // 上传文件选项
  folderFileList: any = [] // 上传文件夹文件数组
  compareFileList: any = [] // 上传文件夹文件数组
  uploadFoldFlag: Boolean = false // 上传文件夹标志量  已选择   未选择
  uploadFileFlag: Boolean = false // 上传文件标志量  已选择   未选择
  userTableData: Array<any> = []
  userTableCheckData: Array<any> = []
  sortField: String = '' // 排序的字段名称
  sortOrder: String = '' // 排序的类别  升序 降序
  tableCount: Number = 0 // 表格数据的总条数
  tablePages: Number = 0 // 表格数据的总页数
  limit: Number = 10 // 分页页数 默认10
  currentPage: Number = 1 // 当前页页数 默认1
  isLoading: Boolean = false
  queryKey: String = '' // 搜索关键字
  dialogTitle: String = '' // 弹出框标题
  isDecipheringPassword: Boolean = false // 解密弹出框标识量
  isFolderOrFile: String = '' // 文件夹或者文件的标识  folder 文件夹  file 文件

  created() {}

  mounted() {
    this.$nextTick(() => {})
  }

  onFolderAdded(files, fileList) {
    const uploadFolderRef: any = this.$refs.uploaderFolder
    uploadFolderRef.uploader.resume()
    this.folderFileList.length = 0
    for (let item of files) {
      let fileSuffix = item.name.substring(item.name.lastIndexOf('.') + 1)
      if (fileSuffix === 'xls' || fileSuffix === 'xlsx') {
        if (item.name.indexOf('~$') === -1) {
          this.folderFileList.push(item.file)
        }
      }
    }
    if (this.folderFileList.length === 0) {
      this.$message({
        type: 'warning',
        message: '上传文件夹中未找到Excel文件'
      })
      this.uploadFoldFlag = false
      return false
    } else {
      let params = new FormData()
      for (let item of this.folderFileList) {
        params.append('excel', item)
      }
      validateExcelPassword(params)
        .then(res => {
          if (res.data.status === '200') {
            if (res.data.data) {
              this.isDecipheringPassword = true
              this.dialogTitle = '文件夹解密'
              this.isFolderOrFile = 'folder'
              // this.$prompt('请输入文件夹解密密码', '文件夹解密', {
              //   closeOnClickModal: false,
              //   confirmButtonText: '确定',
              //   cancelButtonText: '取消',
              //   inputValidator: function(value) {
              //     if (value) {
              //       // 如果包含特殊字符返回false
              //       return true
              //     }
              //     return false
              //   },
              //   inputErrorMessage: '文件夹解压密码不能为空'
              // })
              //   .then(({ value }) => {
              //     this.isLoading = true
              //     let tempParams = {
              //       excel: value
              //     }
              //     const callback = () => {
              //       this.isLoading = false
              //       this.$message({
              //         type: 'success',
              //         message: '文件夹解密成功'
              //       })
              //     }
              //     this.toDecipheringFolderPassword(tempParams, callback)
              //   })
              //   .catch(() => {
              //     this.uploadFoldFlag = false
              //     this.$message({
              //       type: 'info',
              //       message: '取消输入'
              //     })
              //   })
            } else {
              this.isLoading = true
              let tempParams = {
                excel: ''
              }
              const callback = () => {
                this.isLoading = false
                this.$message({
                  type: 'success',
                  message: '文件夹上传成功'
                })
              }
              this.toDecipheringFolderPassword(tempParams, callback)
            }
          }
        })
        .catch(() => {
          this.uploadFoldFlag = false
          return false
        })
    }
  }

  onFileAdded(files, fileList) {
    const uploadFileRef: any = this.$refs.uploaderFile
    uploadFileRef.uploader.resume()
    this.compareFileList = files
    let fileSuffix = files[0].name.substring(files[0].name.lastIndexOf('.') + 1)
    if (fileSuffix !== 'doc' && fileSuffix !== 'docx') {
      this.$message({
        type: 'warning',
        message: '所选比对文件请选择word文件'
      })
      this.uploadFileFlag = false
      return false
    } else {
      let params = new FormData()
      params.append('word', this.compareFileList[0].file)
      validateWordPassword(params)
        .then(res => {
          if (res.data.status === '200') {
            if (res.data.data) {
              this.isDecipheringPassword = true
              this.dialogTitle = '文件解密'
              this.isFolderOrFile = 'file'
              // this.$prompt('请输入Word文件解密密码', 'Word文件解密', {
              //   closeOnClickModal: false,
              //   confirmButtonText: '确定',
              //   cancelButtonText: '取消',
              //   inputValidator: function(value) {
              //     if (value) {
              //       // 如果包含特殊字符返回false
              //       return true
              //     }
              //     return false
              //   },
              //   inputErrorMessage: 'Word文件解压密码不能为空'
              // })
              //   .then(({ value }) => {
              //     this.isLoading = true
              //     let tempParams = {
              //       word: value
              //     }
              //     const callback = () => {
              //       this.isLoading = false
              //       this.$message({
              //         type: 'success',
              //         message: 'Word文件解密成功'
              //       })
              //     }
              //     this.toDecipheringWordPassword(tempParams, callback)
              //   })
              //   .catch(() => {
              //     this.uploadFileFlag = false
              //     this.$message({
              //       type: 'info',
              //       message: '取消输入'
              //     })
              //   })
            } else {
              this.isLoading = true
              let tempParams = {
                word: ''
              }
              const callback = () => {
                this.isLoading = false
                this.$message({
                  type: 'success',
                  message: '文件上传成功'
                })
              }
              this.toDecipheringWordPassword(tempParams, callback)
            }
          }
        })
        .catch(() => {
          this.uploadFileFlag = false
          return false
        })
    }
  }

  // Excel文件夹解密
  toDecipheringFolderPassword(params, callback) {
    decipheringFolderPassword(params)
      .then(res => {
        if (res.data.status === '200') {
          this.uploadFoldFlag = true
          callback && callback()
        } else {
          this.isLoading = false
          this.uploadFoldFlag = false
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
      .catch(() => {
        this.uploadFoldFlag = false
        this.isLoading = false
      })
  }

  // word加密文件解密
  toDecipheringWordPassword(params, callback) {
    decipheringWordPassword(params)
      .then(res => {
        if (res.data.status === '200') {
          this.uploadFileFlag = true
          callback && callback()
        } else {
          this.isLoading = false
          this.uploadFileFlag = false
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
      .catch(() => {
        this.isLoading = false
        this.uploadFileFlag = false
      })
  }

  // 点击读取文件
  toReadFile() {
    if (!this.uploadFoldFlag) {
      this.$message({
        type: 'warning',
        message: '请选择源文件夹进行比对'
      })
      return false
    }
    if (!this.uploadFileFlag) {
      this.$message({
        type: 'warning',
        message: '请选择Word文件在进行比对'
      })
      return false
    }
    this.toNextStep()
    // let params = new FormData()
    // if (!this.uploadFoldFlag) {
    //   this.$message({
    //     type: 'warning',
    //     message: '请选择源文件夹进行比对'
    //   })
    //   return false
    // }
    // if (!this.uploadFileFlag) {
    //   this.$message({
    //     type: 'warning',
    //     message: '请选择Word文件在进行比对'
    //   })
    //   return false
    // }
    // for (let item of this.folderFileList) {
    //   params.append('excel', item)
    // }
    // params.append('word', this.compareFileList[0].file)
    // this.isLoading = true
    // readFileToCompare(params)
    //   .then(res => {
    //     if (res.data.status === '200') {
    //       this.isLoading = false
    //     } else {
    //       this.isLoading = false
    //     }
    //   })
    //   .catch(() => {
    //     this.isLoading = false
    //   })
  }

  // 上一步点击
  toPreStep() {
    if (this.currentStep === 0) {
      this.currentStep = 0
    } else {
      this.currentStep -= 1
      if (this.currentStep === 1) {
        this.$root.$data.eventHub.$emit('refreshThirdStepStatus', {
          status: 'wait'
        })
      }
    }
  }

  // 下一步点击
  toNextStep() {
    if (this.currentStep === 2) {
      this.currentStep = 0
    } else {
      this.currentStep += 1
      if (this.currentStep === 2) {
        this.$root.$data.eventHub.$emit('refreshThirdStepStatus', {
          status: 'finish'
        })
      }
    }
  }

  // 关闭弹出框dialog
  getCloseDialog(data) {
    this[data.dialog] = false
    if (data.index === 1) {
      this.uploadFoldFlag = false
    } else if (data.index === 2) {
      this.uploadFoldFlag = true
    } else if (data.index === 3) {
      this.uploadFileFlag = false
    } else if (data.index === 4) {
      this.uploadFileFlag = true
    }
  }
}
</script>

<style lang="scss">
@media screen and (min-width: 1440px) {
  .first-step-page {
    .first-step-content {
      width: 100%;
      height: calc(100% - 72px - 60px);
      display: flex;
      justify-content: center;
      align-items: center;
      .chose-file-left {
        .chose-file-left-zone {
          display: inline-block;
          width: 360px;
          height: 360px;
          background-color: #343f5b;
        }
      }
      .chose-file-right {
        .chose-file-right-zone {
          width: 360px;
          height: 360px;
          background-color: #343f5b;
        }
      }
      .uploader-container {
        .uploader-drop {
          .upload-info {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: left;
            font-weight: normal;
            font-style: normal;
            font-size: 14px;
            padding-top: 18px;
            padding-left: 18px;
            i {
              display: inline-block;
              vertical-align: top;
              width: 16px;
              height: 16px;
              margin-right: 3px;
              background-size: 100% 100%;
            }
            span {
              display: inline-block;
              vertical-align: top;
              height: 16px;
              line-height: 16px;
            }
          }
          .circle-icon {
            width: 75px;
            height: 75px;
            border-radius: 75px;
            text-align: center;
            margin: 65px auto 0 auto;
            background-size: 100% 100%;
          }
          .upload-title {
            width: 100%;
            text-align: center;
            font-weight: 600;
            font-style: normal;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.85);
            margin-top: 24px;
          }
          .upload-text {
            width: 100%;
            text-align: center;
            font-weight: normal;
            font-style: normal;
            line-height: 1.2;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.65);
            margin-top: 14px;
          }
          .file-upload-btn {
            width: 120px;
            height: 36px;
            line-height: 36px;
            color: rgba(255, 255, 255, 0.85);
            font-size: 12px;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 0;
            border: none;
            border-radius: 0;
            margin-top: 50px;
            &:hover {
              background-color: rgba(255, 255, 255, 0.5);
            }
            .icon-upload {
              display: inline-block;
              vertical-align: top;
              width: 16px;
              height: 16px;
              background: url('../assets/images/icon-upload.png') center center no-repeat;
              margin-right: 8px;
              margin-top: 9px;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1600px) {
  .first-step-page {
    .first-step-content {
      width: 100%;
      height: calc(100% - 72px - 50px);
      display: flex;
      justify-content: center;
      align-items: center;
      .chose-file-left {
        .chose-file-left-zone {
          display: inline-block;
          width: 375px;
          height: 375px;
          background-color: #343f5b;
        }
      }
      .chose-file-right {
        .chose-file-right-zone {
          width: 375px;
          height: 375px;
          background-color: #343f5b;
        }
      }
      .uploader-container {
        .uploader-drop {
          .upload-info {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: left;
            font-weight: normal;
            font-style: normal;
            font-size: 14px;
            padding-top: 20px;
            padding-left: 20px;
            i {
              display: inline-block;
              vertical-align: top;
              width: 16px;
              height: 16px;
              margin-right: 3px;
              background-size: 100% 100%;
            }
            span {
              display: inline-block;
              vertical-align: top;
              height: 16px;
              line-height: 16px;
            }
          }
          .circle-icon {
            width: 85px;
            height: 85px;
            border-radius: 85px;
            text-align: center;
            margin: 60px auto 0 auto;
            background-size: 100% 100%;
          }
          .upload-title {
            width: 100%;
            text-align: center;
            font-weight: 600;
            font-style: normal;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.85);
            margin-top: 20px;
          }
          .upload-text {
            width: 100%;
            text-align: center;
            font-weight: normal;
            font-style: normal;
            line-height: 1.5;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.65);
            margin-top: 12px;
          }
          .file-upload-btn {
            width: 140px;
            height: 38px;
            line-height: 38px;
            color: rgba(255, 255, 255, 0.85);
            font-size: 12px;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 0;
            border: none;
            border-radius: 0;
            margin-top: 55px;
            &:hover {
              background-color: rgba(255, 255, 255, 0.5);
            }
            .icon-upload {
              display: inline-block;
              vertical-align: top;
              width: 16px;
              height: 16px;
              background: url('../assets/images/icon-upload.png') center center no-repeat;
              margin-right: 8px;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .first-step-page {
    .first-step-content {
      width: 100%;
      height: calc(100% - 72px - 100px);
      display: flex;
      justify-content: center;
      align-items: center;
      .chose-file-left {
        .chose-file-left-zone {
          display: inline-block;
          width: 450px;
          height: 450px;
          background-color: #343f5b;
        }
      }
      .chose-file-right {
        .chose-file-right-zone {
          width: 450px;
          height: 450px;
          background-color: #343f5b;
        }
      }
      .uploader-container {
        .uploader-drop {
          .upload-info {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: left;
            font-weight: normal;
            font-style: normal;
            font-size: 14px;
            padding-top: 24px;
            padding-left: 24px;
            i {
              display: inline-block;
              vertical-align: top;
              width: 16px;
              height: 16px;
              margin-right: 3px;
              background-size: 100% 100%;
            }
            span {
              display: inline-block;
              vertical-align: top;
              height: 16px;
              line-height: 16px;
            }
          }
          .circle-icon {
            width: 100px;
            height: 100px;
            border-radius: 100px;
            text-align: center;
            margin: 80px auto 0 auto;
            background-size: 100% 100%;
          }
          .upload-title {
            width: 100%;
            text-align: center;
            font-weight: 600;
            font-style: normal;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.85);
            margin-top: 32px;
          }
          .upload-text {
            width: 100%;
            text-align: center;
            font-weight: normal;
            font-style: normal;
            line-height: 1.5;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.65);
            margin-top: 16px;
          }
          .file-upload-btn {
            width: 140px;
            height: 40px;
            line-height: 40px;
            color: rgba(255, 255, 255, 0.85);
            font-size: 14px;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 0;
            border: none;
            border-radius: 0;
            margin-top: 75px;
            &:hover {
              background-color: rgba(255, 255, 255, 0.5);
            }
            .icon-upload {
              display: inline-block;
              vertical-align: top;
              width: 16px;
              height: 16px;
              background: url('../assets/images/icon-upload.png') center center no-repeat;
              margin-right: 8px;
              margin-top: 11px;
            }
          }
        }
      }
    }
  }
}
.compare-file-container {
  width: 100%;
  height: calc(100vh);
  background-color: #141c33;
}
.first-step-page {
  width: 100%;
  height: calc(100% - 72px);
  .first-step-content {
    .chose-file-left {
      float: left;
      width: 50%;
      padding-right: 24px;
      text-align: right;
      box-sizing: border-box;
      margin-top: 4px;
    }
    .chose-file-right {
      float: left;
      width: 50%;
      padding-left: 24px;
      text-align: left;
      box-sizing: border-box;
    }
    .uploader-container {
      height: 100%;
      position: relative;
      -moz-box-shadow: 0px 0px 16px rgba(69, 174, 255, 0.16) inset;
      -webkit-box-shadow: 0px 0px 16px rgba(69, 174, 255, 0.16) inset;
      box-shadow: 0px 0px 16px rgba(69, 174, 255, 0.16) inset;
      border: 1px solid rgba(69, 174, 255, 0.25);
      .border-left-top {
        position: absolute;
        left: 0px;
        top: 0;
        z-index: 10;
        width: 10px;
        height: 10px;
        background: url('../assets/images/border-left-top-angle.png') no-repeat 0 0;
      }
      .border-right-top {
        position: absolute;
        right: 0px;
        top: 0;
        z-index: 10;
        width: 10px;
        height: 10px;
        background: url('../assets/images/border-right-top-angle.png') no-repeat 0 0;
      }
      .border-left-middle {
        position: absolute;
        left: -1px;
        top: 50%;
        z-index: 10;
        margin-top: -27px;
        width: 13px;
        height: 54px;
        background: url('../assets/images/border-left-middle.png') no-repeat 0 0;
      }
      .border-right-middle {
        position: absolute;
        right: -1px;
        top: 50%;
        z-index: 10;
        margin-top: -27px;
        width: 13px;
        height: 54px;
        background: url('../assets/images/border-right-middle.png') no-repeat 0 0;
      }
      .border-left-bottom {
        position: absolute;
        left: -1px;
        bottom: 0;
        z-index: 10;
        width: 20px;
        height: 20px;
        background: url('../assets/images/border-left-angle.png') no-repeat 0 0;
      }
      .border-right-bottom {
        position: absolute;
        right: -1px;
        bottom: 0;
        z-index: 10;
        width: 20px;
        height: 20px;
        background: url('../assets/images/border-right-angle.png') no-repeat 0 0;
      }
      .uploader-drop {
        padding: 0;
        height: 100%;
        text-align: center;
        border: none;
        background-color: transparent;
        .upload-info {
          &.upload-warning {
            i {
              background: url('../assets/images/icon-warning.png') center center no-repeat;
            }
            span {
              color: #ffcd2e;
            }
          }
          &.upload-success {
            i {
              background: url('../assets/images/icon-success.png') center center no-repeat;
            }
            span {
              color: #29ea92;
            }
          }
        }
      }
    }
  }

  .first-step-btn {
    width: 100%;
    text-align: center;
  }
}
</style>


