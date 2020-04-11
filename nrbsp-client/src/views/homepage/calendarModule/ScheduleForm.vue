<template>
  <a-form :form="scheduleForm" class="form">
    <a-row :gutter="16">
      <a-col :md="12">
        <a-form-item label="标题">
          <a-input
            placeholder="请填入标题"
            allowClear
            v-decorator="[
              'bt',
              {rules: [{ required: true, message: '请输入标题', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :md="12">
        <a-form-item label="位置">
          <a-input
            placeholder="请填入位置"
            allowClear
            v-decorator="[
              'wz',
              {rules: [{ required: false, message: '请输入位置'}]}
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :md="24" :sm="24">
        <a-form-item label="内容">
          <a-textarea
            placeholder="请输入日程内容"
            :autosize="{ minRows: 2, maxRows: 5 }"
            v-decorator="[
              'nr',
              {rules: [{ required: true, message: '请输入日程内容', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :md="12" :sm="24">
        <a-form-item label="开始时间">
          <a-date-picker
            showTime
            style="width: 100%"
            v-decorator="[
              'kssj',
              {rules: [{ required: true, message: '请选择开始时间'}]}
            ]"
          ></a-date-picker>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="结束时间">
          <a-date-picker
            showTime
            style="width: 100%"
            v-decorator="[
              'jssj',
              {rules: [{ required: false, message: '请选择结束时间'}]}
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :md="12" :sm="24">
        <a-form-item label="参与人">
          <a-input
            placeholder="请填入参与人"
            allowClear
            v-decorator="[
              'cyr',
              {rules: [{ required: false, message: '请输入参与人', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-form-item label="组织人">
          <a-input
            placeholder="请填入组织人"
            allowClear
            v-decorator="[
              'zzr',
              {rules: [{ required: false, message: '请输入组织人', whitespace: true}]}
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :md="6" :sm="24">
        <a-form-item label="是否公开">
          <a-radio-group @change="onChange" v-model="value">
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :md="9" :sm="24">
        <a-form-item label="指定部门">
          <a-input allowClear :disabled="disabled" v-model="zdbm" />
        </a-form-item>
      </a-col>
      <a-col :md="9" :sm="24">
        <a-form-item label="指定人员">
          <a-input allowClear :disabled="disabled" v-model="zdry" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :md="6" :sm="24">
        <a-form-item label="手机短信提醒">
          <a-radio-group @change="onChange1" v-model="value1">
            <a-radio value="1">不提醒</a-radio>
            <a-radio value="2">提醒</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :md="18" :sm="24">
        <a-form-item label="提醒时间">
          <a-date-picker :disabled="disabled1" showTime style="width: 100%" v-model="txsj" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-button style="width: 15%;margin-left: 20%;" type="primary" @click="handleSubmit">保存</a-button>
    <a-button style="width: 15%;margin-left: 20%;" type="primary" @click="handleCancel">取消</a-button>
  </a-form>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import { addDateCanlendar, updateDateCanlendar } from '@/api/calendar'
export default {
  data () {
    return {
      scheduleForm: this.$form.createForm(this),
      value: '1',
      value1: '1',
      disabled: true,
      disabled1: true,
      txsj: null,
      zdbm: null,
      zdry: null,
      id: null,
      scheduleInformation: {},
      schedule: {}
    }
  },
  methods: {
    handleSubmit (e) {
      this.scheduleForm.validateFields((err, values) => {
        if (!err) {
          this.saveForm()
          // 判断是提交还是保存
          if (this.id) {
            updateDateCanlendar(this.schedule).then(res => {
              if (res.success && res.code === 200) {
                this.$message.success('修改成功')
              } else {
                this.$message.error('失败')
              }
            })
          } else {
            addDateCanlendar(this.schedule).then(res => {
              if (res.success && res.code === 200) {
                this.$message.success('添加成功')
                this.$emit('redraw')
              } else {
                this.$message.error('失败')
              }
            })
          }
        }
      })
    },
    // 保存基础表中数据内容
    saveForm () {
      // 提交按钮，需要验证表单，并关闭弹窗 需要提交这里全部的信息
      this.scheduleInformation = this.scheduleForm.getFieldsValue()
      this.schedule = this.extendObject(this.schedule, this.scheduleInformation)
      this.schedule.sfgk = this.value
      this.schedule.sjdx = this.value1
      this.schedule.txsj = this.txsj
      this.schedule.zdbm = this.zdbm
      this.schedule.zdry = this.zdry
      if (this.schedule.kssj) {
        this.schedule.kssj = this.schedule.kssj.format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.schedule.jssj) {
        this.schedule.jssj = this.schedule.jssj.format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.schedule.txsj) {
        this.schedule.txsj = this.schedule.txsj.format('YYYY-MM-DD HH:mm:ss')
      }
      console.log(this.schedule)
    },
    // 显示基本表中内容
    showScheduleDetail (schedule) {
      this.schedule = schedule
      this.id = schedule.id
      this.value = String(this.schedule.sfgk)
      this.value1 = String(this.schedule.sjdx)
      if (this.value === '2') {
        this.disabled = false
      }
      if (this.value1 === '2') {
        this.disabled1 = false
      }
      this.zdbm = this.schedule.zdbm
      this.zdry = this.schedule.zdry
      if (this.schedule.jssj) {
        this.schedule.jssj = moment(this.schedule.jssj, 'YYYY-MM-DD HH:mm:ss')
      }
      if (this.schedule.kssj) {
        this.schedule.kssj = moment(this.schedule.kssj, 'YYYY-MM-DD HH:mm:ss')
      }
      if (this.schedule.txsj) {
        this.schedule.txsj = moment(this.schedule.txsj, 'YYYY-MM-DD HH:mm:ss')
        this.txsj = this.schedule.txsj
      }
      this.$nextTick(() => {
        this.scheduleForm.setFieldsValue(
          pick(this.schedule, 'bt', 'nr', 'wz', 'kssj', 'jssj', 'cyr', 'zzr', 'zdbm', 'zdry')
        )
      })
    },
    onChange (e) {
      this.value = e.target.value
      if (this.value === '1') {
        this.disabled = true
        this.zdbm = null
        this.zdry = null
      } else {
        this.disabled = false
      }
    },
    onChange1 (e) {
      this.value1 = e.target.value
      if (this.value1 === '1') {
        this.disabled1 = true
        this.txsj = null
      } else {
        this.disabled1 = false
      }
    },
    handleCancel () {
      this.$emit('cancel')
      this.$emit('tabsHome')
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
</style>
