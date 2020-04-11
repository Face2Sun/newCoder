<template>
  <header class="page-header">
    <div class="header-left fl">
      <img src alt />
      <span>⾃然资源和规划局资讯中⼼</span>
    </div>
    <div class="header-right fr">
      <span>{{ year }}年{{ month }}月{{ date }}日 {{day}}</span>
      <a href>hwm</a>
      <span>你好！</span>
      <span class="divider">|</span>
      <a href>注销</a>
    </div>
  </header>
</template>
<script>
export default {
  data () {
    return {
      year: '',
      month: '',
      date: '',
      day: ''
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      var weekend = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      var getDate = new Date()
      this.year = getDate.getFullYear()
      this.month = getDate.getMonth() + 1
      this.date = getDate.getDate()
      this.day = weekend[getDate.getDay()]
    }
  }
}
</script>
<style scoped>
.page-header {
  width: 100%;
  height: 50px;
}
.header-left {
}
.header-left span {
  font-size: 24px;
}
.header-right {
}
.header-right span,
a {
  padding-left: 10px;
}
.header-right .divider {
  color: #000;
}
</style>
