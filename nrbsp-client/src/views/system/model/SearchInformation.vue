<template>
  <div>
    <a-card :bordered="false">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="10" :sm="8">
            <div class="table-operator" style="border-top: 5px;margin-bottom: 16px">
              <a-button v-if="show" @click="handleAdd" type="primary" icon="plus">添加巡查</a-button>
            </div>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item label="巡查时间">
              <a-range-picker @change="onChange" />
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="8" style="margin-top: 4px;">
            <span style="margin-left: -40px;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        ref="table"
        rowKey="key"
        bordered
        size="middle"
        style="margin-top: 20px;"
        :columns="columns"
        :dataSource="searchDataSource"
        :pagination="ipagination"
        :loading="loading"
      >
        <span slot="key" slot-scope="text, record, index">
          <span>{{ index+1 }}</span>
        </span>
        <span slot="xcrq" slot-scope="xcrq">
          <span v-if="xcrq == null"></span>
          <span v-if="xcrq != null">{{ xcrq.split("T")[0] }}</span>
        </span>
        <span slot="operation" slot-scope="text, record">
          <a v-if="show" @click="handleEdit(record)">修改</a>
          <a v-if="!show" @click="handleDetail(record)">详情</a>
          <a-divider v-if="show" type="vertical" />
          <a-popconfirm v-if="show" title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <a-modal
        :title="titleText"
        :visible="visibleModal"
        :width="600"
        :destroyOnClose="true"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        :footer="null"
      >
        <a-form :form="formModal" class="form">
          <a-row class="form-row" :gutter="16">
            <a-col :md="12" :sm="24">
              <a-form-item label="巡查人员">
                <a-input
                  placeholder="请输入巡查人员"
                  v-decorator="[
                    'xcry',
                    {rules: [{ required: true, message: '请输入巡查人员', whitespace: true}]}
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="巡查日期">
                <a-date-picker
                  style="width: 100%"
                  v-decorator="['xcrq',
                                {rules: [{ required: true, message: '请输入巡查日期'}]}
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :md="24" :sm="24">
              <a-form-item label="巡查结果">
                <a-textarea
                  placeholder="请输入巡查结果"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  v-decorator="[
                    'xcjg',
                    {rules: [{ required: true, message: '请输入巡查结果', whitespace: true}]}
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :md="24" :sm="24">
              <a-form-item label="备注">
                <a-textarea
                  placeholder="请输入配注"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  v-decorator="[
                    'bz'
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item v-if="show" style="margin-left: 25%">
            <a-button style="width: 20%" htmlType="submit" type="primary" @click="handleSubmit">保存</a-button>
            <a-button style="width: 20%;margin-left: 20%;" type="primary" @click="handleCancel">取消</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'

import { findPatrolById, deletePatrolById, updateProjectPatrol, addPatrol } from '@/api/projects.js'
export default {
  name: 'SearchInformation',
  data () {
    return {
      searchDataSource: [],
      columns: [
        {
          title: '序号',
          dataIndex: this.key,
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'key' }
        },
        {
          title: '巡查结果',
          dataIndex: 'xcjg',
          align: 'center',
          width: '20%'
        },
        {
          title: '巡查人员',
          dataIndex: 'xcry',
          align: 'center',
          width: '20%'
        },
        {
          title: '时间',
          dataIndex: 'xcrq',
          scopedSlots: { customRender: 'xcrq' },
          align: 'center',
          width: '10%'
        },
        {
          title: '备注',
          dataIndex: 'bz',
          align: 'center',
          width: '20%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: '10%'
        }
      ],
      key: 0,
      selectedRowKeys: [],
      Parameters: {
        beginDay: null,
        endDay: null,
        pageNo: 1,
        pageSize: 100,
        projectId: ''
      },
      show: true,
      formData: {},
      loading: false,
      value: [],
      visibleModal: false,
      ipagination: true,
      titleText: '',
      confirmLoading: false,
      searchId: '',
      formModal: this.$form.createForm(this)
    }
  },
  methods: {
    showSearchData (searchParameters) {
      this.Parameters.projectId = searchParameters.projectId
      this.loading = true // 出现加载圈圈
      findPatrolById(searchParameters).then(res => {
        if (res.success && res.code === 200) {
          console.log(res)
          console.log(searchParameters)
          this.searchDataSource = res.data.list
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    onChange (date, dateString) {
      console.log(date)
      console.log(dateString)
      this.Parameters.beginDay = dateString[0]
      this.Parameters.endDay = dateString[1]
      console.log(this.Parameters)
    },
    searchQuery () {
      this.showSearchData(this.Parameters)
    },
    handleAdd () {
      this.visibleModal = true
      this.titleText = '新建巡查'
      this.searchId = ''
    },
    handleEdit (record) {
      // 点击编辑按钮弹出详细信息表单
      this.titleText = '修改巡查'
      this.visibleModal = true
      this.showData(record)
    },
    handleDetail (record) {
      this.titleText = '巡查详情'
      this.visibleModal = true
      this.showData(record)
    },
    handleDelete (id) {
      deletePatrolById(id).then(res => {
        if (res.success && res.code === 200) {
          this.$message.success('删除成功')
          this.showSearchData(this.Parameters)
        }
      })
    },
    handleSubmit (e) {
      console.log(this.formModal.getFieldsValue())
      this.formData = this.formModal.getFieldsValue()
      this.formData.xcrq = this.formData.xcrq.format('YYYY-MM-DD')
      this.formData.projectId = this.Parameters.projectId
      console.log(this.formData)
      // 根据是否有id判断是新增或修改
      if (this.searchId) {
        // 修改
        this.formData.id = this.searchId
        updateProjectPatrol(this.formData).then(res => {
          if (res.success && res.code === 200) {
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败')
          }
        })
      } else {
        // 新增
        addPatrol(this.formData).then(res => {
          if (res.success && res.code === 200) {
            this.$message.success('添加成功')
          } else {
            this.$message.error('添加失败')
          }
        })
      }
      this.visibleModal = false
      setTimeout(() => {
        this.showSearchData(this.Parameters)
      }, 500)
    },
    handleCancel (e) {
      this.visibleModal = false
    },
    showData (record) {
      this.$nextTick(() => {
        this.formModal.setFieldsValue({
          xcry: record.xcry,
          xcrq: moment(record.xcrq, 'YYYY-MM-DD'),
          xcjg: record.xcjg,
          bz: record.bz
        })
      })
      this.searchId = record.id
    }
  }
}
</script>

<style>
</style>
