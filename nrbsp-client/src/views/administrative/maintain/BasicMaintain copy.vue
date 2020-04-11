<template>
  <div>
    <a-row type="flex">
      <a-col :span="6" :order="4"><p>{{ bslx }}</p></a-col>
      <a-col :span="6" :order="3"><p>办件类型</p></a-col>
      <a-col :span="6" :order="2"><p>{{ sxlx }}</p></a-col>
      <a-col :span="6" :order="1"><p>事项类型</p></a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="6" :order="4"><p>{{ sszt }}</p></a-col>
      <a-col :span="6" :order="3"><p>实施主体</p></a-col>
      <a-col :span="6" :order="2"><p>{{ xscj }}</p></a-col>
      <a-col :span="6" :order="1"><p>行使层级</p></a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="6" :order="4"><p>{{ cnbjsx }}</p></a-col>
      <a-col :span="6" :order="3"><p>承诺办结时限</p></a-col>
      <a-col :span="6" :order="2"><p>{{ fdbjsx }}</p></a-col>
      <a-col :span="6" :order="1"><p>法定办结时限</p></a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="6" :order="4"><p>{{ sfsf }}</p></a-col>
      <a-col :span="6" :order="3"><p>是否收费</p></a-col>
      <a-col :span="6" :order="2"><p>{{ bscs }}次</p></a-col>
      <a-col :span="6" :order="1"><p>到办事现场次数</p></a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="18" :order="2"><p>{{ zxfs }}</p></a-col>
      <a-col :span="6" :order="1"><p>咨询方式</p></a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="18" :order="2"><p>{{ jdtsfs }}</p></a-col>
      <a-col :span="6" :order="1"><p>监督投诉方式</p></a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="18" :order="2"><p>{{ blsj }}</p></a-col>
      <a-col :span="6" :order="1"><p>办理时间</p></a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="18" :order="2"><p>{{ bldd }}</p></a-col>
      <a-col :span="18" :order="2"><p>{{ bldd }}</p></a-col>
      <a-col :span="6" :order="1"><p>办理地点</p></a-col>
    </a-row>
  </div>
</template>

<script>
import { findXzsxJbxxListByBsznid } from '@/api/businessGuide'

export default {
  name: 'BasicMaintain',
  data () {
    return {
      loading: false,
      recordId: '',
      basicData: {},
      sxlx: '',
      bslx: '',
      sszt: '',
      xscj: '',
      cnbjsx: '',
      fdbjsx: '',
      sfsf: '',
      bscs: '',
      zxfs: '',
      jdtsfs: '',
      blsj: '',
      bldd: ''
    }
  },
  created (value) {
    this.loadData()
  },
  methods: {
    loadData (value) {
      this.loading = true
      // 'c382e3e27e7e4728b388b48a38539a27'
      console.log('基本信息获取到的' + value)
      this.recordId = value.toString()
      findXzsxJbxxListByBsznid('c382e3e27e7e4728b388b48a38539a27').then(res => {
        if (res.success) {
          console.log(res + '1212321231')
          this.basicData = res.data
          console.log(this.basicData)
          this.sxlx = this.basicData.sxlx
          this.bslx = this.basicData.bslx
          this.sszt = this.basicData.sszt
          this.xscj = this.basicData.xscj
          this.cnbjsx = this.basicData.cnbjsx
          this.fdbjsx = this.basicData.fdbjsx
          this.sfsf = this.basicData.sfsf
          this.zxfs = this.basicData.zxfs
          this.jdtsfs = this.basicData.jdtsfs
          this.blsj = this.basicData.blsj
          this.bldd = this.basicData.bldd
          this.bscs = this.basicData.bscs
          // this.sxlx = res.data.sxlx
          // this.bslx = res.data.bslx
          // this.sszt = res.data.sszt
          // this.xscj = res.data.xscj
          // this.cnbjsx = res.data.cnbjsx
          // this.fdbjsx = res.data.fdbjsx
          // this.sfsf = res.data.sfsf
          // this.zxfs = res.data.zxfs
          // this.jdtsfs = res.data.jdtsfs
          // this.blsj = res.data.blsj
          // this.bldd = res.data.bldd
          // this.bscs = res.data.bscs
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    }
  }
}
</script>
<style scoped>
.ant-col-6,.ant-col-18 {
  height: 50px;
  width: 177px;
  text-align: center;
  border: 1px solid rgba(220, 220,220, 0.5)
}
.ant-col-order-1,.ant-col-order-3 {
  /* background-color: aquamarine; */
  background: rgba(220, 225, 255, 0.3);
}
.ant-col-18 {
  /* background-color: aquamarine; */
  width: 531px
}
p {
  font-size: 16px;
  line-height: 64px;
}
</style>
