<template>
  <div>
    <a-alert v-if="show" showIcon message="Error" description="请完整填写信息" type="error" />
    <a-card class="card" title="项目信息" :bordered="false">
      <a-form :form="basicForm" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="项目编号">
              <a-input
                placeholder="请输入项目编号"
                v-decorator="[
                  'xmbh',
                  {rules: [{ required: true, message: '请输入项目编号', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item label="项目名称">
              <a-input
                placeholder="请输入项目名称"
                v-decorator="[
                  'xmmc',
                  {rules: [{ required: true, message: '请输入项目名称', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item label="项目类型">
              <a-select placeholder="请选择项目类型" v-model="selectValue">
                <a-select-option value="1">占补平衡</a-select-option>
                <a-select-option value="2">工矿废弃</a-select-option>
                <a-select-option value="3">增减挂钩</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="项目位置">
              <a-input
                placeholder="请输入项目位置"
                v-decorator="[
                  'tdzl',
                  {rules: [{ required: true, message: '请输入项目位置', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item label="项目规模">
              <a-input
                placeholder="请输入项目规模"
                v-decorator="[
                  'xmgm',
                  {rules: [{ required: true, message: '请输入项目规模'},{validator: xmgmValidate}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item label="项目总投资">
              <a-input
                placeholder="请输入项目总投资"
                v-decorator="[
                  'xmztz',
                  {rules: [{ required: true, message: '请输入项目总投资'},{validator: xmgmValidate}]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="批复日期">
              <a-date-picker
                style="width: 100%"
                v-decorator="[
                  'pfrq',
                  {rules: [{ required: true, message: '请输入批复日期'}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item label="验收日期">
              <a-date-picker
                style="width: 100%"
                v-decorator="[
                  'ysrq',
                  {rules: [{ required: true, message: '请输入验收日期'}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item label="验收文号">
              <a-input
                placeholder="请输入验收文号"
                v-decorator="[
                  'yswh',
                  {rules: [{ required: true, message: '请输入验收文号', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card class="card" title="单位信息" :bordered="false">
      <a-form :form="basicForm" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="实施单位">
              <a-input
                placeholder="请输入实施单位"
                v-decorator="[
                  'ssdw',
                  {rules: [{ required: true, message: '请输入实施单位', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item label="联系人">
              <a-input
                placeholder="请输入联系人"
                v-decorator="[
                  'ssdwlxr',
                  {rules: [{ required: true, message: '请输入联系人', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item label="联系电话">
              <a-input
                placeholder="请输入联系电话"
                v-decorator="[
                  'ssdwlxdh',
                  {rules: [{ required: true, message: '请输入联系电话', whitespace: true},{validator: sjhValidate}]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="监督单位">
              <a-input
                placeholder="请输入监督单位"
                v-decorator="[
                  'jldw',
                  {rules: [{ required: true, message: '请输入监督单位', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item label="联系人">
              <a-input
                placeholder="请输入联系人"
                v-decorator="[
                  'jldwlxr',
                  {rules: [{ required: true, message: '请输入联系人', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item label="联系电话">
              <a-input
                placeholder="请输入联系电话"
                v-decorator="[
                  'jldwlxdh',
                  {rules: [{ required: true, message: '请输入联系电话', whitespace: true},{validator: sjhValidate}]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'BasicMessage',
  data () {
    return {
      basicForm: this.$form.createForm(this),
      selectValue: '1',
      show: false
    }
  },
  methods: {
    onClose (e) {
      console.log(e, 'I was closed.')
    },
    handleValidation (e) {
      // e.preventDefault()
      this.basicForm.validateFields((err, values) => {
        if (err) {
          this.show = true
        } else {
          this.show = false
        }
      })
      return this.show
    },
    xmgmValidate (rule, value, callback) {
      const regex = /^\d+$|^\d+[.]?\d+$/
      if (!regex.test(value)) {
        callback(new Error('只能输入数字'))
      }
      callback()
    },
    sjhValidate (rule, value, callback) {
      const regex = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if (!regex.test(value)) {
        callback(new Error('不符合手机号规范'))
      }
      callback()
    },
    setSelect (value) {
      this.selectValue = value
    },
    getSelect () {
      return this.selectValue
    }
  }
}
</script>

<style>
</style>
