<template>
  <div class="page-header-index-wide">
    <a-card>
      <echarts-from ref="echartsFrom"></echarts-from>
    </a-card>
    <span style="font-size : 25px">项目列表</span>
    <project-management ref="projectManagement"></project-management>
  </div>
</template>

<script>
import ProjectManagement from '../system/ProjectManagement'
import { mixinDevice } from '@/utils/mixin'
import { getYear } from '@/utils/dateUtil'
import moment from 'moment'
import EchartsFrom from '@/components/Charts/EchartsFrom'
import { getNewIndicatorsByThisYear } from '@/api/indicator'

export default {
  name: 'IndicatorsNewManagement',
  mixins: [mixinDevice],
  components: {
    EchartsFrom,
    ProjectManagement
  },
  data () {
    return {
      loading: true,
      chartData: { title: getYear() + '年指标新增变化图', type: '新增（公顷）', xData: [], yData: [] },
      condition: {
        pcmc: null,
        beginDate: null,
        endDate: null,
        pageNo: 1,
        pageSize: 1000
      }
    }
  },
  created () {
    this.loadData()
  },
  mounted () {
    this.$refs.projectManagement.conceal()
    this.condition.beginDate = this.condition.endDate = moment().format('YYYY-MM-DD')
    this.$refs.projectManagement.callConditions(this.condition)
  },
  methods: {
    loadData () {
      getNewIndicatorsByThisYear().then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            this.chartData.xData.push(res.data[i].date)
            this.chartData.yData.push(res.data[i].xzzb)
          }
          this.$refs.echartsFrom.drawLine(this.chartData)
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
