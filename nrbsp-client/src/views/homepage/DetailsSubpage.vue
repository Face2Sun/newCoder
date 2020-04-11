<template>
  <div>
    <img class="imgSpace" src="../../static/images/bg-shouye.png" alt />
    <div class="title-style">
      <a :href="isDownload ? downloadURL : null">{{ bt }}</a>
      <hr size="5px" noshade="true" width="98%" />
    </div>
    <div>
      <a-row :gutter="14" type="flex" justify="center">
        <a-col>发布时间：{{ fbtime }}</a-col>
        <a-col>发布人：{{ fbr }}</a-col>
        <a-col>发布单位：{{ fbbm }}</a-col>
        <a-col>阅读量：{{ ydl }}</a-col>
      </a-row>
      <hr size="1px" width="98%" />
    </div>
    <!-- <div class="content-style" v-html="nr" ></div> -->
    <div class="content-box">
      <pre class="content-style" v-html="nr"></pre>
    </div>
  </div>
</template>

<script>
import ScheduleSubpage from './ScheduleSubpage'
import { findById } from '@/api/newsManage'
export default {
  components: {
    ScheduleSubpage
  },
  name: 'DetailsSubpage',
  data () {
    return {
      news: {},
      fbr: '',
      fbtime: '',
      fbbm: '',
      ydl: 0,
      bt: '',
      nr: '',
      gdt: '',
      downloadable: null,
      downloadURL: ''
    }
  },
  computed: {
    isDownload () {
      if (this.downloadable === 1) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      if (this.$route.query.database) {
        this.news = this.$route.query.database
        console.log('新闻详情:', this.news)
      }
      findById(this.news.id).then(res => {
        if (res.success) {
          // 发布人、发布时间、发布单位、阅读量、内容、滚动图
          this.fbr = res.data.fbr
          this.fbtime = res.data.createdTime
          this.fbtime = this.formatDate(this.fbtime)
          this.fbbm = res.data.fbbm
          this.ydl = res.data.ydl
          this.bt = res.data.bt
          this.downloadable = res.data.djbtzjxzfj
          this.nr = res.data.nr
          this.nr = this.showHtml(this.nr)
          console.log(this.nr)
          this.gdt = res.data.gdt
          // 点击下载附件链接
          this.downloadURL = res.data.fj
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    // 将富文本字符串转化成html标签
    showHtml (str) {
      return str
        .replace(str ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
    },
    // 格式化日期
    formatDate (timestamp) {
      var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '年'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
      const D = this.change(date.getDate()) + '日'
      const h = this.change(date.getHours()) + ':'
      const m = this.change(date.getMinutes()) + ':'
      const s = this.change(date.getSeconds())
      return Y + M + D + h + m + s
    },
    change (t) {
      if (t < 10) {
        return '0' + t
      } else {
        return t
      }
    }
  }
}
</script>

<style lang="less" scoped>
.imgSpace {
  display: block;
  width: 100%;
  height: 200px;
  padding-bottom: 20px;
}
.title-style {
  text-align: center;
  font-size: 32px;
  line-height: 1.1;
  font-weight: bold;
}
.content-box {
  width: 98%;
  margin:0 auto;
  padding: 14px;
}
a {
  color: red;
}
a:hover {
  color: red;
}
a:active {
  color: black;
}
</style>
<style>
/* 新闻内容富文本样式处理 */
.content-style {
  margin:0 auto;
  white-space:pre-wrap;
}
/* 处理图片样式 */
.content-style img {
  display:block !important;
	margin: 0 auto !important;
	width: 300px !important;
	height: 300px !important;
}
/* .content-style p {
  color: red !important
} */
</style>
