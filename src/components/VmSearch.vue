<template>
  <el-input :placeholder="searchPlaceholder"
            v-model="keyValue"
            :maxlength="40"
            @keyup.enter.native="doEnterSearch"
            @keyup.8.native="backspaceSearch"
            auto-complete="off"
            class="cd-search"
            size="small">
    <!-- <i slot="suffix" class="el-input__icon el-icon-search" @click="doSearch()"></i> -->
    <template slot="append">
      <i class="el-input__icon el-icon-search"
         @click="doSearch()"></i>
    </template>
  </el-input>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    searchPlaceholder: String
  }
})
export default class extends Vue {
  keyValue: string = ''

  created() {}

  mounted() {}

  doSearch() {
    this.$emit('search', this.keyValue)
  }
  doEnterSearch(e) {
    this.$emit('search', this.keyValue)
  }
  backspaceSearch() {
    this.$emit('search', this.keyValue)
  }
}
</script>

<style lang="scss">
.cd-search {
  margin-bottom: 20px;
  &.el-input-group--append {
    .el-input__inner {
      width: 300px;
      border-radius: 0;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      background-color: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.55);
      border-width: 0px;
      box-sizing: border-box;
      &:focus {
        border-color: #1890ff;
      }
    }
  }
  &.el-input {
    width: auto;
    .el-input-group__append {
      padding: 0;
      width: 40px;
      height: 40px;
      text-align: center;
      background-color: #1985ea;
      border-radius: 0;
      border: none;
      cursor: pointer;
      i {
        &.el-icon-search {
          color: rgba(255, 255, 255, 0.85);
          font-size: 18px;
        }
      }
    }
  }
  &:hover {
    .el-input__inner {
      border: 1px solid #42a0f8;
    }
    .el-input__icon {
      color: #42a0f8;
    }
  }
  .el-input__icon {
    cursor: pointer;
    &:hover {
      color: #42a0f8;
    }
  }
}
</style>


