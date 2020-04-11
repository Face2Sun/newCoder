<template>
  <div class="wrapper">
    <div class="top">
      <div class="header">
        <div class="logo"><span>自然资源和规划一体化政务服务平台</span></div>
        <div class="date">{{ getToday() }}</div>
        <user-menu class="header-right"></user-menu>
      </div>
      <a-row align="middle" class="topBtnWrapper" :gutter="24">
        <a-col
          :span="3"
          v-for="item in topBtnData"
          :key="item.id"
        >
          <div class="topBtn" @click="openSystem(item)">{{ item.title }}</div>
        </a-col>
      </a-row>
    </div>
    <div class="body">
      <a-row class="news" :gutter="24">
        <a-col :span="10">
          <news-carousel></news-carousel>
        </a-col>
        <a-col :span="14">
          <news-tabs></news-tabs>
        </a-col>
      </a-row>
      <a-row class="calendar" :gutter="24">
        <a-col :span="10">
          <schedule-subpage></schedule-subpage>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import UserMenu from '@/components/tools/UserMenu'
import NewsCarousel from '@/views/homepage/module/NewsCarousel'
import NewsTabs from '@/views/homepage/module/NewsTabs'
import ScheduleSubpage from '@/views/homepage/ScheduleSubpage'

export default {
  name: 'Home',
  components: {
    UserMenu,
    NewsCarousel,
    NewsTabs,
    ScheduleSubpage
  },
  data () {
    return {
      topBtnData: [
        { id: '1', title: '行政事项受理', route: '/xzsx/sl/index' },
        { id: '2', title: '行政事项审批', route: '' },
        { id: '3', title: '业务管理', route: '' },
        { id: '4', title: '一张图', route: '' },
        { id: '5', title: '规划实施监督', route: '' },
        { id: '6', title: '空间基础平台', route: '' },
        { id: '7', title: '综合监管', route: '' },
        { id: '8', title: '运维监控', route: '' }
      ]
    }
  },
  methods: {
    getToday () {
      const today = new Date()
      const weekTranslate = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 0: '日' }
      return (today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日' + ' 星期' + weekTranslate[today.getDay()])
    },
    openSystem (item) {
      if (item.route) {
        this.$router.push(item.route)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .wrapper{
    width: 100%;
    height: 100%;
  }
  .top{
    position: relative;
    width: 100%;
    height: 500px;
    background-image: url('~@/assets/images/home/top_bak.png');
    background-position: center 70px;
    background-repeat: no-repeat;
    .header{
      height: 70px;
      width: 100%;
      background: linear-gradient(left, #FFFFFF, #B3D9FF);
      display: flex;
      .logo{
        flex: 1;
        background-image: url('~@/assets/images/home/logo.png');
        background-size: 100px 26px;
        background-position: 10px center;
        background-repeat: no-repeat;
        padding-left: 120px;
        line-height: 66px;
        font-size: 28px;
        color: #0870BE;
        span{
          display: inline-block;
          height: 40px;
          padding-left: 10px;
          line-height: 40px;
          border-left: 1px solid #70BBF3;
        }
      }
      .date{
        color: #0870BE;
        font-size: 15px;
        line-height: 70px;
      }
      .header-right{
        // flex: 0 0 140px;
        align-self: flex-end;
        overflow: hidden;
        line-height: 70px;
        padding: 0 20px;
        ::v-deep.content-box {
          float: right;
          .action{
            display: inline-block;
            height: 100%;
            padding: 0 8px;
            .avatar{
              margin-right: 10px;
            }
          }
        }
      }
    }
    .topBtnWrapper{
      position: absolute;
      bottom: 10%;
      left: 10%;
      width: 80%;
      height: 45px;
      text-align: center;
    }
    .topBtn{
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 5px;
      font-size: 18px;
      cursor: pointer;
      padding: 0 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .topBtn:hover{
      background-color: rgba(210, 16, 36, 0.8);
      color: #dddddd;
    }
  }
  .body{
    width: 100%;
    overflow: hidden;
    .news {
      padding: 24px;
    }
    .calendar {
      padding: 24px;
    }
  }
</style>
