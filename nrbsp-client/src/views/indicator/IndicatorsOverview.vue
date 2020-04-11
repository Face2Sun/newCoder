<template>
  <div class="page-header-index-wide">
    <a-card>
      <a-col :sm="8" :xs="24">
        <head-info title="当前剩余指标（公顷）" :content="totalSurplus.toString()" :bordered="true" />
      </a-col>
      <a-col :sm="8" :xs="24">
        <head-info title="今年使用指标（公顷）" :content="totalUse.toString()" :bordered="true" />
      </a-col>
      <a-col :sm="8" :xs="24">
        <head-info title="今年新增指标（公顷）" :content="totalNew.toString()" />
      </a-col>
    </a-card>
    <a-card>
      <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
    </a-card>
    <a-card>
      <a-col :sm="12" :xs="24">
        <div id="myChartGraph" :style="{width: '90%', height: '400px'}"></div>
      </a-col>
      <a-col :sm="12" :xs="24">
        <div id="myTrendChart" :style="{width: '90%', height: '400px'}"></div>
      </a-col>
    </a-card>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
import { mixinDevice } from '@/utils/mixin'
import { getNewIndicatorsByThisYear, getUseIndicatorsByThisYear,
  getUsableIndicatorsByYear, getUseIndicatorsByYear,
  getIndicatorsTotalSurplus, getIndicatorsTotalNew,
  getIndicatorsTotalUse } from '@/api/indicator'
import { getYear } from '@/utils/dateUtil'
export default {
  name: 'IndicatorsNewManagement',
  mixins: [mixinDevice],
  components: {
    HeadInfo
  },
  data () {
    return {
      loading: true,
      chartData: { xData: [], yDataNew: [], yDataUse: [] },
      chartGraphData: { xData: [], yData: [] },
      chartTrendData: { xData: [], yData: [] },
      totalSurplus: 0,
      totalNew: 0,
      totalUse: 0
    }
  },
  created () {
    this.getUseIndicatorsByThisYear() // 获取使用指标数据
    this.getNewIndicatorsByThisYear() // 获取新增指标数据
    this.getUsableIndicatorsByYear() // 通过近10年以内的年份排序查询各个年份的可用指标
    this.getUseIndicatorsByYear() // 通过近10年以内的年份排序查询各个年份的使用指标
    this.getIndicatorsTotalSurplus() // 查询指标新增总剩余数额
    this.getIndicatorsTotalNew() // 查询当年指标总新增数额
    this.getIndicatorsTotalUse()// 查询当年指标总使用数额
  },
  mounted () {
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: getYear() + '年指标新增/使用变化图' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['新增（公顷）', '使用（公顷）']
        },
        xAxis: [
          {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            color: ['#389ffe'],
            name: '新增（公顷）',
            type: 'bar',
            data: this.chartData.yDataNew
          },
          {
            color: ['#4ac972'],
            name: '使用（公顷）',
            type: 'bar',
            data: this.chartData.yDataUse
          }
        ]
      })
      this.loading = false
    },
    myChartGraph () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('myChartGraph'))
      // 绘制图表
      myChart.setOption({
        title: { text: '近年指标存量变化图' },
        tooltip: {
          trigger: 'axis'
        },
        xAxis:
          {
            type: 'category',
            boundaryGap: false,
            data: this.chartGraphData.xData
          },
        yAxis:
          {
            type: 'value'

          },
        series: [
          {
            color: ['#389ffe'],
            name: '可用面积（公顷）',
            data: this.chartGraphData.yData,
            type: 'line',
            areaStyle: {}
          }
        ]
      })
      this.loading = false
    },
    myTrendChart () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('myTrendChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: '近年指标使用趋势图' },
        tooltip: {
          trigger: 'axis'
        },
        xAxis:
          {
            type: 'category',
            boundaryGap: false,
            data: this.chartTrendData.xData
          },
        yAxis:
          {
            type: 'value'

          },
        series: [
          {
            color: ['#389ffe'],
            name: '使用面积（公顷）',
            data: this.chartTrendData.yData,
            type: 'line',
            areaStyle: {}
          }
        ]
      })
      this.loading = false
    },
    getUseIndicatorsByThisYear () {
      const _this = this
      getUseIndicatorsByThisYear().then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            _this.chartData.xData.push(res.data[i].date)
            _this.chartData.yDataUse.push(res.data[i].syzb)
          }
          _this.loading = false
          this.drawLine()
        } else {
          _this.$message.error('数据获取失败')
        }
      })
    },
    getNewIndicatorsByThisYear () {
      const _this = this
      getNewIndicatorsByThisYear().then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            _this.chartData.yDataNew.push(res.data[i].xzzb)
          }
          _this.loading = false
          this.drawLine()
        } else {
          _this.$message.error('数据获取失败')
        }
      })
    },
    getUsableIndicatorsByYear () {
      const _this = this
      getUsableIndicatorsByYear().then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            _this.chartGraphData.xData.push(res.data[i].date)
            _this.chartGraphData.yData.push(res.data[i].xzzb)
          }
          _this.loading = false
          this.myChartGraph()
        } else {
          _this.$message.error('数据获取失败')
        }
      })
    },
    getUseIndicatorsByYear () {
      const _this = this
      getUseIndicatorsByYear().then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            _this.chartTrendData.xData.push(res.data[i].date)
            _this.chartTrendData.yData.push(res.data[i].syzb)
          }
          _this.loading = false
          this.myTrendChart()
        } else {
          _this.$message.error('数据获取失败')
        }
      })
    },
    getIndicatorsTotalSurplus () {
      const _this = this
      getIndicatorsTotalSurplus().then(res => {
        if (res.success) {
          _this.totalSurplus = res.data.totalSurplus
          _this.loading = false
          this.myTrendChart()
        } else {
          _this.$message.error('数据获取失败')
        }
      })
    },
    getIndicatorsTotalNew () {
      const _this = this
      getIndicatorsTotalNew().then(res => {
        if (res.success) {
          _this.totalNew = res.data.totalNew
          _this.loading = false
          this.myTrendChart()
        } else {
          _this.$message.error('数据获取失败')
        }
      })
    },
    getIndicatorsTotalUse () {
      const _this = this
      getIndicatorsTotalUse().then(res => {
        if (res.success) {
          _this.totalUse = res.data.totalUse
          _this.loading = false
          this.myTrendChart()
        } else {
          _this.$message.error('数据获取失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  color: #389ffe;
}
</style>
