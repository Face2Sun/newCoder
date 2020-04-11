<template>
  <a-card>
    <criteria-query @fatherMethod="fatherMethod"></criteria-query>
    <echarts-from ref="echartsFrom"></echarts-from>
    <div class="xuncha-taizhang">
      <span>指标新增台账</span>
      <a-button type="primary" @click="derive">导出台账</a-button>
    </div>
    <project-management ref="projectManagement"></project-management>
  </a-card>
</template>

<script>
import moment from 'moment'
import CriteriaQuery from './module/CriteriaQuery'
import ProjectManagement from '../system/ProjectManagement'
import EchartsFrom from '@/components/Charts/EchartsFrom'
import { deriveElsx } from '@/utils/util.js'
import { getNewIndicators } from '@/api/statistical'
export default {
  name: 'IndicatorsNewManagement',
  components: {
    EchartsFrom,
    CriteriaQuery,
    ProjectManagement
  },
  data () {
    return {
      chartData: { title: '新增指标面积', type: '新增面积（公顷）', xData: [], yData: [], model: 'tjfx' },
      condition: {}
    }
  },
  created () {
    this.searchQuery()
  },
  mounted () {
    this.$refs.projectManagement.conceal('2')
    this.condition.beginDate = this.condition.endDate = moment().format('YYYY-MM-DD')
    this.$refs.projectManagement.callConditions(this.condition)
  },
  methods: {
    searchQuery (queryParam) {
      getNewIndicators(queryParam).then(res => {
        if (res.success) {
          console.log('getNewIndicators :::')
          console.log(res)
          this.chartData.xData = []
          this.chartData.yData = []
          for (let i = 0; i < res.data.length; i++) {
            this.chartData.xData.push(res.data[i].qy)
            this.chartData.yData.push(res.data[i].tdmj)
          }
          this.$refs.echartsFrom.drawLine(this.chartData)
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    derive () {
      const ReqDetailList = this.$refs.projectManagement.projectDataSource // 网络请求命名空间
      const columns = this.$refs.projectManagement.columns // 需要放在state里边,Table，Columns
      deriveElsx(ReqDetailList, columns, '指标新增台账')
    },
    fatherMethod (queryParam) {
      this.searchQuery(queryParam)
      this.condition.beginDate = this.condition.endDate = queryParam.date
      this.condition.qys = queryParam.qys
      console.log(this.condition)
      this.$refs.projectManagement.callConditions(this.condition)
    }
  }
}
</script>

<style lang="less" scoped>
.new {
  width: 100%;
  height: 330px;
}
.xuncha-taizhang {
  height: 8px;
}
.xuncha-taizhang span {
  font-size: 24px;
  margin-left: 20px;
  font-family: Arial, Courier, monospace;
  font-weight: 700;
}
.xuncha-taizhang button {
  float: right;
  margin-right: 50px;
}
</style>
