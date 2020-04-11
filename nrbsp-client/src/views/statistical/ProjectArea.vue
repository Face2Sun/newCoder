<template>
  <a-card>
    <criteria-query @fatherMethod="fatherMethod"></criteria-query>
    <div ref="newzb" class="new"></div>
    <div ref="usezb" class="use"></div>
    <echarts-from ref="echartsFrom"></echarts-from>
  </a-card>
</template>

<script>
import CriteriaQuery from './module/CriteriaQuery'
import EchartsFrom from '@/components/Charts/EchartsFrom'
import { getRenovateProject, getNewAddIndicators, getUseIndicators } from '@/api/statistical'

export default {
  name: 'IndicatorsNewManagement',
  components: {
    EchartsFrom,
    CriteriaQuery
  },
  data () {
    return {
      xData: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      chartData: { title: '整治中工程面积统计', type: '整治工程（公顷）', xData: [], yData: [], model: 'tjfx' },
      lineData: { title: '区域指标新增', type: 'value', legend: [], series: [] },
      seriesProject: {}
    }
  },
  created () {
    this.searchQuery()
  },
  methods: {
    initialize (lineChart, lineData) {
      // 绘制图表
      lineChart.setOption({
        title: {
          text: lineData.title
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          y: 335,
          data: lineData.legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xData
        },
        yAxis: {
          type: lineData.type
        },
        series: lineData.series
      }, true)
    },
    searchQuery (queryParam) {
      getRenovateProject(queryParam).then(res => {
        if (res.success) {
          // console.log('getRenovateProject :::')
          // console.log(res)
          this.chartData.xData = []
          this.chartData.yData = []
          for (let i = 0; i < res.data.length; i++) {
            this.chartData.xData.push(res.data[i].qy)
            this.chartData.yData.push(res.data[i].tdmj)
          }
          this.$refs.echartsFrom.drawLine(this.chartData)
        } else {
          this.$message.error('数据获取失败')
        }
      })
      getNewAddIndicators(queryParam).then(res => {
        console.log(queryParam)
        console.log('00000')
        if (res.success) {
          console.log('getNewAddIndicators :::区域指标新增数据')
          console.log(res)
          this.dataProcessing(res, 'xzzb')
          this.lineData.title = '区域指标新增'
          var newIndicator = this.$echarts.init(this.$refs.newzb)
          // console.log('this.lineData1111')
          // console.log(this.lineData)
          this.initialize(newIndicator, this.lineData)
        } else {
          this.$message.error('数据获取失败')
        }
      })
      getUseIndicators(queryParam).then(res => {
        if (res.success) {
          // console.log('getUseIndicators :::')
          // console.log(res)
          this.dataProcessing(res, 'syzb')
          this.lineData.title = '区域指标使用'
          var useIndicator = this.$echarts.init(this.$refs.usezb)
          // console.log('this.lineData222222')
          // console.log(this.lineData)
          this.initialize(useIndicator, this.lineData)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    dataProcessing (res, zblx) {
      this.seriesProject.data = []
      this.lineData.legend = []
      this.lineData.series = []
      for (var key in res.data) {
        this.lineData.legend.push(key)
        for (let i = 0; i < res.data[key].length; i++) {
          this.seriesProject.data.push(res.data[key][i][zblx])
        }
        this.seriesProject.name = key
        this.seriesProject.type = 'line'
        this.lineData.series.push(this.seriesProject)
        this.seriesProject = {}
        this.seriesProject.data = []
      }
    },
    fatherMethod (queryParam) {
      console.log(queryParam)
      this.searchQuery(queryParam)
    }
  }
}
</script>

<style lang="less" scoped>
.new,
.use {
  width: 40%;
  height: 400px;
  display: inline-block;
}
.use {
  margin-left: 10%;
}
</style>
