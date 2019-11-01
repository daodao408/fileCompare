<template>
  <div class="compare-file-result-container"
       v-loading="isLoading">
    <div class="compare-file-result-content-div">
      <div class="compare-file-result-title">文件对比结果展示</div>
      <div class="compare-file-result-info"
           v-html="compareFileResultText"></div>
      <div class="compare-file-result-content">
        <Table class="compare-file-table"
               :columns="compareFileResultTableColumns"
               :data="compareFileResultTableData"
               :height="tableHight"
               stripe>
        </Table>
        <div class="table-pagination-container clearfloat"
             v-show="compareFileResultTableTotal !== 0">
          <div class="table-pagination-text">共{{compareFileResultTableTotal}}条数据</div>
          <Page class="table-pagination-content"
                :total="compareFileResultTableTotal"
                :current="compareFileResultTableCur"
                :page-size="compareFileResultTableLimit"
                show-sizer
                :page-size-opts="[10, 20, 50]"
                placement="top"
                @on-change="compareFileResultPageChange"
                @on-page-size-change="compareFileResultSizeChange"></Page>
        </div>
      </div>
    </div>

    <div class="compare-file-result-btn compare-btn-container">
      <span class="pre-step-btn"
            @click="goToPreStep">上一步</span>
      <span class="next-step-btn"
            :class="[compareFileResultTableTotal === 0 ? 'step-btn-disable': '']"
            ref="exportRef"
            @click="goToExport">导出结果</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getCompareFileResultData } from '../request/compare_request'

@Component({
  components: {},
  props: {}
})
export default class extends Vue {
  // 对比结果表格相关数据定义
  compareFileResultTableCur: Number = 1
  compareFileResultTableTotal: Number = 0
  compareFileResultTableLimit: Number = 10
  compareFileResultTableData: Array<any> = []
  compareFileResultTableColumns: Array<any> = []
  compareFileResultText: String = ''
  compareFileResultScrollbarHaveFlag: Boolean = false // 对比结果表格滚动条是否有滚动条标志量
  tableHight: Number = 0 // 表格高度固定表头

  isLoading: Boolean = false

  created() {}

  mounted() {
    this.$nextTick(() => {
      // 获取屏幕高度  复制表格高度
      if (document.documentElement.clientWidth === 1920) {
        this.tableHight = 530
      } else if (document.documentElement.clientWidth === 1600) {
        this.tableHight = 397
      } else if (document.documentElement.clientWidth <= 1440) {
        this.tableHight = 387
      }
      this.toGetCompareFileResultData({
        page: this.compareFileResultTableCur,
        limit: this.compareFileResultTableLimit
      })
    })
  }

  // 对比结果表格查询数据
  toGetCompareFileResultData(urlParams) {
    // this.loading = true
    getCompareFileResultData(urlParams)
      .then(res => {
        if (res.data.status === '200') {
          // this.loading = false
          this.compareFileResultTableColumns.length = 0
          this.compareFileResultTableData.length = 0
          if (
            res.data.data &&
            res.data.data.data &&
            res.data.data.data.head &&
            res.data.data.data.head[0] &&
            res.data.data.data.head[0].length > 0
          ) {
            let tempHeadDataArray = res.data.data.data.head[0]
            for (let i = 0; i < tempHeadDataArray.length; i++) {
              this.compareFileResultTableColumns.push({
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
              this.compareFileResultTableData.push(row)
            })
          }
          if (res.data.data && res.data.data.count && res.data.data.count > 0) {
            this.compareFileResultTableTotal = res.data.data.count
          } else {
            this.compareFileResultTableTotal = 0
          }
          this.compareFileResultText = res.data.data.data.compare
        }
      })
      .catch(() => {
        // this.isLoading = false
      })
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

  compareFileResultPageChange(currentPage) {
    this.compareFileResultTableCur = currentPage
    this.toGetCompareFileResultData({
      page: this.compareFileResultTableCur,
      limit: this.compareFileResultTableLimit
    })
  }

  compareFileResultSizeChange(limit) {
    this.compareFileResultTableLimit = limit
    this.compareFileResultTableCur = 1
    this.toGetCompareFileResultData({
      page: this.compareFileResultTableCur,
      limit: this.compareFileResultTableLimit
    })
  }

  // 上一步点击
  goToPreStep() {
    this.$emit('toPre')
  }

  // 导出结果
  goToExport() {
    if (this.compareFileResultTableTotal === 0) {
      return false
    } else {
      window.location.pathname = '/api/load/download'
    }
  }
}
</script>

<style lang="scss">
@media screen and (min-width: 1440px) {
  .compare-file-result-container {
    .compare-file-result-content-div {
      height: calc(100vh - 190px);
      overflow-y: auto;
      background-color: #343f5b;
      .compare-file-result-content {
        height: calc(100vh - 288px);
      }
    }
  }
}
@media screen and (min-width: 1600px) {
  .compare-file-result-container {
    .compare-file-result-content-div {
      height: calc(100vh - 190px);
      overflow-y: auto;
      background-color: #343f5b;
      .compare-file-result-content {
        height: calc(100vh - 288px);
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .compare-file-result-container {
    .compare-file-result-content-div {
      height: calc(100vh - 200px);
      overflow-y: auto;
      background-color: #343f5b;
      .compare-file-result-content {
        height: calc(100vh - 318px);
      }
    }
  }
}
.compare-file-result-container {
  width: 100%;
  height: calc(100vh - 72px);
  padding: 24px;
  background-color: #141c33;

  .compare-file-result-title {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #343f5b;
    font-size: 14px;
    text-indent: 24px;
    color: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid rgba(0, 0, 0, 0.35);
  }
  .compare-file-result-info {
    width: 100%;
    padding: 20px 24px;
    background-color: #343f5b;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    span {
      color: #29ea92;
    }
  }
  .compare-file-result-content {
    width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    background-color: #343f5b;
    box-sizing: border-box;
    // overflow-y: auto;
  }

  .compare-file-result-btn {
    width: 100%;
    text-align: center;
    margin-top: 24px;
  }
}
</style>


