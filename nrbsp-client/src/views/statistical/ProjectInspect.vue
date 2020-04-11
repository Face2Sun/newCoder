<template>
  <a-card>
    <criteria-query @fatherMethod="fatherMethod"></criteria-query>
    <div ref="newzb" class="new"></div>
    <div ref="usezb" class="use"></div>
    <div class="xuncha-taizhang">
      <span>巡查台账</span>
      <a-button type="primary" @click="derive">导出台账</a-button>
    </div>
    <a-table
      rowKey="key"
      bordered
      size="middle"
      :columns="columns"
      :dataSource="xunchaDataSource"
      :pagination="ipagination"
      :loading="loading"
    >
      <span slot="xcrq" slot-scope="xcrq">
        <span v-if="xcrq == null"></span>
        <span v-if="xcrq != null">{{ xcrq.split(" ")[0] }}</span>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import CriteriaQuery from './module/CriteriaQuery'
import { deriveElsx } from '@/utils/util.js'
import moment from 'moment'
import { getProjectPatrolNum, getProjectPatrolPersonNum, getProjectPatrol } from '@/api/statistical'
export default {
  name: 'IndicatorsNewManagement',
  components: {
    CriteriaQuery
  },
  data () {
    return {
      xunchaDataSource: [],
      columns: [
        {
          title: '巡查时间',
          dataIndex: 'xcrq',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'xcrq' }
        },
        {
          title: '姓名',
          dataIndex: 'xcry',
          align: 'center',
          width: '20%'
        },
        {
          title: '项目名称',
          dataIndex: 'xmmc',
          width: '50%'
        }
      ],
      queryParam: {
        pageNo: 1,
        pageSize: 100,
        qy: null,
        date: null
      },
      ipagination: true,
      loading: false,
      newzbData: { xData: [], yData: [] },
      usezbData: { xData: [], yData: [] }
    }
  },
  created () {
    this.queryParam.date = moment().format('YYYY-MM-DD')
    this.searchQuery(this.queryParam)
  },
  methods: {
    initialize () {
      // 基于准备好的dom，初始化echarts实例
      var areaIndicator = this.$echarts.init(this.$refs.newzb)
      // 绘制图表
      areaIndicator.setOption({
        title: {
          text: '项目巡查统计（top10）'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.newzbData.xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '次数',
            type: 'bar',
            barWidth: '50%',
            data: this.newzbData.yData
          }
        ]
      })
      var useIndicator = this.$echarts.init(this.$refs.usezb)
      useIndicator.setOption({
        title: {
          text: '巡查人员统计'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.usezbData.xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '次数',
            type: 'bar',
            barWidth: '50%',
            data: this.usezbData.yData
          }
        ]
      })
    },
    initializeTable (queryParam) {
      this.loading = true // 出现加载圈圈
      getProjectPatrol(queryParam).then(res => {
        if (res.success) {
          this.xunchaDataSource = res.data.list
          this.loading = false
          console.log(this.xunchaDataSource)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    searchQuery (queryParam) {
      this.initializeTable(queryParam)
      getProjectPatrolNum(queryParam).then(res => {
        if (res.success) {
          console.log('getProjectPatrolNum :::')
          console.log(res)
          this.newzbData.xData = []
          this.newzbData.yData = []
          for (let i = 0; i < res.data.length; i++) {
            this.newzbData.xData.push(res.data[i].xmmc)
            this.newzbData.yData.push(res.data[i].xccs)
          }
          this.initialize()
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
      getProjectPatrolPersonNum(queryParam).then(res => {
        if (res.success) {
          console.log('getProjectPatrolPersonNum :::')
          console.log(res)
          this.usezbData.xData = []
          this.usezbData.yData = []
          for (let i = 0; i < res.data.length; i++) {
            this.usezbData.xData.push(res.data[i].xcry)
            this.usezbData.yData.push(res.data[i].xccs)
          }
          this.initialize()
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    fatherMethod (queryParam) {
      this.xunchaDataSource = []
      this.searchQuery(queryParam)
    },
    derive () {
      const ReqDetailList = this.xunchaDataSource // 网络请求命名空间
      const columns = this.columns // 需要放在state里边,Table，Columns
      deriveElsx(ReqDetailList, columns, '巡查台账表')
    }
  }
}
</script>

<style lang="less" scoped>
.new,
.use {
  width: 40%;
  height: 330px;
  margin: 25px;
  display: inline-block;
}
.xuncha-taizhang {
  height: 50px;
}
.xuncha-taizhang span {
  font-size: 24px;
  margin-left: 20px;
  font-family: Arial, Courier, monospace;
  font-weight: 700;
}
.xuncha-taizhang button {
  float: right;
  margin-right: 10px;
}
</style>
