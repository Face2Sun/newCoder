<template>
  <div>
    <div class="center">
      <page-header></page-header>
    </div>
    <header-image></header-image>
    <div class="center">
      <nav-list></nav-list>
      <div class="news">
        <news-carousel class="news-left fl"></news-carousel>
        <news-tabs class="news-right fr"></news-tabs>
      </div>
      <date-notification ref="tonggao" class="tonggao"></date-notification>
      <date-notification ref="huiyi" class="huiyi"></date-notification>
      <img src="@/static/images/cebian.png" alt class="cebiantu fr" />
    </div>
  </div>
</template>
<script>
import PageHeader from './module/PageHeader'
import HeaderImage from './module/HeaderImage'
import NavList from './module/NavList'
import NewsCarousel from './module/NewsCarousel'
import NewsTabs from './module/NewsTabs'
import DateNotification from './module/DateNotification'
export default {
  components: {
    PageHeader,
    NavList,
    NewsCarousel,
    DateNotification,
    NewsTabs,
    HeaderImage
  },
  data () {
    return {
    }
  },
  mounted () {
    this.loadNotification()
  },
  methods: {
    loadNotification () {
      this.$refs.tonggao.loadData('通知公告')
      this.$refs.huiyi.loadData('会议纪要')
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
.news {
  height: 315px;
  margin-bottom: 10px;
}
.news-left {
  width: 39%;
}
.news-right {
  width: 60%;
  padding: 0 20px;
  height: 315px;
  border: 1px solid #ccc;
}
.tonggao {
  display: inline-block;
  margin-right: 40px;
}
.huiyi {
  display: inline-block;
}
.cebiantu {
  width: 275px;
}
</style>
