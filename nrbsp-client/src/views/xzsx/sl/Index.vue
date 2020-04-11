<template>
  <div>
    <a-card title="行政事项分类">
      <a-card-grid v-for="item in this.xzsxFlShow" :key="item.id" @click="changeListData(item)" style="width:20%;textAlign:'center'">{{ item.name }}（{{ item.children.length }}）</a-card-grid>
      <a-card-grid v-if="this.xzsxFl.length>this.defaultShowNumber" @click="toggleFl" style="width:20%;textAlign:'center';color: blue;cursor: pointer;">{{ this.xzsxFlShow.length === this.defaultShowNumber ? "展开更多":"收起" }}</a-card-grid>
    </a-card>
    <xzsx-sl-list :listData="listData"></xzsx-sl-list>
  </div>
</template>

<script>
import { getXzsxFl } from '@/api/xzsx/sl'
import XzsxSlList from './List'

export default {
  name: 'XzsxSlIndex',
  components: {
    XzsxSlList
  },
  data () {
    return {
      defaultShowNumber: 9,
      xzsxFlShow: [
      ],
      xzsxFl: [
      ],
      listData: []
    }
  },
  mounted () {
    getXzsxFl().then(res => {
      this.xzsxFlShow = res.result.slice(0, this.defaultShowNumber)
      this.xzsxFl = res.result
    })
  },
  methods: {
    toggleFl () {
      if (this.xzsxFl.length > this.defaultShowNumber && this.xzsxFlShow.length === this.defaultShowNumber) {
        this.xzsxFlShow = this.xzsxFl
      } else {
        this.xzsxFlShow = this.xzsxFl.slice(0, this.defaultShowNumber)
      }
    },
    changeListData (item) {
      this.listData = item.children
    }
  }
}
</script>

<style lang="less" scoped>
</style>
