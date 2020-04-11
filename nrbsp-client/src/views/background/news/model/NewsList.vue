<template>
  <div>
    <div class="tableTop">
      <div class="top-title">{{ params.lmfl }}</div>
      <a-button class="top-daochu fr" @click="derive" type="primary" icon="download">导出</a-button>
      <a-button v-if="show" class="top-fabu fr" @click="addCalendar" type="primary" icon="plus">发布新闻</a-button>
      <a-divider type="vertical" class="fr top-vertical" />
      <a-button class="top-jiansuo fr" @click="addCalendar" type="primary" icon="caret-down">检索</a-button>
    </div>
    <a-table
      bordered
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      :rowKey="record=>record.id"
    >
      <span slot="operation" slot-scope="text, record" class="operation">
        <router-link
          title="编辑"
          :to="{path: 'news-releases', query: {database: record}}"
        ><a-icon type="form" /></router-link>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
          <a title="删除"><a-icon type="delete" /></a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
import { deriveElsx } from '@/utils/util.js'
import { findInformation, deleteInformationById } from '@/api/newsManage'
export default {
  data () {
    return {
      dataSource: [],
      columns: [
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'operation' }
        },
        {
          title: '新闻标题',
          dataIndex: 'bt',
          align: 'center',
          width: '35%'
        },
        {
          title: '栏目名称',
          dataIndex: 'lmfl',
          align: 'center',
          width: '10%'
        },
        {
          title: '发布人',
          dataIndex: 'fbr',
          align: 'center',
          width: '10%'
        },
        {
          title: '发布部门',
          dataIndex: 'fbbm',
          align: 'center',
          width: '15%'
        },
        {
          title: '发布时间',
          dataIndex: 'updatedTime',
          align: 'center',
          width: '15%',
          customRender: (updatedTime) => {
            if (updatedTime) {
              return updatedTime.split('T')[0]
            }
          }
        }
      ],
      params: {
        lmfl: '要闻播放',
        pageNo: 1,
        pageSize: 100
      },
      show: true,
      selectedRowKeys: [],
      loading: false
    }
  },
  created () {
    if (this.$route.query.database) {
      this.params.lmfl = this.$route.query.database
    }
    this.loadData()
  },
  methods: {
    loadData () {
      this.loading = true
      findInformation(this.params).then(res => {
        if (res.success) {
          this.dataSource = res.data.list
          this.loading = false
          // this.total = parseInt(res.data.total)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    upData (param) {
      this.params.lmfl = param
      this.loadData()
    },
    addCalendar () {},
    derive () {
      const ReqDetailList = this.dataSource // 网络请求命名空间
      const columns = this.columns // 需要放在state里边,Table，Columns
      var tableName = this.params.lmfl + '栏目新闻列表'
      deriveElsx(ReqDetailList, columns, tableName)
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleDelete (id) {
      deleteInformationById(id).then(res => {
        if (res.success && res.code === 200) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error('删除失败')
        }
      })
    }
  }
}
</script>
<style scoped>
.top-vertical{
  top: 10px;
}
.fr{
  float: right;
}
.tableTop{
  width: 100%;
  height: 50px;
  background-color: rgb(250, 250, 250);
  padding-top: 9px;
  border: 1px solid rgb(240, 240, 240);
  margin-bottom: 10px;
}
.tableTop .top-title{
  display: inline-block;
  height: 40px;
  font-size: 17px;
  line-height: 40px;
  text-align: center;
  width: 130px;
  border-bottom: 2px solid rgb(82, 196, 26);
}
.tableTop .top-daochu{
  margin: 0 10px;
}
.operation .anticon{
  font-size: 18px;
}
</style>
