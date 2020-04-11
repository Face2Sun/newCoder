<template>
  <a-tabs class="news-list" @change="callback">
    <a-tab-pane tab="要闻播放" key="要闻播放">
      <li v-for="(news,index) in newsDatas" :key="index" class="clearfix">
        <router-link
          class="fl"
          :to="{path: 'details-subpage', query: {database: news}}"
        >{{ news.bt }}</router-link>
        <span class="list-time" v-if="news.updatedTime != null">{{ news.updatedTime | time }}</span>
      </li>
    </a-tab-pane>
    <a-tab-pane tab="工作动态" key="工作动态">
      <li v-for="(news,index) in newsDatas" :key="index" class="clearfix">
        <router-link
          class="fl"
          :to="{path: 'details-subpage', query: {database: news}}"
        >{{ news.bt }}</router-link>
        <span class="list-time" v-if="news.updatedTime != null">{{ news.updatedTime | time }}</span>
      </li>
    </a-tab-pane>
    <a-tab-pane tab="政策文件" key="政策文件">
      <li v-for="(news,index) in newsDatas" :key="index" class="clearfix">
        <router-link
          class="fl"
          :to="{path: 'details-subpage', query: {database: news}}"
        >{{ news.bt }}</router-link>
        <span class="list-time" v-if="news.updatedTime != null">{{ news.updatedTime | time }}</span>
      </li>
    </a-tab-pane>
    <a-tab-pane tab="国土文化" key="国土文化">
      <li v-for="(news,index) in newsDatas" :key="index" class="clearfix">
        <router-link
          class="fl"
          :to="{path: 'details-subpage', query: {database: news}}"
        >{{ news.bt }}</router-link>
        <span class="list-time" v-if="news.updatedTime != null">{{ news.updatedTime | time }}</span>
      </li>
    </a-tab-pane>
    <a-tab-pane tab="廉政政策法规" key="廉政政策法规">
      <li v-for="(news,index) in newsDatas" :key="index" class="clearfix">
        <router-link
          class="fl"
          :to="{path: 'details-subpage', query: {database: news}}"
        >{{ news.bt }}</router-link>
        <span class="list-time" v-if="news.updatedTime != null">{{ news.updatedTime | time }}</span>
      </li>
    </a-tab-pane>
    <a-button slot="tabBarExtraContent">More</a-button>
  </a-tabs>
</template>
<script>
import { findInformation } from '@/api/newsManage'
export default {
  data: function () {
    return {
      newsDatas: [],
      params: {
        lmfl: '要闻播放',
        pageNo: 1,
        pageSize: 7
      }
    }
  },
  // 处理时间字符串的过滤器
  filters: {
    time: (value) => {
      if (!value) return ''
      return value.split('T')[0]
    }
  },
  created () {
    this.loadData(this.params)
  },
  mounted () {
  },
  methods: {
    loadData (params) {
      findInformation(params).then(res => {
        if (res.success) {
          this.newsDatas = res.data.list
          console.log('this.newsDatas')
          console.log(this.newsDatas)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    callback (key) {
      this.params.lmfl = key
      this.loadData(this.params)
    }
  }
}
</script>
<style scoped>
.news-list li {
  line-height: 35px;
  padding: 0 10px;
}
.news-list li a {
  width: 83%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
}
.news-list li a:hover {
  color: rgb(82, 196, 26);
}
.news-list .list-time{
  float: right;
  margin-right: 10px;
}
</style>
