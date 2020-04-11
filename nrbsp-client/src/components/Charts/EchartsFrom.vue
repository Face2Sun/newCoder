<template>
  <div ref="histogram" :style="{width: '100%', height: '400px'}"></div>
</template>
<script>
export default {
  name: 'EchartsFrom',
  data () {
    return {
      xData: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    }
  },
  methods: {
    drawLine (chartData) {
      // 基于准备好的dom，初始化echarts实例
      var histogram = this.$echarts.init(this.$refs.histogram)
      if (chartData.model === 'tjfx') {
        this.xData = chartData.xData
      }
      // 绘制图表
      histogram.setOption({
        title: { text: chartData.title },
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
            data: this.xData,
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
            color: ['#389ffe'],
            name: chartData.type,
            type: 'bar',
            barWidth: '30%',
            data: chartData.yData
          }
        ]
      })
      this.loading = false
    }
  }
}
</script>
