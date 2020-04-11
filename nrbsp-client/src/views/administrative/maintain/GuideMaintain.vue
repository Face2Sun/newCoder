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
              <basic-maintain ref="basicMaintain"></basic-maintain>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="办理流程" key="2">
            <div id="size">
              <img :src="bllc">
            </div>
          </a-tab-pane>
          <a-tab-pane tab="办理材料目录" key="3" forceRender>
            <div id="size">
              <materials-maintain ref="materialsMaintain"></materials-maintain>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="受理条件" key="4">
            <div id="size">
              <a-textarea
                placeholder="请输入受理条件"
                v-model="sltj"
                :rows="4" />
            </div>
          </a-tab-pane>
          <a-tab-pane tab="收费标准" key="5">
            <div id="size">
              <a-textarea
                placeholder="请输入收费标准"
                v-model="sfbz"
                :rows="4"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane tab="设定依据" key="6">
            <div id="size" style="pre-style">
              <a-textarea
                placeholder="请输入设定依据"
                v-model="sdyj"
                :rows="4"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane tab="常见问题" key="7">
            <div id="size">
              <a-textarea
                placeholder="请输入常见问题"
                v-model="cjwt"
                :rows="4"
              />
            </div>
          </a-tab-pane>
        </a-tabs>
        <a-row>
          <a-col :span="24" :style="{ textAlign: 'center',margin: '50px 10px' }">
            <a-button type="primary" @click="handleSubmit()">保存修改</a-button>
            <a-button :style="{ marginLeft: '8px'}" @click="onClose">关闭</a-button>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>
import BasicMaintain from './BasicMaintain'
import MaterialsMaintain from './MaterialsMaintain'
import EditableCell from './EditableCell'

import { findXzsxBsznByBsznid, updateXzsxBszn } from '@/api/businessGuide'

export default {
  name: 'WorkGuide',
  components: {
    BasicMaintain,
    MaterialsMaintain,
    EditableCell
  },
  data () {
    return {
      visible: false,
      loading: false,
      tabPosition: 'left',
      placement: 'left',
      basic: {},
      formInformation: {},
      setForm: {},
      textData: {},
      bsznid: '',
      bllc: '',
      sltj: '',
      sfbz: '',
      sdyj: '',
      cjwt: ''
    }
  },
  methods: {
    showModel () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    loadData (record) {
      this.loading = true // 加载数据
      // 'c382e3e27e7e4728b388b48a38539a27'
      console.log('传给办事指南的值', record)
      findXzsxBsznByBsznid(record).then(res => {
        if (res.success) {
          // console.log('办事指南获取的参数' + res)
          this.basic = res.data
          this.setForm = this.extendObject(this.setForm, this.basic)
          console.log('办事指南获取的参数', this.basic)
          this.bllc = this.setForm.bllc
          this.sltj = this.setForm.sltj
          this.sfbz = this.setForm.sfbz
          this.sdyj = this.setForm.sdyj
          this.cjwt = this.setForm.cjwt
          // this.bsznid = res.data.bsznid
          this.$refs.basicMaintain.showData(this.basic.bsznid)
          this.$refs.materialsMaintain.loadData(this.basic.bsznid)
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    changeGuideInfo () {
      this.saveText()
      this.loading = true // 加载数据
      // 'c382e3e27e7e4728b388b48a38539a27'
      updateXzsxBszn(this.textData).then(res => {
        if (res.success) {
          this.$message.success('信息修改成功')
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    saveText () {
      this.setForm.sltj = this.sltj
      this.setForm.sfbz = this.sfbz
      this.setForm.sdyj = this.sdyj
      this.setForm.cjwt = this.cjwt
      this.textData = this.setForm
      return this.textData
    },
    handleSubmit () {
      this.$nextTick(() => {
        console.log(this.$refs.basicMaintain.saveBasic())
        this.$refs.basicMaintain.saveBasic()
      // this.$refs.materialsMaintain.saveBasic()
      })
      this.changeGuideInfo()
    },
    // 对象深拷贝方法
    extendObject (target, source) {
      for (var obj in source) {
        target[obj] = source[obj]
      }
      return target
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
