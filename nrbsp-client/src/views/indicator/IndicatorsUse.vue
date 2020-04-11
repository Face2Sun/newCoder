<template>
  <div class="page-header-index-wide">
    <a-card v-if="display">
      <echarts-from ref="echartsFrom"></echarts-from>
    </a-card>
    <div class="baojian-list" v-if="display">报件列表</div>
    <a-card :bordered="false" style="margin-top: 24px">
      <div class="clearfix">
        <a-button v-if="display" class="add-data" @click="addData" type="primary" icon="plus">新增</a-button>
        <a-form v-if="display" layout="inline" class="form-search">
          <a-form-item label="选择年份范围">
            <year-picker ref="beginYearPicker"></year-picker>
            <span>&nbsp;~&nbsp;</span>
            <year-picker ref="endYearPicker"></year-picker>
          </a-form-item>
          <a-form-item label="批次名称">
            <a-input placeholder="请输入批次名称" v-model="queryParam.pcmc" />
          </a-form-item>
          <a-button
            type="primary"
            class="chaxun"
            @click="searchQuery"
            html-type="submit"
            icon="search"
          >查询</a-button>
        </a-form>
        <a-table
          ref="table"
          rowKey="key"
          bordered
          size="middle"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <span slot="operation" slot-scope="text, record">
            <a @click="handleDetail(record)">详情</a>
            <a-divider v-if="display" type="vertical" />
            <a href="javascript:;" v-if="display" @click="handleEdit(record)">编辑</a>
            <a-divider v-if="display" type="vertical" />
            <a-popconfirm v-if="display" title="确定删除吗?" @confirm="handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
        <criteria-indicator ref="criteriaIndicator" @loadData="loadData"></criteria-indicator>
      </div>
    </a-card>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { getYear } from '@/utils/dateUtil'
import YearPicker from '@/components/tools/YearPicker'
import EchartsFrom from '@/components/Charts/EchartsFrom'
import { getIndicatorsList, getUseIndicatorsByThisYear, delIndicators } from '@/api/indicator'
import CriteriaIndicator from './modal/CriteriaIndicator.vue'
export default {
  name: 'IndicatorsNewManagement',
  mixins: [mixinDevice],
  components: {
    EchartsFrom,
    YearPicker,
    CriteriaIndicator
  },
  data () {
    return {
      chartData: {
        title: getYear() + '年指标使用变化图',
        type: '使用（公顷）',
        xData: [],
        yData: []
      },
      dataSource: [],
      columns: [
        {
          title: '批次名称',
          dataIndex: 'pcmc',
          align: 'center',
          width: '30%'
        },
        {
          title: '报建类型',
          dataIndex: 'bjlx',
          align: 'center',
          width: '10%',
          customRender: (bjlx) => {
            if (bjlx === '1') {
              return '批次用地'
            } else if (bjlx === '2') {
              return '单独选择'
            } else {
              return '其他'
            }
          }
        },
        {
          title: '指标使用（公顷）',
          dataIndex: 'syzb',
          align: 'center',
          width: '10%'
        },
        {
          title: '批复时间',
          dataIndex: 'pfsj',
          align: 'center',
          width: '10%',
          customRender: (pfsj) => {
            if (pfsj) {
              return pfsj.split('T')[0]
            }
          }
        },
        {
          title: '报建状态',
          dataIndex: 'bjzt',
          align: 'center',
          width: '10%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      loading: false,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: total => `共有 ${total} 条数据`,
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      queryParam: {
        pcmc: null, // 批次名称
        beginDate: '1000-01-01', // 开始时间
        endDate: '4000-01-01', // 结束时间
        pageNo: 1,
        pageSize: 1000
      },
      display: true
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    // 隐藏部分组件
    conceal () {
      this.display = false
    },
    // 别的组件调用的方法
    callConditions (condition) {
      this.queryParam.qys = condition.qys
      this.queryParam.beginDate = this.queryParam.endDate = condition.beginDate
      setTimeout(() => {
        this.getIndicatorsLists()
      }, 300)
    },
    loadData () {
      this.getIndicatorsLists()
      getUseIndicatorsByThisYear().then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            this.chartData.xData.push(res.data[i].date)
            this.chartData.yData.push(res.data[i].syzb)
          }
          this.$refs.echartsFrom.drawLine(this.chartData)
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    searchQuery () {
      this.queryParam.beginDate = this.$refs.beginYearPicker.selectDate()
      if (!this.queryParam.beginDate) {
        this.queryParam.beginDate = '1000-01-01'
      }
      this.queryParam.endDate = this.$refs.endYearPicker.selectDate()
      if (!this.queryParam.endDate) {
        this.queryParam.endDate = '4000-01-01'
      }
      console.log(this.queryParam)
      this.getIndicatorsLists()
    },
    getIndicatorsLists () {
      this.loading = true // 出现加载圈圈
      getIndicatorsList(this.queryParam).then(res => {
        if (res.success) {
          this.dataSource = res.data
          this.ipagination.total = parseInt(res.data.total)
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    handleTableChange (pagination) {
      this.queryParam.pageNo = this.ipagination.current = pagination.current
      this.queryParam.pageSize = this.ipagination.pageSize = pagination.pageSize
      this.getIndicatorsLists()
    },
    addData () {
      this.$refs.criteriaIndicator.showModal('新增指标使用')
    },
    // 点击编辑按钮弹出详细信息表单
    handleEdit (record) {
      this.$refs.criteriaIndicator.showModal('修改指标使用')
      this.$refs.criteriaIndicator.showData(record)
    },
    // 点击详情按钮 弹出详细信息表单
    handleDetail (record) {
      this.$refs.criteriaIndicator.showModal('查看指标使用')
      this.$refs.criteriaIndicator.showData(record)
      this.$refs.criteriaIndicator.show = false
    },
    // 删除
    handleDelete (key) {
      console.log(key)
      delIndicators(key).then(res => {
        if (res.success && res.code === 200) {
          this.$message.success('删除成功')
          this.loadData()
        }
      })
    },
    valueInitialization () { }
  }
}
</script>

<style lang="less" scoped>
.baojian-list {
  font-size: 26px;
  margin: 20px 0 0 30px;
}
.add-data {
  display: inline-block;
  margin-bottom: 20px;
}
.form-search {
  float: right;
}
.chaxun {
  margin-top: 4px;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
