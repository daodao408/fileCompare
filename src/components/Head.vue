<template>
  <div class="head-container clearfloat"
       v-loading="isLoading">
    <div class="head-left-logo">
      <img src="../assets/images/compare-file-logo.png" />
      <span>东湖高新区“两委”人员比对系统</span>
    </div>
    <div class="head-middle-step">
      <div class="step1-selected-line"
           v-show="currentStep > 0"></div>
      <div class="step2-selected-line"
           v-show="currentStep > 1"></div>
      <!-- <div class="step3-selected-line"
           v-show="currentStep === 2"></div> -->
      <Steps :current="currentStep">
        <Step title="上传文件"
              content=""></Step>
        <Step title="读取文件"
              content=""></Step>
        <Step title="对比结果"
              content=""
              :status="setpThirdFinishFlag"
              ref="stepThirdRef"></Step>
      </Steps>
    </div>
    <div class="head-right-user">
      <img src="../assets/images/user-icon.png"
           alt="" />
      <el-dropdown trigger="click"
                   class="user-dropmenu"
                   @command="handleCommand">
        <span class="el-dropdown-link">
          <b>{{userName}}</b>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu class="dropdown-menu-list"
                          slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { toLogout } from '../request/login_request'

@Component({
  props: { currentStep: Number }
})
export default class extends Vue {
  userName: string = ''
  setpThirdFinishFlag: string = 'wait' // 第三步直接显示完成状态标志量
  isLoading: Boolean = false

  created() {}

  mounted() {
    if (localStorage.userinfo) {
      let userinfo = localStorage.userinfo
      userinfo = JSON.parse(userinfo)
      this.userName = userinfo[0].userName
    } else {
      this.$router.push({
        path: '/'
      })
    }
    this.$root.$data.eventHub.$on('refreshThirdStepStatus', this.toSetThirdStepStatus)
  }

  // 用户下拉点击
  handleCommand(command) {
    if (command === 'logout') {
      this.toLogout()
    }
  }

  // 登出操作
  toLogout() {
    toLogout()
      .then(res => {
        if (res.data.status === '200') {
          localStorage.removeItem('userinfo')
          this.$router.push({
            path: '/'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
      .catch(() => {
        this.isLoading = false
      })
  }

  // 设置第三步的状态
  toSetThirdStepStatus(data) {
    this.setpThirdFinishFlag = data.status
  }
}
</script>

<style lang="scss">
@media screen and (min-width: 1440px) {
  .head-middle-step {
    width: calc(100% - 650px);
    height: 72px;
    padding-left: calc((100% - 450px) * 0.33333 * 0.5);
    .step1-selected-line {
      position: absolute;
      width: 165px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 146px;
    }
    .step2-selected-line {
      position: absolute;
      width: 165px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 315px;
    }
    .step3-selected-line {
      position: absolute;
      width: 165px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 484px;
    }
    .ivu-steps {
      .ivu-steps-item {
        float: left;
        width: 170px !important;
        margin-top: 20px;
      }
    }
  }
}
@media screen and (min-width: 1600px) {
  .head-middle-step {
    width: calc(100% - 650px);
    height: 72px;
    padding-left: calc((100% - 210px) * 0.33333 * 0.5);
    .step1-selected-line {
      position: absolute;
      width: 183px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 198px;
    }
    .step2-selected-line {
      position: absolute;
      width: 183px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 385px;
    }
    .step3-selected-line {
      position: absolute;
      width: 183px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 572px;
    }
    .ivu-steps {
      .ivu-steps-item {
        float: left;
        width: 180px !important;
        margin-top: 20px;
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .head-middle-step {
    width: calc(100% - 650px);
    height: 72px;
    padding-left: calc((100% - 75px) * 0.33333 * 0.5);
    .step1-selected-line {
      position: absolute;
      width: 221px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 302px;
    }
    .step2-selected-line {
      position: absolute;
      width: 221px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 527px;
    }
    .step3-selected-line {
      position: absolute;
      width: 221px;
      height: 2px;
      background-color: #07be95;
      top: 70px;
      left: 752px;
    }
    .ivu-steps {
      .ivu-steps-item {
        width: 230px !important;
        margin-top: 20px;
      }
    }
  }
}
.head-container {
  width: 100%;
  height: 72px;
  background: url('../assets/images/bg-head.png') center center no-repeat;
  background-size: 100% 100%;
  padding: 0 24px;
  box-sizing: border-box;
  .head-left-logo {
    float: left;
    img {
      width: 30px;
      height: 30px;
      margin-top: 21px;
    }
    span {
      display: inline-block;
      vertical-align: top;
      height: 72px;
      line-height: 72px;
      font-size: 16px;
      font-weight: 600;
      margin-left: 8px;
      color: rgba(255, 255, 255, 0.85);
    }
  }
  .head-middle-step {
    float: left;
    text-align: center;
    position: relative;
    .ivu-steps {
      .ivu-steps-item {
        float: left;
        .ivu-steps-head {
          background-color: transparent;
          .ivu-steps-head-inner {
            border-color: rgba(255, 255, 255, 0.2);
            background-color: transparent;
          }
        }
        &.ivu-steps-status-process {
          .ivu-steps-head {
            .ivu-steps-head-inner {
              border-color: #1890ff;
              background-color: #1890ff;
              span {
                color: rgba(255, 255, 255, 0.85);
              }
            }
          }
        }
        &.ivu-steps-status-finish {
          .ivu-steps-head {
            .ivu-steps-head-inner {
              border-color: #07be95;
              background-color: #07be95;
              span {
                color: rgba(255, 255, 255, 0.85);
              }
            }
          }
        }

        &:last-child {
          &.ivu-steps-status-process {
            .ivu-steps-head {
              .ivu-steps-head-inner {
                // border-color: #07be95;
                // background-color: #07be95;
                span {
                  display: inline-block;
                  font-family: Ionicons;
                  speak: none;
                  font-style: normal;
                  font-weight: 400;
                  font-variant: normal;
                  text-transform: none;
                  text-rendering: auto;
                  line-height: 1;
                  position: relative;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                  vertical-align: middle;
                  color: rgba(255, 255, 255, 0.85);
                }
              }
            }
          }
        }

        .ivu-steps-tail {
          width: calc(100% - 92px);
          left: 92px;
          i {
            height: 0;
          }
        }
        .ivu-steps-main {
          display: inline-block;
          margin-top: 1.5px;
          .ivu-steps-title {
            font-weight: normal;
            color: rgba(255, 255, 255, 0.85);
            background-color: transparent;
          }
        }
      }
    }
  }
  .head-right-user {
    float: right;
    max-width: 240px;
    img {
      width: 30px;
      height: 30px;
      margin-top: 21px;
    }
    .el-dropdown {
      vertical-align: top;
      &.el-dropdown {
        cursor: pointer;
        .el-dropdown-link {
          display: inline-block;
          height: 72px;
          line-height: 72px;
          b {
            display: inline-block;
            vertical-align: top;
            max-width: 160px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: normal;
            color: #fff;
            font-size: 14px;
            margin-left: 6px;
          }
          i {
            display: inline-block;
            vertical-align: top;
            margin-top: 28px;
            color: #fff;
          }
        }
      }
    }
  }
}

.dropdown-menu-list {
  &.el-dropdown-menu {
    padding: 0;
    background-color: #242e47;
    border: 1px solid #242e47;
    .el-dropdown-menu__item {
      height: 42px;
      line-height: 42px;
      background-color: #242e47;
      color: rgba(255, 255, 255, 0.85);
      &:focus {
        background-color: #242e47;
        color: rgba(255, 255, 255, 0.85);
      }
      &:not(.is-disabled) {
        &:hover {
          background-color: #242e47;
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }
    &.el-popper[x-placement^='bottom'] {
      .popper__arrow {
        border-bottom-color: #242e47;
        &::after {
          border-bottom-color: #242e47;
        }
      }
    }
  }
}
</style>


