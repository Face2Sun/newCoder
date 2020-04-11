<template>
  <a-modal
    :title="modalText"
    :destroyOnClose="true"
    :visible="visible"
    :width="700"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :afterClose="afterClose"
    :footer="null"
  >
    <a-form :form="formModal" class="form">
      <a-row class="form-row" :gutter="16">
        <a-col :md="24" :sm="24">
          <a-form-item label="批次名称">
            <a-input
              placeholder="请输入批次名称"
              v-decorator="[
                'pcmc',
                {rules: [{ required: true, message: '请输入批次名称', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :md="12" :sm="24">
          <a-form-item label="报建类型">
            <a-select v-model="selectValue">
              <a-select-option value="1">批次用地</a-select-option>
              <a-select-option value="2">单独选择</a-select-option>
              <a-select-option value="99">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="使用指标（公顷）">
            <a-input
              placeholder="请输入使用指标"
              v-decorator="[
                'syzb',
                {rules: [{ required: true, message: '请输入使用指标', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :md="12" :sm="24">
          <a-form-item label="报建状态">
            <a-input
              placeholder="请输入报建状态"
              v-decorator="[
                'bjzt',
                {rules: [{ required: true, message: '请输入报建状态', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="批复时间">
            <a-date-picker
              style="width: 100%"
              v-decorator="[
                'pfsj',
                {rules: [{ required: false, message: '请输入批复时间'}]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :md="12" :sm="24">
          <a-form-item label="省批复文号">
            <a-input
              placeholder="请输入省批复文号"
              v-decorator="[
                'spfwh',
                {rules: [{ required: true, message: '请输入省批复文号', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="部批复文号">
            <a-input
              placeholder="请输入部批复文号"
              v-decorator="[
                'bpfwh',
                {rules: [{ required: true, message: '请输入部批复文号', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col :md="12" :sm="24">
          <a-form-item label="区域">
            <a-input
              placeholder="请输入区域"
              v-decorator="[
                'qy',
                {rules: [{ required: true, message: '请输入区域', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="土地面积">
            <a-input
              placeholder="请输入土地面积"
              v-decorator="[
                'tdmj',
                {rules: [{ required: true, message: '请输入土地面积', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item style="margin-left: 25%">
        <a-button
          v-if="show"
          style="width: 20%"
          htmlType="submit"
          type="primary"
          @click="handleSubmit"
        >保存</a-button>
        <a-button
          v-if="show"
          style="width: 20%;margin-left: 20%;"
          type="primary"
          @click="handleCancel"
        >取消</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import {
  upIndicators,
  upTdzzAreaIndicatorsDetail,
  addIndicators,
  addTdzzAreaIndicatorsDetail,
  getDetailByIndicatorsID
} from '@/api/indicator'
import pick from 'lodash.pick'
import moment from 'moment'
export default {
  data () {
    return {
      modalText: '',
      visible: false,
      selectValue: '1',
      id: '',
      show: true,
      formData: {},
      formInformation: {},
      areaIndicators: {},
      formModal: this.$form.createForm(this)
    }
  },
  methods: {
    showModal (text) {
      this.visible = true
      this.modalText = text
      this.id = ''
    },
    handleSubmit (e) {
      // 提交按钮，需要验证表单，并关闭弹窗 需要提交这里全部的信息
      this.formInformation = this.formModal.getFieldsValue()
      this.formData = this.extendObject(this.formData, this.formInformation)
      this.formData.bjlx = this.selectValue
      if (this.formData.pfsj) {
        this.formData.pfsj = this.formData.pfsj.format('YYYY-MM-DD')
      }
      this.areaIndicators.qy = this.formData.qy
      this.areaIndicators.tdmj = this.formData.tdmj
      // 要判断是新建的保存还是编辑的保存
      if (this.id) {
        this.formData.id = this.id
        upIndicators(this.formData).then(res => { })
        this.areaIndicators.indicatorsId = this.id
        upTdzzAreaIndicatorsDetail(this.areaIndicators).then(res => {
          if (res.success && res.code === 200) {
            this.$message.success('修改成功')
            this.$emit('loadData')
            this.visible = false
          }
        })
      } else {
        addIndicators(this.formData).then(res => {
          if (res.success && res.code === 200) {
            this.id = res.data.id
            console.log(res.data.id)
            this.areaIndicators.indicatorsId = this.id
            addTdzzAreaIndicatorsDetail(this.areaIndicators).then(res => {
              if (res.success && res.code === 200) {
                this.$message.success('添加成功')
                this.$emit('loadData')
                this.visible = false
              }
            })
          }
        })
      }
    },
    showData (record) {
      this.$nextTick(() => {
        getDetailByIndicatorsID(record.id).then(res => {
          if (res.success && res.code === 200) {
            this.formInformation = record
            this.formInformation.tdmj = res.data.tdmj
            if (this.formInformation.pfsj) {
              this.formInformation.pfsj = moment(this.formInformation.pfsj, 'YYYY-MM-DD HH:mm:ss')
            }
            // console.log('this.formInformation:::::::::::::::')
            // console.log(this.formInformation)
            this.selectValue = record.bjlx
            this.formModal.setFieldsValue(
              pick(this.formInformation, 'pcmc', 'syzb', 'bjzt', 'pfsj', 'spfwh', 'bpfwh', 'qy', 'tdmj')
            )
            this.id = record.id
          }
        })
      })
    },
    // 对象深拷贝方法
    extendObject (target, source) {
      for (var obj in source) {
        target[obj] = source[obj]
      }
      return target
    },
    handleCancel () {
      this.visible = false
    },
    afterClose () {
      this.show = true
    }
  }
}
</script>
