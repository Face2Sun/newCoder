<template>
  <div>
    <a-modal
      title="办事指南"
      :width="1100"
      :placement="placement"
      :visible="visible"
      :footer="null"
      :closable="false"
      :centered="true"
      :destroyOnClose="true"
    >
      <div style="width: 100%">
        <a-tabs defaultActiveKey="1" :tabPosition="tabPosition">
          <a-tab-pane tab="基本信息" key="1">
            <div id="size">
              <basic-infomation ref="basicInfomation"></basic-infomation>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="办理流程" key="2">
            <div id="size">
              <img :src="bllc">
            </div>
          </a-tab-pane>
          <a-tab-pane :tabClick="MaterialsClick" tab="办理材料目录" key="3">
            <!-- @click="showMaterials()" -->
            <div id="size">
              <!-- <work-materials ref="workMaterials"></work-materials> -->
              <a-table
                style="{align:'center'}"
                :rowKey="data.index"
                :columns="columns"
                :dataSource="data"
                :pagination="pagination"
              >
                <a slot="detail" slot-scope="text" href="javascript:;">{{ text }}</a>
                <!-- <a href="javascript:;">Invite 一 {{ record.name }}</a> -->
                <!-- <a-divider type="vertical" /> -->
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="受理条件" key="4">
            <div id="size">
              <span>{{ sltj }}</span>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="收费标准" key="5">
            <div id="size">
              <span>{{ sfbz }}</span>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="设定依据" key="6">
            <div id="size" style="pre-style">
              <pre>{{ sdyj }}</pre>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="常见问题" key="7">
            <div id="size">
              <span>{{ cjwt }}</span>
            </div>
          </a-tab-pane>
        </a-tabs>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'center',margin: '50px 10px' }">
            <a-button type="primary">立即办理</a-button>
            <a-button :style="{ marginLeft: '8px'}" @click="onClose">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>
import BasicInfomation from './BasicInformation'
import WorkMaterials from './WorkMaterials'
import { findXzsxBsznByBsznid, findXzsxBlclListByBsznid } from '@/api/businessGuide'

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
  name: 'WorkGuide',
  components: {
    BasicInfomation,
    WorkMaterials
  },
  data () {
    return {
      data: [],
      columns,
      materialSource: [],
      meterial: {},
      pagination: {
        pageSize: 6
      },
      Parameters: {
        bsznid: '',
        // bsznid: 'c382e3e27e7e4728b388b48a38539a27',
        pageNo: 1,
        pageSize: 100
      },

      visible: false,
      loading: false,
      tabPosition: 'left',
      placement: 'left',
      guideObj: {},
      bsznid: '',
      bllc: '',
      sltj: '',
      sfbz: '',
      sdyj: '',
      cjwt: ''
    }
  },
  methods: {
    MaterialsClick () {
      this.$refs.workMaterials.loadData(this.bsznid)
    },
    showModel () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    onChange (e) {
      this.placement = e.target.value
    },
    loadData (record) {
      this.loading = true // 加载数据
      // 'c382e3e27e7e4728b388b48a38539a27'
      // console.log('办事指南信息' + record)
      this.guideObj = record
      console.log('11111', this.guideObj)
      this.bsznid = this.guideObj.bsznid
      console.log(this.bsznid)
      this.Parameters.bsznid = this.bsznid
      console.log('parameters:', this.Parameters)
      findXzsxBsznByBsznid(this.bsznid).then(res => {
        if (res.success) {
          this.bllc = res.data.bllc
          this.sltj = res.data.sltj
          this.sfbz = res.data.sfbz
          this.sdyj = res.data.sdyj
          this.cjwt = res.data.cjwt
          this.bsznid = res.data.bsznid
          this.$refs.basicInfomation.loadData(this.bsznid)
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
      this.loadMaterials()
    },
    loadMaterials () {
      this.loading = true
      console.log('Parameters:', this.Parameters)
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
#size{
  width: 100%;
  height: 450px
}
.ant-col-24 {
  margin: 10px 10px
}
</style>
