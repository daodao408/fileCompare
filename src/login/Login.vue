<template>
  <div class="login-container">
    <div class="login-img">
      <img src="../assets/images/login-img.png" />
    </div>
    <div class="login-content">
      <div class="login-content-detail clearfloat">
        <el-form class="login-form"
                 autoComplete="off"
                 :model="loginForm"
                 @validate="formValidate"
                 :rules="loginRules"
                 ref="loginForm"
                 label-position="left">
          <el-form-item prop="title">
            <span class="login-title">你好，欢迎登录</span>
          </el-form-item>
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-yonghutouxiang1"
                      name="username"
                      type="text"
                      maxlength="50"
                      v-model="loginForm.username"
                      auto-complete="off"
                      autocomplete="off"
                      placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-mima"
                      name="password"
                      :type="passwordType"
                      maxlength="50"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.password"
                      auto-complete="new-password"
                      autocomplete="off"
                      placeholder="请输入密码" />
          </el-form-item>
          <el-button type="primary"
                     class="login-btn"
                     :loading="loading"
                     @click.native.prevent="handleLogin">登录</el-button>
        </el-form>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { toLogin } from '../request/login_request'
import { LoginValidator } from '../typings/type'
@Component({
  components: {}
})
export default class Login extends Vue {
  loginForm: LoginValidator = {
    username: '',
    password: ''
  }
  loginRules: any = {
    username: [
      {
        required: true,
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (value.length < 1) {
            callback(new Error('请输入用户名'))
          } else if (value.length > 40) {
            callback(new Error('用户名不能大于40位'))
          } else {
            callback()
          }
        }
      }
    ],
    password: [
      {
        required: true,
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (value) {
            if (value.length < 4) {
              callback(new Error('密码不能小于4位'))
            } else if (value.length > 40) {
              callback(new Error('密码不能大于40位'))
            } else {
              callback()
            }
          } else {
            callback(new Error('请输入密码'))
          }
        }
      }
    ]
  }
  passwordType: String = 'password'
  loading: Boolean = false
  nameValidate: Boolean = false
  pwdValidate: Boolean = false
  userRole: String = '' // 用户角色

  created() {}

  mounted() {}

  formValidate(name, valid) {
    if (name === 'username') {
      this.nameValidate = valid
    } else {
      this.pwdValidate = valid
    }
  }

  // 点击登录
  handleLogin() {
    const loginForm: any = this.$refs.loginForm
    loginForm.validate(valid => {
      if (valid) {
        this.loading = true
        let params = {
          userName: this.loginForm.username,
          password: this.loginForm.password
        }
        toLogin(params)
          .then(res => {
            if (res.data.status === '200') {
              this.loading = false
              localStorage.userinfo = JSON.stringify([
                {
                  userName: res.data.data.userName,
                  name: res.data.data.name,
                  password: res.data.data.password
                }
              ])
              this.$router.push({
                path: '/compareFile'
              })
            } else {
              this.loading = false
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss">
.login-container {
  position: fixed;
  height: 100%;
  width: calc(100%);
  background: #2a3043;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-img {
    width: 35%;
    margin-left: 10%;
    margin-right: 12%;
    img {
      width: 100%;
      height: auto;
    }
  }
  .login-content {
    width: 40%;
    height: 348px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .login-content-detail {
      width: 60%;
      height: 348px;
      background-color: rgba(255, 255, 255, 1);
      position: relative;
      .login-form {
        float: right;
        width: 100%;
        height: 100%;
        padding-left: 25px;
        padding-right: 25px;
        padding-top: 30px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .el-form-item {
          margin-bottom: 20px;
          .el-form-item__content {
            .login-title {
              display: inline-block;
              padding-bottom: 15px;
              font-size: 18px;
              font-weight: 700;
            }
            .el-input {
              &.el-input--prefix {
                .el-input__inner {
                  padding-left: 42px;
                }
              }
              .el-input__inner {
                height: 53px;
                line-height: 53px;
                color: #333e5c;
                border: 1px solid #dfdfdf;
              }
              .el-input__prefix {
                left: 12px;
                i {
                  font-size: 20px;
                  color: #ccc;
                  &.el-input__icon {
                    line-height: 53px;
                  }
                }
              }
            }
          }
        }
      }
      .login-btn {
        width: 100%;
        height: 42px;
        line-height: 42px;
        background-color: #1890ff;
        padding: 0;
        margin-top: 20px;
        font-size: 16px;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 5px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
    i {
      &.icon-yanjing {
        font-size: 18px;
      }
      &.icon-kejian {
        font-size: 22px;
      }
    }
  }
}
</style>
