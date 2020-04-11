<template>
  <a-table
    style="{align:'center'}"
    rowKey="clmuid"
    :columns="columns"
    :dataSource="data"
    :pagination="pagination"
  >
    <a slot="detail" slot-scope="text" href="javascript:;">{{ text }}</a>
    <!-- <a href="javascript:;">Invite 一 {{ record.name }}</a> -->
    <!-- <a-divider type="vertical" /> -->
  </a-table>
</template>
<script>
import { findXzsxBlclListByBsznid } from '@/api/businessGuide'

const columns = [
  {
    title: '材料名称',
    dataIndex: 'clmc',
    key: 'clmc',
    align: 'center'

  },
  {
    title: '材料填写样本',
    dataIndex: 'cltxyb',
    key: 'cltxyb',
    align: 'center'
  },
  {
    title: '来源渠道',
    dataIndex: 'lyqd',
    key: 'lyqd',
    align: 'center'
  },
  {
    title: '纸质材料',
    dataIndex: 'zzcl',
    key: 'zzcl',
    align: 'center'
  },
  {
    title: '材料必要性',
    dataIndex: 'clbyx',
    key: 'clbyx',
    align: 'center'
  },
  {
    title: '详情',
    dataIndex: 'xq',
    key: 'xq',
    align: 'center',
    scopedSlots: { customRender: 'detail' }
  }
]

export default {
  name: 'WorkMaterials',
  data () {
    return {
      data: [],
      columns,
      materialSource: [],
      meterial: {},
      loading: false,
      pagination: {
        pageSize: 6
      },
      Parameters: {
        bsznid: 'c382e3e27e7e4728b388b48a38539a27',
        pageNo: 1,
        pageSize: 100
      }
    }
  },
  // mounted () {
  //   this.loadData()
  // },
  methods: {
    loadData (value) {
      console.log('办事材料获取到的id' + value)
      // this.Parameters.bsznid = value
      // console.log('办事材料传入的参数' + this.Parameters)
      this.loading = true
      findXzsxBlclListByBsznid(this.Parameters).then(res => {
        this.loading = false
        if (res.success) {
          this.materialSource = res.data
          var obj = this.materialSource
          var arr = []
          for (const i in obj) {
            arr.push(obj[i]) // 属性
          }
          console.log(arr)
          this.data = arr
        } else {
          this.$message.error('数据获取失败')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
