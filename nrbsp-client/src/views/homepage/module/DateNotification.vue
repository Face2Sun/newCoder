<template>
  <div class="notification">
    <header>{{ params.lmfl }}</header>
    <div class="notification-module">
      <li v-for="(news,index) in newsDatas" :key="index" class="clearfix">
        <div class="notification-date fl">
          <div
            class="notification-date-up"
            v-if="news.updatedTime != null"
          >{{ news.updatedTime | time }}</div>
          <div
            class="notification-date-down"
            v-if="news.updatedTime != null"
          >{{ news.updatedTime.split("-")[0] + "/" + news.updatedTime.split("-")[1] }}</div>
        </div>
        <router-link
          class="notification-describe fl"
          :to="{path: 'details-subpage', query: {database: news}}"
        >{{ news.bt }}</router-link>
      </li>
    </div>
    <footer class="fr">
      <div id="components-pagination-demo-mini">
        <a-pagination
          @change="onChange"
          size="small"
          :total="total"
          :showTotal="total => `共 ${total} 条数据`"
        />
      </div>
    </footer>
  </div>
</template>
<script>
import { Pagination } from 'ant-design-vue'
import { findInformation } from '@/api/newsManage'

export default {
  components: { APagination: Pagination },
  data () {
    return {
      newsDatas: [],
      total: 0,
      params: {
        lmfl: '通知公告',
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  // 处理时间字符串的过滤器
  filters: {
    time: (value) => {
      if (!value) return ''
      return value.split('-')[2].split('T')[0]
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    loadData (parameter) {
      this.params.lmfl = parameter
      this.findInformations()
    },
    findInformations () {
      findInformation(this.params).then(res => {
        if (res.success) {
          this.newsDatas = res.data.list
          this.total = parseInt(res.data.total)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    onChange (page, pageSize) {
      this.params.pageNo = page
      this.findInformations()
    }
  }
}
</script>
<style scoped>
#components-pagination-demo-mini .ant-pagination:not(:last-child) {
  margin-bottom: 24px;
}
.notification {
  width: 400px;
  height: 800px;
  display: inline-block;
}
.notification header {
  font-size: 20px;
  margin: 20px 0 10px 20px;
}
.notification .notification-module li {
  line-height: 20px;
}
.notification .notification-module .notification-date {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin: 10px;
}
.notification .notification-module .notification-date .notification-date-up {
  font-size: 18px;
  text-align: center;
}
.notification .notification-module .notification-describe {
  display: block;
  padding: 20px 0 0 8px;
  width: 310px;
  height: 50px;
  color: black;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notification .notification-module .notification-describe:hover {
  color: rgb(82, 196, 26);
}
</style>
