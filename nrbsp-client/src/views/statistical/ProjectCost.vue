<template>
  <a-card>
    <div class="tcentre">
      <criteria-query @fatherMethod="fatherMethod"></criteria-query>
      <div ref="newzb" class="new"></div>
    </div>
  </a-card>
</template>

<script>
import CriteriaQuery from './module/CriteriaQuery'
import { getFinancial } from '@/api/statistical'
export default {
  name: 'IndicatorsNewManagement',
  components: {
    CriteriaQuery
  },
  data () {
    return {
      queryParam: '',
      ipagination: true,
      loading: false,
      chartData: { xData: [], yDataSr: [], yDataZc: [], yDataJy: [] }
    }
  },
  created () {
    this.searchQuery()
  },
  methods: {
    initialize () {
      // 基于准备好的dom，初始化echarts实例
      var areaIndicator = this.$echarts.init(this.$refs.newzb)
      // 绘制图表
      areaIndicator.setOption({
        title: {
          text: '项目费用收支统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['支出（万元）', '收入（万元）', '结余（万元）']
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
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            min: 0,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            color: ['#389ffe'],
            name: '收入（万元）',
            type: 'bar',
            data: this.chartData.yDataSr
          },
          {
            color: ['#4ac972'],
            name: '支出（万元）',
            type: 'bar',
            data: this.chartData.yDataZc
          },
          {
            name: '结余（万元）',
            type: 'line',
            yAxisIndex: 1,
            data: this.chartData.yDataJy
          }
        ]
      })
    },
    searchQuery (queryParam) {
      getFinancial(queryParam).then(res => {
        if (res.success) {
          console.log('getFinancial :::')
          console.log(res)
          this.chartData.xData = []
          this.chartData.yDataSr = []
          this.chartData.yDataZc = []
          this.chartData.yDataJy = []
          for (let i = 0; i < res.data.length; i++) {
            this.chartData.xData.push(res.data[i].qy)
            this.chartData.yDataSr.push(res.data[i].sr)
            this.chartData.yDataZc.push(res.data[i].zc)
            this.chartData.yDataJy.push((res.data[i].sr - res.data[i].zc).toFixed(2))
          }
          this.initialize()
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    fatherMethod (queryParam) {
      this.searchQuery(queryParam)
    }
  }
}
</script>

<style lang="less" scoped>
.tcentre {
  width: 1300px;
}
.new {
  width: 100%;
  height: 650px;
  margin: 25px;
}
</style>
