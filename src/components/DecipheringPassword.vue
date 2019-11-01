<template>
  <div class="deciphering-password-container"
       v-loading="isLoading">
    <el-form :model="ruleForm"
             :rules="rules"
             ref="ruleForm"
             @submit.native.prevent
             label-width="60px">
      <el-form-item label="密码"
                    prop="password">
        <el-input type="password"
                  v-model="ruleForm.password"
                  auto-complete="new-password"
                  autocomplete="off"
                  placeholder="请输入解密密码"
                  @keyup.enter.native="submitForm('ruleForm')"
                  clearable></el-input>
      </el-form-item>
      <el-form-item class="table-sure-btn">
        <el-button type="primary"
                   size="mini"
                   @click="submitForm('ruleForm')">确定</el-button>
        <el-button size="mini"
                   @click="close()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { decipheringFolderPassword, decipheringWordPassword } from '../request/compare_request'

@Component({
  props: {
    isFolderOrFile: String
  }
})
export default class extends Vue {
  ruleForm: any = {
    password: ''
  }
  rules: Object = {
    password: [
      {
        required: true,
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (value.length === 0) {
            callback(new Error('请输入解密密码'))
          } else {
            callback()
          }
        }
      }
    ]
  }
  isLoading: Boolean = false
  inputPasswordCount: number = 0

  created() {}

  mounted() {}

  close() {
    this.$emit('close', {
      index: 0,
      dialog: 'isDecipheringPassword'
    })
  }

  alert1() {
    alert(123)
  }

  // 新建用户点击确定提交
  submitForm(ruleForm) {
    const ruleFormObj: any = this.$refs.ruleForm
    ruleFormObj.validate(valid => {
      if (valid) {
        this.isLoading = true

        if (this.$props.isFolderOrFile === 'folder') {
          let params: Object = {
            excel: this.ruleForm.password
          }
          const callback = () => {
            this.isLoading = false
            this.$message({
              type: 'success',
              message: '文件夹解密成功'
            })
          }
          this.toDecipheringFolderPassword(params, callback)
        } else if (this.$props.isFolderOrFile === 'file') {
          let params: Object = {
            word: this.ruleForm.password
          }
          const callback = () => {
            this.isLoading = false
            this.$message({
              type: 'success',
              message: 'Word文件解密成功'
            })
          }
          this.toDecipheringWordPassword(params, callback)
        }
      } else {
        return false
      }
    })
  }

  // Excel文件夹解密
  toDecipheringFolderPassword(params, callback) {
    decipheringFolderPassword(params)
      .then(res => {
        if (res.data.status === '200') {
          callback && callback()
          this.$emit('close', {
            index: 2,
            dialog: 'isDecipheringPassword'
          })
        } else {
          this.inputPasswordCount++
          this.isLoading = false
          this.$message({
            type: 'error',
            message: res.data.msg
          })
          if (this.inputPasswordCount === 3) {
            this.inputPasswordCount = 0
            this.$emit('close', {
              index: 1,
              dialog: 'isDecipheringPassword'
            })
          }
        }
      })
      .catch(() => {
        this.$emit('close', {
          index: 1,
          dialog: 'isDecipheringPassword'
        })
        this.isLoading = false
      })
  }

  // word加密文件解密
  toDecipheringWordPassword(params, callback) {
    decipheringWordPassword(params)
      .then(res => {
        if (res.data.status === '200') {
          callback && callback()
          this.$emit('close', {
            index: 4,
            dialog: 'isDecipheringPassword'
          })
        } else {
          this.inputPasswordCount++
          this.isLoading = false
          this.$message({
            type: 'error',
            message: res.data.msg
          })
          if (this.inputPasswordCount === 3) {
            this.inputPasswordCount = 0
            this.$emit('close', {
              index: 3,
              dialog: 'isDecipheringPassword'
            })
          }
        }
      })
      .catch(() => {
        this.isLoading = false
        this.$emit('close', {
          index: 3,
          dialog: 'isDecipheringPassword'
        })
      })
  }
}
</script>

<style lang="scss">
.deciphering-password-container {
  width: 100%;
  padding: 20px 0 0 0;
  .el-form {
    .el-form-item {
      padding: 0 20px 0 10px;
      &.is-success {
        .el-input__inner {
          border-color: #dcdfe6;
        }
      }
      .el-form-item__content {
        .el-input {
          .el-input__inner {
            &:focus {
              border-color: #42a1f8;
              -webkit-box-shadow: 0 0 1px 1px rgba(66, 161, 248, 0.6);
              -moz-box-shadow: 0 0 1px 1px rgba(66, 161, 248, 0.6);
              box-shadow: 0 0 1px 1px rgba(66, 161, 248, 0.6);
            }
          }
        }
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>


