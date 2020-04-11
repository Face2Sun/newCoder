<template>
  <a-card>
    <criteria-query @fatherMethod="fatherMethod"></criteria-query>
    <echarts-from ref="echartsFrom"></echarts-from>
    <div class="xuncha-taizhang">
      <span>指标使用台账</span>
      <a-button type="primary" @click="derive">导出台账</a-button>
    </div>
    <indicators-use ref="indicatorsUse"></indicators-use>
  </a-card>
</template>

<script>
import moment from 'moment'
import CriteriaQuery from './module/CriteriaQuery'
import { deriveElsx } from '@/utils/util.js'
import EchartsFrom from '@/components/Charts/EchartsFrom'
import IndicatorsUse from '../indicator/IndicatorsUse'
import { getUseIndicatorsByQyAndYear } from '@/api/statistical'
export default {
  components: {
    EchartsFrom,
    CriteriaQuery,
    IndicatorsUse
  },
  data () {
    return {
      condition: {},
      chartData: { title: '指标使用面积', type: '新增面积（公顷）', xData: [], yData: [], model: 'tjfx' }
    }
  },
  created () {
    this.searchQuery()
  },
  mounted () {
    this.$refs.indicatorsUse.conceal()
    this.condition.beginDate = this.condition.endDate = moment().format('YYYY-MM-DD')
    this.$refs.indicatorsUse.callConditions(this.condition)
  },
  methods: {
    searchQuery (queryParam) {
      getUseIndicatorsByQyAndYear(queryParam).then(res => {
        if (res.success) {
          console.log('getUseIndicatorsByQyAndYear :::')
          console.log(res)
          this.chartData.xData = []
          this.chartData.yData = []
          for (let i = 0; i < res.data.length; i++) {
            this.chartData.xData.push(res.data[i].qy)
            this.chartData.yData.push(res.data[i].syzb)
          }
          this.$refs.echartsFrom.drawLine(this.chartData)
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    derive () {
      const ReqDetailList = this.$refs.indicatorsUse.dataSource // 网络请求命名空间
      const columns = this.$refs.indicatorsUse.columns // 需要放在state里边,Table，Columns
      deriveElsx(ReqDetailList, columns, '指标使用台账表')
    },
    fatherMethod (queryParam) {
      this.searchQuery(queryParam)
      this.condition.beginDate = this.condition.endDate = queryParam.date
      this.condition.qys = queryParam.qys
      this.$refs.indicatorsUse.callConditions(this.condition)
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
