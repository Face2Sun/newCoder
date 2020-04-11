<!-- 用户管理 add by sgy 2019-11-12 管理keycloak当前的客户端的用户-->
<template>
  <div>
    <a-card :bordered="false" v-if="display">
      <a-row class="projectTitle">
        <a-col :sm="8" :xs="24">
          <head-info title="全部项目" :bordered="true" />
          <span>{{ stateNum.qbxm }}个项目</span>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="进行中项目" :bordered="true" />
          <span>{{ stateNum.jxzxm }}个项目</span>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="已完成项目" />
          <span>{{ stateNum.ywcxm }}个项目</span>
        </a-col>
      </a-row>
    </a-card>
    <!-- 查询区域 -->
    <a-card :bordered="false" style="margin-top: 25px">
      <div v-if="display" class="liststyle">项目列表</div>
      <div class="search-bar clearfix" v-if="displaySearch">
        <a-button
          v-if="display"
          class="add-project"
          @click="addProject"
          type="primary"
          icon="plus"
        >添加项目</a-button>
        <a-form layout="inline" class="form-search">
          <a-form-item label="选择年份范围">
            <year-picker ref="beginYearPicker"></year-picker>
            <span>&nbsp;~&nbsp;</span>
            <year-picker ref="endYearPicker"></year-picker>
          </a-form-item>
          <a-form-item label="项目名称">
            <a-input placeholder="请输入项目名称" v-model="queryParam.xmmc" />
          </a-form-item>
          <a-button
            type="primary"
            class="chaxun"
            @click="searchQuery"
            html-type="submit"
            icon="search"
          >查询</a-button>
        </a-form>
      </div>
      <a-table
        ref="table"
        rowKey="key"
        bordered
        size="middle"
        :columns="columns"
        :dataSource="projectDataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="operation" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
          <a-divider v-if="display" type="vertical" />
          <a href="javascript:;" @click="handleEdit(record)" v-if="display">编辑</a>
          <a-divider v-if="display" type="vertical" />
          <a-popconfirm v-if="display" title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <detailed-form ref="detailedForm" @loadData="loadData"></detailed-form>
    </a-card>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
import DetailedForm from './model/DetailedForm'
import YearPicker from '@/components/tools/YearPicker'
import { getProjectInfo, deleteProject, projectStateNum } from '@/api/projects'
export default {
  name: 'ProjectManagement',
  components: {
    HeadInfo,
    YearPicker,
    DetailedForm
  },
  data () {
    return {
      projectDataSource: [],
      columns: [
        {
          title: '项目名称',
          dataIndex: 'xmmc',
          align: 'center',
          width: '25%'
        },
        {
          title: '土地坐落',
          dataIndex: 'tdzl',
          align: 'center',
          width: '20%'
        },
        {
          title: '实施单位',
          dataIndex: 'ssdw',
          align: 'center',
          width: '20%'
        },
        {
          title: '开始时间',
          dataIndex: 'xmkssj',
          align: 'center',
          width: '10%',
          customRender: (xmkssj) => {
            if (xmkssj) {
              return xmkssj.split('T')[0]
            }
          }
        },
        {
          title: '项目状态',
          dataIndex: 'xmzt',
          align: 'center',
          width: '10%',
          customRender: (xmzt) => {
            if (xmzt === '1') {
              return '立项'
            } else if (xmzt === '2') {
              return '建设中'
            } else if (xmzt === '3') {
              return '竣工验收'
            } else {
              return xmzt
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '20%',
          scopedSlots: {
            customRender: 'operation'
          }
        }
      ],
      queryParam: {
        xmmc: null,
        beginDate: '1000-01-01', // 开始时间
        endDate: '4000-01-01', // 结束时间
        pageNo: 1,
        pageSize: 10
      },
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: total => `共有 ${total} 条数据`,
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      display: true,
      displaySearch: true,
      loading: false,
      stateNum: {}
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      projectStateNum().then(res => {
        if (res.success) {
          this.stateNum = res.data
        }
      })
      this.getProjectInfos()
    },
    getProjectInfos () {
      this.loading = true // 出现加载圈圈
      this.queryParam.pageNo = this.ipagination.current
      this.queryParam.pageSize = this.ipagination.pageSize
      getProjectInfo(this.queryParam).then(res => {
        if (res.success) {
          this.projectDataSource = res.data.list
          this.ipagination.total = parseInt(res.data.total)
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
      this.getProjectInfos()
    },
    handleTableChange (pagination) {
      this.queryParam.pageNo = this.ipagination.current = pagination.current
      this.queryParam.pageSize = this.ipagination.pageSize = pagination.pageSize
      this.getProjectInfos()
    },
    // 隐藏界面上的一些组件
    conceal (value) {
      if (value === '2') {
        this.displaySearch = false
      }
      this.display = false
    },
    // 其他组件调用的方法
    callConditions (condition) {
      this.queryParam.qys = condition.qys
      this.queryParam.beginDate = this.queryParam.endDate = condition.beginDate
      setTimeout(() => {
        this.getProjectInfos()
      }, 300)
    },
    addProject () {
      this.$refs.detailedForm.showModal()
    },
    // 编辑按钮
    handleEdit (record) {
      this.$refs.detailedForm.showModal()
      this.$refs.detailedForm.showBasicData(record)
    },
    // 详情按钮
    handleDetail (record) {
      this.$nextTick(() => {
        this.$refs.detailedForm.showModal('btn')
        this.$refs.detailedForm.showBasicData(record)
      })
    },
    handleDelete (key) {
      deleteProject(key).then(res => {
        if (res.success && res.code === 200) {
          this.$message.success('删除成功')
          this.loadData()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.projectTitle span {
  font-size: 30px;
  margin-left: 192px;
}
.liststyle {
  font-size: 26px;
  margin: 0 0 20px 0;
}
.search-bar {
  padding-bottom: 20px;
}
.add-project {
  display: inline-block;
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
