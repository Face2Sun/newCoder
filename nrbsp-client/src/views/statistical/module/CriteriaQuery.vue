<template>
  <div class="clearfix">
    <a-form layout="inline" class="chaxun-form">
      <a-form-item label="选择年份">
        <a-date-picker
          placeholder="输入年份"
          format="YYYY"
          mode="year"
          :value="value"
          :open="isopen"
          @openChange="handleOpenChange1"
          @panelChange="handlePanelChange1"
          @change="handleChange"
        />
      </a-form-item>
      <a-form-item label="区域">
        <a-select
          mode="multiple"
          placeholder="选择区域"
          :value="selectedItems"
          @change="handleChanges"
          @focus="focusChanges"
          class="select"
        >
          <a-select-option v-for="item in selectedData" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" @click="searchQuery" icon="search">统计</a-button>
    </a-form>
  </div>
</template>

<script>
import { findProjectQy } from '@/api/projects'
import moment from 'moment'
export default {
  data () {
    return {
      value: null,
      isopen: false,
      queryParam: {
        qys: null,
        date: null
      },
      selectedItems: [],
      selectedData: []
    }
  },
  methods: {
    handleChange () {
      this.value = null
    },
    handleOpenChange1 () {
      if (this.isopen) {
        this.isopen = false
      } else {
        this.isopen = true
      }
    },
    handlePanelChange1 (value) {
      this.value = value
      this.isopen = false
    },
    handleChanges (selectedItems) {
      this.selectedItems = selectedItems
      this.queryParam.qys = []
      this.queryParam.qys = selectedItems
    },
    focusChanges () {
      findProjectQy().then(res => {
        if (res.success) {
          var list = []
          for (let i = 0; i < res.data.length; i++) {
            list.push(res.data[i].qy)
          }
          const OPTIONS = list
          this.selectedData = OPTIONS.filter(o => !this.selectedItems.includes(o))
        }
      })
    },
    searchQuery () {
      if (!this.value) {
        this.queryParam.date = moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
      } else {
        this.queryParam.date = this.value
      }
      if (this.queryParam.date) {
        this.queryParam.date = this.queryParam.date.format('YYYY-MM-DD')
      }
      this.$emit('fatherMethod', this.queryParam)
    }
  }
}
</script>

<style lang="less" scoped>
.chaxun-form {
  margin: 0 50px 30px 0;
  float: right;
}
.chaxun-form .date {
  width: 150px;
}
.chaxun-form .select {
  width: 330px;
}
.chaxun-form button {
  margin-top: 4px;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
