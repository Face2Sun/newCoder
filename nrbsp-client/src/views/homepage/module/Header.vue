<template>
  <div class="page-header">
    <div><img :src="this.gdt" alt=""></div>
    <table style="{cellpadding: 10px;margin: 0px auto;}">
      <tr>
        <td>发布时间:{{ this.fbtime }}</td>
        <td>发布人:{{ this.fbr }}</td>
        <td>发布单位:{{ this.fbbm }}</td>
        <td>阅读量:{{ this.ydl }}人次</td>
      </tr>
    </table>
    <div class="title-style">
      <a :href="downloadURL">{{ this.bt }}</a>
      <hr>
    </div>
    <div><pre>{{ this.nr }}</pre></div>
  </div>
</template>

<script>
import { findById } from '@/api/newsManage'
export default {
  name: 'PageHeader',
  data () {
    return {
      fbr: '',
      fbtime: '',
      fbbm: '',
      ydl: '',
      bt: '',
      nr: '',
      gdt: '',
      downloadURL: ''
    }
  },
  created () {
    this.searchQuery()
  },
  methods: {
    searchQuery (queryParam) {
    // loadData (queryParam) {
      findById(queryParam).then(res => {
        if (res.success) {
          console.log(res)
          // 发布人、发布时间、发布单位、阅读量、内容、滚动图
          this.fbr = res.data.fbr
          this.fbtime = res.data.createdTime
          this.fbbm = res.data.fbbm
          this.ydl = res.data.ydl
          this.bt = res.data.bt
          this.nr = res.data.nr
          this.gdt = res.data.gdt
          // 点击下载附件链接
          this.downloadURL = res.data.djztzjxzfj
        } else {
          this.$message.error('数据获取失败')
        }
      })
    // }
    },
    fatherMethod (queryParam) {
      this.values = []
      this.searchQuery(queryParam)
    }
  }
}
</script>

<style lang="less" scoped>
.page-header {
    text-align: center;
    margin: 0 auto;
}
.title-style {
      font-size: 25px;
      font-family: "微软雅黑";
      line-height: 1.5;
      font-weight: bold
  }
a {
  color:red;
}
a:hover {
  color: red;
}
a:active {
  color: black;
}
</style>
