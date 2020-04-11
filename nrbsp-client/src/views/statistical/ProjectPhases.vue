<template>
  <a-card>
    <criteria-query @fatherMethod="fatherMethod"></criteria-query>
    <div ref="phases" class="phases"></div>
  </a-card>
</template>

<script>
import { getProjectAreaByState } from '@/api/statistical'
import CriteriaQuery from './module/CriteriaQuery'
export default {
  components: {
    CriteriaQuery
  },
  data () {
    return {
      chartData: { xData: [], yDatalx: [], yDatajsz: [], yDatajgys: [] },
      values: []
    }
  },
  created () {
    this.searchQuery()
  },
  methods: {
    onChange (date) {
      console.log(date)
    },
    drawLine () {
      var myChart = this.$echarts.init(this.$refs.phases)
      // 绘制图表
      myChart.setOption({
        title: { text: '项目阶段面积统计' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['立项（公顷）', '建设中（公顷）', '竣工验收（公顷）']
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartData.xData,
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
            name: '立项（公顷）',
            type: 'bar',
            data: this.chartData.yDatalx
          },
          {
            color: ['#4cc972'],
            name: '建设中（公顷）',
            type: 'bar',
            data: this.chartData.yDatajsz
          },
          {
            color: ['#f9d236'],
            name: '竣工验收（公顷）',
            type: 'bar',
            data: this.chartData.yDatajgys
          }
        ]
      })
      this.loading = false
    },
    searchQuery (queryParam) {
      getProjectAreaByState(queryParam).then(res => {
        if (res.success) {
          console.log('getProjectAreaByState :::')
          console.log(res)
          this.chartData.xData = []
          for (const key in res.data) {
            this.chartData.xData.push(key)
            this.values.push(res.data[key])
          }
          this.chartData.yDatalx = []
          this.chartData.yDatajsz = []
          this.chartData.yDatajgys = []
          for (let i = 0; i < this.values.length; i++) {
            for (let j = 0; j < this.values[i].length; j++) {
              if (this.values[i][j].xmzt === '1') {
                this.chartData.yDatalx.push(this.values[i][j].tdmj)
              } else if (this.values[i][j].xmzt === '2') {
                this.chartData.yDatajsz.push(this.values[i][j].tdmj)
              } else if (this.values[i][j].xmzt === '3') {
                this.chartData.yDatajgys.push(this.values[i][j].tdmj)
              }
            }
          }
          this.drawLine()
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    fatherMethod (queryParam) {
      this.values = []
      this.searchQuery(queryParam)
    }
  }
}
</script>

<style lang="less" scoped>
.phases {
  width: 100%;
  height: 600px;
}
</style>
