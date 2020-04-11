<template>
  <div>
    <a-form :form="basicForm" class="form">
      <a-row type="flex">
        <a-col :span="6" :order="4">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'bslx',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="3"><p>办件类型</p></a-col>
        <a-col :span="6" :order="2">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'sxlx',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="1"><p>事项类型</p></a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="6" :order="4">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'sszt',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="3"><p>实施主体</p></a-col>
        <a-col :span="6" :order="2">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'xscj',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="1"><p>行使层级</p></a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="6" :order="4">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'cnbjsx',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="3"><p>承诺办结时限</p></a-col>
        <a-col :span="6" :order="2">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'fdbjsx',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="1"><p>法定办结时限</p></a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="6" :order="4">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'sfsf',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="3"><p>是否收费</p></a-col>
        <a-col :span="6" :order="2">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'bscs',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="1"><p>到办事现场次数</p></a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="18" :order="2">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'zxfs',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="1"><p>咨询方式</p></a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="18" :order="2">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'jdtsfs',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="1"><p>监督投诉方式</p></a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="18" :order="2">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'blsj',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="1"><p>办理时间</p></a-col>
      </a-row>
      <a-row type="flex">
        <a-col :span="18" :order="2">
          <a-form-item>
            <a-input
              placeholder="请填入内容"
              allowClear
              v-decorator="[
                'bldd',
                {rules: [{ required: false, message: '请输入内容'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6" :order="1"><p>办理地点</p></a-col>
      </a-row>
    </a-form>
    <!-- <a-button @click="saveBasic">保存修改</a-button> -->
  </div>
</template>

<script>
import { findXzsxJbxxListByBsznid, updateXzsxJbxx, addXzsxJbxx } from '@/api/businessGuide'
import pick from 'lodash.pick'

export default {
  name: 'BasicMaintain',
  data () {
    return {
      basicForm: this.$form.createForm(this),
      loading: false,
      basicId: '',
      jbxxid: null,
      basicData: {},
      jbxxData: {},
      basic: {},
      basicInfaomation: {}
    }
  },
  methods: {
    showData (value) {
      this.loading = true
      this.basic = value
      // 'c382e3e27e7e4728b388b48a38539a27'
      // console.log('传到基本信息的参数：' + value)
      this.basicId = value
      findXzsxJbxxListByBsznid(this.basicId).then(res => {
        if (res.success) {
          this.basicData = res.data
          // console.log('基本信息数据：', this.basicData)
          if (this.basicData !== null) {
            this.jbxxid = res.data.jbxxid
            // console.log('jbxxid:', this.jbxxid)
          }
          this.jbxxData = this.basicData
          this.loading = false
          this.basicForm.setFieldsValue(
            pick(this.jbxxData, 'sxlx', 'bslx', 'sszt', 'xscj', 'cnbjsx', 'fdbjsx',
              'sfsf', 'zxfs', 'jdtsfs', 'blsj', 'bldd', 'bscs')
          )
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    // 保存表单内容判断修改还是添加
    saveBasic () {
      this.basicForm.validateFields((err, values) => {
        if (!err) {
          if (!this.jbxxid) {
            console.log('添加')
            const bsznid = { bsznid: this.basicId }
            const addForm = Object.assign(values, bsznid)
            addXzsxJbxx(addForm).then(res => {
              if (res.success && res.code === 200) {
                this.$message.success('添加成功')
                this.showData(this.basicId)
              } else {
                this.$message.error('添加失败')
              }
            })
          } else {
            console.log('修改')
            const modalForm = Object.assign(this.basicData, values)
            updateXzsxJbxx(modalForm).then(res => {
              if (res.success && res.code === 200) {
                this.$message.success('基本信息修改成功')
                this.showData(this.basicId)
              } else {
                this.$message.error('修改失败')
              }
            })
          }
          this.visible = false
        }
      })
    },
    saveBasicForm () {
      this.basicInfaomation = this.basicForm.getFieldsValue()
      this.basicData = this.extendObject(this.basicData, this.basicInfaomation)
      // console.log('表单数据：', this.basicInfaomation)
      // console.log('传出数据', this.basicData)
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
.ant-col-6,.ant-col-18 {
  height: 50px;
  width: 177px;
  text-align: center;
  border: 1px solid rgba(220, 220,220, 0.5)
}
.ant-col-order-1,.ant-col-order-3 {
  background: rgba(220, 225, 255, 0.3);
}
.ant-col-18 {
  width: 531px
}
p {
  font-size: 16px;
  line-height: 64px;
}
</style>
