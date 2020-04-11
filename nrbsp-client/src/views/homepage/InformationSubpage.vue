<template>
  <div>
    <div class="center">
      <page-header></page-header>
    </div>
    <header-image></header-image>
    <div class="center clearfix">
      <nav-list></nav-list>
      <aside class="left-nav fl">
        <div class="nav-title">
          <a>{{ param.flmc }}</a>
        </div>
        <ul>
          <li v-for="(nav,index) in navDatas.slice(1)" :key="index" class="curCatetory">
            <router-link :to="{path: 'information-subpage', query: {database: nav}}">
              <span></span>
              {{ nav.flmc }}
            </router-link>
          </li>
        </ul>
      </aside>
      <div class="contentLi">
        <div class="catetorytitle">{{ params.lmfl }}</div>
        <div class="group-buying">
          <li v-for="(news,index) in newsDatas" :key="index" class="clearfix">
            <div class="title-left">
              <div
                class="date-up"
                v-if="news.updatedTime != null"
              >{{ news.updatedTime.split("-")[2].split("T")[0] }}</div>
              <div
                class="date-down"
                v-if="news.updatedTime != null"
              >{{ news.updatedTime.split("-")[0] + "/" + news.updatedTime.split("-")[1] }}</div>
            </div>
            <router-link
              class="title-right fl"
              :to="{path: 'details-subpage', query: {database: news}}"
            >{{ news.bt }}</router-link>
          </li>
        </div>
        <a-pagination
          @change="onChange"
          size="small"
          class="fr"
          :total="total"
          :showTotal="total => `共 ${total} 条数据`"
        />
      </div>
      <img src="@/static/images/cebian.png" alt class="cebiantu fr" />
    </div>
  </div>
</template>
<script>
import { Pagination } from 'ant-design-vue'
import PageHeader from './module/PageHeader'
import HeaderImage from './module/HeaderImage'
import NavList from './module/NavList'
import { findInformation } from '@/api/newsManage'
import { findAll, findById } from '@/api/programa'
export default {
  components: {
    PageHeader,
    NavList,
    APagination: Pagination,
    HeaderImage
  },
  data () {
    return {
      navData: {
        flmc: '要闻播放',
        id: '8e79e064fde5403d928a88862877c5ae',
        parentid: 'c218ee8611c14335bf4eee2e6b196cc2'
      },
      navDatas: [],
      newsDatas: [],
      total: 0,
      params: {
        lmfl: '要闻播放',
        pageNo: 1,
        pageSize: 10
      },
      param: {
        flmc: '国土动态'
      }
    }
  },
  created () {
    this.loadData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'loadData'
  },
  methods: {
    loadData () {
      console.log('this.$route.query.database')
      console.log(this.$route.query.database)
      if (this.$route.query.database) {
        this.navData = this.$route.query.database
        this.params.lmfl = this.navData.flmc
      }
      findInformation(this.params).then(res => {
        if (res.success) {
          this.newsDatas = res.data.list
          this.total = parseInt(res.data.total)
        } else {
          this.$message.error('数据获取失败')
        }
      })
      if (this.navData.parentid) {
        findById(this.navData.parentid).then(res => {
          if (res.success) {
            console.log('findById::::')
            console.log(res)
            this.param.flmc = res.data.flmc
            console.log('param')
            console.log(this.param)
            findAll(this.param).then(res => {
              if (res.success) {
                console.log('findAll::::')
                console.log(res)
                this.navDatas = res.data.list
              } else {
                this.$message.error('数据获取失败')
              }
            })
          } else {
            this.$message.error('数据获取失败')
          }
        })
      } else {
        this.param.flmc = this.navData.flmc
        this.navDatas = []
      }
    },
    onChange (page, pageSize) {
      this.params.pageNo = page
      this.params.pageSize = pageSize
      findInformation(this.params).then(res => {
        if (res.success) {
          this.newsDatas = res.data.list
          this.total = parseInt(res.data.total)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    }
  }
}
</script>
<style>
/*公共样式*/
/*浮动与清除浮动*/
.clearfix:after {
  content: "";
  display: block;
  clear: both;
  height: 0;
  line-height: 0;
  visibility: hidden;
}
.clearfix {
  zoom: 1;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
ul,
li {
  list-style-type: none;
  padding: 0;
}
.ant-carousel .slick-dots {
  width: 98%;
  text-align: right;
}
.ant-tabs-nav .ant-tabs-tab {
  margin: 0;
}
/*页面样式*/
.center {
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  padding: 10px;
}
.left-nav {
  width: 280px;
}
.left-nav .nav-title {
  width: 280px;
  line-height: 80px;
  background: rgb(93, 203, 159);
  text-align: center;
}
.left-nav .nav-title a {
  font-size: 20px;
  color: rgb(243, 220, 149);
}
.left-nav ul li {
  text-align: center;
  height: 48px;
  line-height: 48px;
  border-bottom: 1px dotted #4b4b4b;
}
.left-nav ul li span {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: rgb(93, 203, 159);
}
.left-nav ul li a {
  display: inline-block;
  width: 250px;
  height: 48px;
  line-height: 48px;
  color: black;
}
.left-nav ul li:hover {
  background: rgb(93, 203, 159);
  color: white;
  cursor: pointer;
}
.left-nav ul li.active {
  padding-left: 0;
  border-bottom: none;
  background: #930400;
}
.left-nav ul li.active a {
  color: black;
}
.left-nav ul li.active span {
  display: block;
  width: 10px;
  height: 10px;
  background: rgb(93, 203, 159);
}
.contentLi {
  width: 45%;
  margin-left: 20px;
  float: left;
}
.contentLi .catetorytitle {
  height: 70px;
  line-height: 80px;
  font-size: 18px;
  border-bottom: 2px solid rgb(93, 203, 159);
}
.contentLi .group-buying {
}
.contentLi .group-buying ul {
}
.contentLi .group-buying ul li {
  height: 70px;
}
.group-buying li .title-left {
  float: left;
  width: 60px;
  height: 60px;
  margin: 10px;
  text-align: center;
}
.title-left .date-up {
  font-size: 24px;
}
.title-left .date-down {
}
.group-buying li .title-right {
  float: left;
  display: block;
  padding: 30px 0 0 20px;
  height: 70px;
  color: black;
  font-size: 16px;
}
.group-buying li .title-right:hover {
  color: rgb(82, 196, 26);
}
</style>
