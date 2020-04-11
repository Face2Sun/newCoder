<template>
  <div class="calendar-page">
    <div class="calendar-head">
      <span class="show-year">{{ showYear }}年{{ showMonth }}月</span>
      <a-button-group class="button-group">
        <a-button :type="lastMonth" @click="loadMonth('last')">上月</a-button>
        <a-button :type="thisMonth" @click="loadMonth">本月</a-button>
        <a-button :type="nextMonth" @click="loadMonth('next')">下月</a-button>
      </a-button-group>
      <a-button class="add-calendar" @click="addCalendar" type="primary" icon="plus"></a-button>
    </div>
    <a-calendar :value="showDate" @select="onSelect">
      <ul class="events" slot="dateCellRender" slot-scope="value">
        <li v-for="(item,index) in getListData(value)" :key="index">
          <span v-if="index < 2">{{ item.bt }}</span>
          <span v-if="index >= 2" style="font-size: 30px;line-height: 0px;">...</span>
        </li>
      </ul>
    </a-calendar>
    <schedule-detail ref="scheduleDetail" @redraw="redraw"></schedule-detail>
    <schedule-management ref="scheduleManagement" @redraw="redraw"></schedule-management>
  </div>
</template>
<script>
import moment from 'moment'
import { Calendar } from 'ant-design-vue'
import ScheduleDetail from './calendarModule/ScheduleDetail'
import ScheduleManagement from './calendarModule/ScheduleManagement'
import { findAll } from '@/api/calendar'
export default {
  components: {
    ACalendar: Calendar,
    ScheduleDetail,
    ScheduleManagement
  },
  data () {
    return {
      lastMonth: '',
      thisMonth: 'primary',
      nextMonth: '',
      disposeDate: {},
      listData: [],
      showDate: moment(),
      showYear: moment().format('YYYY'),
      showMonth: moment().format('MM')
    }
  },
  created () {
    this.loadDate()
  },
  methods: {
    getListData (value) {
      var listData = []
      for (var i = 0; i < this.listData.length; i++) {
        if (value.format('YYYY-MM-DD') === this.listData[i].kssj.split(' ')[0]) {
          listData.push(this.listData[i])
        }
      }
      return listData
    },
    addCalendar () {
      this.$refs.scheduleDetail.showModal()
    },
    loadDate (date) {
      findAll(date).then(res => {
        if (res.success && res.code === 200) {
          this.listData = res.data
        } else {
          this.$message.error('失败')
        }
      })
    },
    loadMonth (month) {
      this.lastMonth = ''
      this.thisMonth = ''
      this.nextMonth = ''
      if (month === 'last') {
        this.lastMonth = 'primary'
        this.disposeDate.date = this.getPreMonth(moment().format('YYYY-MM-DD'))
        this.showDate = moment(this.disposeDate.date, 'YYYY-MM-DD')
        this.loadDate(this.disposeDate)
      } else if (month === 'next') {
        this.nextMonth = 'primary'
        this.disposeDate.date = this.getNextMonth(moment().format('YYYY-MM-DD'))
        this.showDate = moment(this.disposeDate.date, 'YYYY-MM-DD')
        this.loadDate(this.disposeDate)
      } else {
        this.thisMonth = 'primary'
        this.showDate = moment()
        this.disposeDate.date = moment().format('YYYY-MM-DD')
        this.loadDate(this.disposeDate)
      }
      this.showYear = this.showDate.format('YYYY')
      this.showMonth = this.showDate.format('MM')
    },
    onSelect (date) {
      console.log(date.format('YYYY-MM-DD'))
      var sfxz = false
      for (var i = 0; i < this.listData.length; i++) {
        if (date.format('YYYY-MM-DD') === this.listData[i].kssj.split(' ')[0]) {
          sfxz = true
        }
      }
      if (sfxz) {
        this.$refs.scheduleManagement.showModal(date.format('YYYY-MM-DD'))
      } else {
        this.$refs.scheduleDetail.showModal()
      }
    },
    redraw () {
      this.loadDate(this.disposeDate)
    },
    getPreMonth (date) {
      var arr = date.split('-')
      var year = arr[0]// 获取当前日期的年份
      var month = arr[1]// 获取当前日期的月份
      var day = arr[2]// 获取当前日期的日
      var month2 = parseInt(month) - 1
      if (month2 === 0) {
        year = parseInt(year) - 1
        month2 = 12
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      return year + '-' + month2 + '-' + day
    },
    getNextMonth (date) {
      var arr = date.split('-')
      var year = arr[0]
      var month = arr[1]
      var day = arr[2]
      var month2 = parseInt(month) + 1
      if (month2 === 13) {
        year = parseInt(year) + 1
        month2 = 1
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      return year + '-' + month2 + '-' + day
    }
  }
}
</script>
<style>
/* 更改系统样式 */
.ant-fullcalendar-header {
  display: none;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-date {
  height: 100px;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-content {
  height: 75px;
  overflow: hidden;
}
.ant-fullcalendar-value {
  background: none !important;
}
.events li {
  line-height: 23px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 更改系统样式 */

.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
/* 页面样式 */
.calendar-page .calendar-head {
  height: 50px;
}
.calendar-head .show-year {
  font-size: 22px;
}
.calendar-head .add-calendar {
  margin-left: 10px;
}
.calendar-head .button-group {
  float: right;
  margin-left: 100px;
}
</style>
