<template>
  <div class="read-file-container"
       v-loading="isLoading">
    <div class="read-file-content">
      <Tabs :value="tabActiveName"
            @on-click="tabHandleClick">
        <TabPane label="源文件预览"
                 name="first">
          <vm-search @search="resourceFileSearchData"
                     :searchPlaceholder="'请输入关键字搜索'"></vm-search>
          <Table class="compare-file-table"
                 :columns="resourceFileTableColumns"
                 :data="resourceFileTableData"
                 :height="tableHight"
                 stripe>
          </Table>
          <div class="table-pagination-container clearfloat"
               v-show="resourceFileTableTotal !== 0">
            <div class="table-pagination-text">共{{resourceFileTableTotal}}条数据</div>
            <Page class="table-pagination-content"
                  :total="resourceFileTableTotal"
                  :current="resourceFileTableCur"
                  :page-size="resourceFileTableLimit"
                  show-sizer
                  :page-size-opts="[10, 20, 50]"
                  placement="top"
                  @on-change="resourceFilePageChange"
                  @on-page-size-change="resourceFileSizeChange"></Page>
          </div>

        </TabPane>
        <TabPane label="对比文件预览"
                 name="second">
          <vm-search @search="compareFileSearchData"
                     :searchPlaceholder="'请输入关键字搜索'"></vm-search>
          <Table class="compare-file-table"
                 :columns="compareFileTableColumns"
                 :data="compareFileTableData"
                 :height="tableHight"
                 stripe>
          </Table>
          <div class="table-pagination-container clearfloat"
               v-show="compareFileTableTotal !== 0">
            <div class="table-pagination-text">共{{compareFileTableTotal}}条数据</div>
            <Page class="table-pagination-content"
                  :total="compareFileTableTotal"
                  :current="compareFileTableCur"
                  :page-size="compareFileTableLimit"
                  show-sizer
                  :page-size-opts="[10, 20, 50]"
                  placement="top"
                  @on-change="compareFilePageChange"
                  @on-page-size-change="compareFileSizeChange"></Page>
          </div>
        </TabPane>
      </Tabs>
      <div class="read-file-btn compare-btn-container">
        <span class="pre-step-btn"
              @click="goToPreStep">上一步</span>
        <span class="next-step-btn"
              @click="toCompareFile">下一步</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import VmSearch from '../components/VmSearch.vue'
import { getExcelFoldData, getWordFileData, toCompareFile } from '../request/compare_request'

@Component({
  components: { VmSearch },
  props: {
    currentStep: Number
  }
})
export default class extends Vue {
  tabActiveName: String = 'first'
  // 源文件表格相关数据定义
  resourceFileTableCur: Number = 1
  resourceFileTableTotal: Number = 0
  resourceFileTableLimit: Number = 10
  resourceFileTableData: Array<any> = []
  resourceFileTableColumns: Array<any> = []

  // 对比文件表格相关数据定义
  compareFileTableCur: Number = 1
  compareFileTableTotal: Number = 0
  compareFileTableLimit: Number = 10
  compareFileTableData: Array<any> = []
  compareFileTableColumns: Array<any> = []
  tableHight: Number = 0 // 表格高度固定表头
  // resourceScrollbarHaveFlag: Boolean = false // 源文件表格滚动条是否有滚动条标志量
  // compareScrollbarHaveFlag: Boolean = false // 对比文件表格滚动条是否有滚动条标志量

  resourceKeyValue: String = '' // 源文件表格搜索框关键字
  compareKeyValue: String = '' // 对比文件表格表格搜索框关键字
  isLoading: Boolean = false

  created() {}

  mounted() {
    this.$nextTick(() => {
      // 获取屏幕高度  复制表格高度
      if (document.documentElement.clientWidth === 1920) {
        this.tableHight = 530
      } else if (document.documentElement.clientWidth === 1600) {
        this.tableHight = 377
      } else if (document.documentElement.clientWidth <= 1440) {
        this.tableHight = 367
      }
      if (this.tabActiveName === 'first' && this.$props.currentStep === 1) {
        this.toGetExcelData(
          {
            page: this.resourceFileTableCur,
            limit: this.resourceFileTableLimit
          },
          {
            keyValue: this.resourceKeyValue
          }
        )
      } else if (this.tabActiveName === 'second' && this.$props.currentStep === 1) {
        this.toGetWordData(
          {
            page: this.compareFileTableCur,
            limit: this.compareFileTableLimit
          },
          {
            keyValue: this.compareKeyValue
          }
        )
      }
    })
  }

  tabHandleClick(name) {
    this.tabActiveName = name
    if (this.tabActiveName === 'first' && this.$props.currentStep === 1) {
      this.toGetExcelData(
        {
          page: this.resourceFileTableCur,
          limit: this.resourceFileTableLimit
        },
        {
          keyValue: this.resourceKeyValue
        }
      )
    } else if (this.tabActiveName === 'second' && this.$props.currentStep === 1) {
      this.toGetWordData(
        {
          page: this.compareFileTableCur,
          limit: this.compareFileTableLimit
        },
        {
          keyValue: this.compareKeyValue
        }
      )
    }
  }

  // 源文件表格关键字搜索
  resourceFileSearchData(keyValue) {
    this.resourceKeyValue = keyValue
    this.resourceFileTableCur = 1
    this.toGetExcelData(
      {
        page: this.resourceFileTableCur,
        limit: this.resourceFileTableLimit
      },
      {
        keyValue: this.resourceKeyValue
      }
    )
  }

  // 对比文件表格关键字搜索
  compareFileSearchData(keyValue) {
    this.compareKeyValue = keyValue
    this.compareFileTableCur = 1
    this.toGetWordData(
      {
        page: this.compareFileTableCur,
        limit: this.compareFileTableLimit
      },
      {
        keyValue: this.compareKeyValue
      }
    )
  }

  // 源文件表格查询数据
  toGetExcelData(urlParams, params) {
    getExcelFoldData(urlParams, params)
      .then(res => {
        if (res.data.status === '200') {
          this.resourceFileTableColumns.length = 0
          this.resourceFileTableData.length = 0
          if (
            res.data.data &&
            res.data.data.data &&
            res.data.data.data.head &&
            res.data.data.data.head[0] &&
            res.data.data.data.head[0].length > 0
          ) {
            let tempHeadDataArray = res.data.data.data.head[0]
            for (let i = 0; i < tempHeadDataArray.length; i++) {
              this.resourceFileTableColumns.push({
                title: tempHeadDataArray[i],
                key: i,
                render: this.tableRender
              })
            }
          }
          if (res.data.data && res.data.data.data && res.data.data.data.data && res.data.data.data.data.length > 0) {
            let tempTableDataArr = res.data.data.data.data
            tempTableDataArr.forEach(tempTableData => {
              const row = {}
              tempTableData.forEach((value, index) => {
                row[index] = value
              })
              this.resourceFileTableData.push(row)
            })
          }
          if (res.data.data && res.data.data.count && res.data.data.count > 0) {
            this.resourceFileTableTotal = res.data.data.count
          } else {
            this.resourceFileTableTotal = 0
          }
        }
      })
      .catch(() => {})
  }

  // 表格自定义渲染列   文字超过长度显示title
  tableRender(h, params) {
    return h('div', [
      h(
        'span',
        {
          style: {
            display: 'inline-block',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          },
          domProps: {
            title: params.row[params.column.key]
          }
        },
        params.row[params.column.key]
      )
    ])
  }

  // 对比word表格查询数据
  toGetWordData(urlParams, params) {
    getWordFileData(urlParams, params)
      .then(res => {
        if (res.data.status === '200') {
          this.compareFileTableColumns.length = 0
          this.compareFileTableData.length = 0
          if (
            res.data.data &&
            res.data.data.data &&
            res.data.data.data.head &&
            res.data.data.data.head[0] &&
            res.data.data.data.head[0].length > 0
          ) {
            let tempHeadDataArray = res.data.data.data.head[0]
            for (let i = 0; i < tempHeadDataArray.length; i++) {
              this.compareFileTableColumns.push({
                title: tempHeadDataArray[i],
                key: i,
                render: this.tableRender
              })
            }
          }
          if (res.data.data && res.data.data.data && res.data.data.data.data && res.data.data.data.data.length > 0) {
            let tempTableDataArr = res.data.data.data.data
            tempTableDataArr.forEach(tempTableData => {
              const row = {}
              tempTableData.forEach((value, index) => {
                row[index] = value
              })
              this.compareFileTableData.push(row)
            })
          }
          if (res.data.data && res.data.data.count && res.data.data.count > 0) {
            this.compareFileTableTotal = res.data.data.count
          } else {
            this.compareFileTableTotal = 0
          }
        }
      })
      .catch(() => {})
  }

  resourceFilePageChange(currentPage) {
    this.resourceFileTableCur = currentPage
    this.toGetExcelData(
      {
        page: this.resourceFileTableCur,
        limit: this.resourceFileTableLimit
      },
      {
        keyValue: this.resourceKeyValue
      }
    )
  }

  resourceFileSizeChange(limit) {
    this.resourceFileTableLimit = limit
    this.resourceFileTableCur = 1
    this.toGetExcelData(
      {
        page: this.resourceFileTableCur,
        limit: this.resourceFileTableLimit
      },
      {
        keyValue: this.resourceKeyValue
      }
    )
  }

  compareFilePageChange(currentPage) {
    this.compareFileTableCur = currentPage
    this.toGetWordData(
      {
        page: this.compareFileTableCur,
        limit: this.compareFileTableLimit
      },
      {
        keyValue: this.compareKeyValue
      }
    )
  }

  compareFileSizeChange(limit) {
    this.compareFileTableLimit = limit
    this.compareFileTableCur = 1
    this.toGetWordData(
      {
        page: this.compareFileTableCur,
        limit: this.compareFileTableLimit
      },
      {
        keyValue: this.compareKeyValue
      }
    )
  }

  // 点击下一步进行文件对比
  toCompareFile() {
    this.isLoading = true
    toCompareFile()
      .then(res => {
        if (res.data.status === '200') {
          this.isLoading = false
          this.goToNextStep()
        }
      })
      .catch(() => {
        this.isLoading = false
      })
  }

  // 上一步点击
  goToPreStep() {
    this.$emit('toPre')
  }

  // 下一步点击
  goToNextStep() {
    this.$emit('toNext')
  }
}
</script>

<style lang="scss">
.read-file-container {
  width: 100%;
  height: calc(100vh - 72px);
  padding: 24px;
  background-color: #141c33;
  .read-file-content {
    width: 100%;
    height: calc(100vh - 200px);
    background-color: #343f5b;
    box-sizing: border-box;
    .ivu-tabs {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .ivu-tabs-bar {
        padding-left: 24px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(0, 0, 0, 0.35);
        border-bottom-style: solid;
        margin-bottom: 20px;
        .ivu-tabs-nav-container {
          .ivu-tabs-nav-wrap {
            .ivu-tabs-nav-scroll {
              .ivu-tabs-nav {
                .ivu-tabs-ink-bar {
                  background-color: #1985ea;
                }
                .ivu-tabs-tab {
                  padding: 0 16px;
                  height: 48px;
                  line-height: 48px;
                  color: #fff;
                  &.ivu-tabs-tab-active {
                    color: #1985ea;
                  }
                }
              }
            }
          }
        }
      }
      .ivu-tabs-content {
        .ivu-tabs-tabpane {
          padding: 0 24px;
          box-sizing: border-box;
          .el-scrollbar {
            height: calc(100vh - 394px);
            overflow: hidden;
            .el-scrollbar__wrap {
              height: 100%;
              overflow-x: hidden;
              overflow-y: auto;
            }
          }
        }
      }
    }
    .read-file-btn {
      width: 100%;
      text-align: center;
      margin-top: 24px;
    }
  }
}
</style>


