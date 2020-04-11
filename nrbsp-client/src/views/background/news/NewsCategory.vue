<template>
  <a-card :bordered="false">
    <div class="clearfix">
      <a-form layout="inline" class="fl">
        <a-form-item label="分类名称">
          <a-input placeholder="请输入分类" v-model="parameter.flmc" />
        </a-form-item>
        <a-button type="primary" style="margin-top: 3px;" @click="searchQuery" icon="search">查询</a-button>
      </a-form>
      <a-button class="add-class fl" @click="addClass" type="primary" icon="plus">添加一级类</a-button>
    </div>
    <a-table bordered style="width:80%" :columns="columns" :dataSource="navDatas" :loading="loading">
      <span slot="flmc" slot-scope="text, record">
        <span v-if="record.children"><a-icon type="home" />&nbsp;{{ record.flmc }}</span>
        <span v-else><a-icon type="user" />&nbsp;{{ record.flmc }}</span>
      </span>
      <span slot="operation" slot-scope="text, record">
        <a-button type="primary" icon="plus" @click="handleAdd(record)">添加子类</a-button>
        <a-divider type="vertical" />
        <a-button @click="handleEdit(record)">修改</a-button>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
          <a-button type="danger">删除(含子类)</a-button>
        </a-popconfirm>
      </span>
    </a-table>
    <a-modal
      :title="title"
      :visible="visible"
      :destroyOnClose="true"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading1" @click="handleOk">确定</a-button>
      </template>
      <a-form :form="classForm">
        <a-row :gutter="16">
          <a-col :md="12">
            <a-form-item label="分类名称">
              <a-input
                placeholder="请输入分类名称"
                v-decorator="[
                  'flmc',
                  {rules: [{ required: true, message: '请输入分类名称', whitespace: true}]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12">
            <a-form-item label="排序号">
              <a-input-number
                :min="0"
                :max="2147483647"
                style="width:228px"
                placeholder="请输入排序号"
                v-decorator="[
                  'pxh',
                  {rules: [{ required: true, message: '只能为大于0的数字'}]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import pick from 'lodash.pick'
import { findAll, deleteInformationById, updateInformation, addSecond, addFirst } from '@/api/programa'
export default {
  data () {
    return {
      classForm: this.$form.createForm(this),
      columns: [
        {
          title: '分类名称',
          dataIndex: 'flmc',
          width: '20%',
          scopedSlots: { customRender: 'flmc' }
        },
        {
          title: '排序号',
          dataIndex: 'key',
          align: 'center',
          width: '10%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: '30%',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      loading: false,
      loading1: false,
      navDatas: [],
      visible: false,
      title: '添加一级类',
      id: null,
      parentid: null,
      classInformation: {},
      parameter: {
        flmc: null,
        pageNo: 1,
        pageSize: 100
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.loading = true
      this.navDatas = []
      findAll(this.parameter).then(res => {
        if (res.success) {
          var list = res.data.list
          var primary = {}
          var secondary = {}
          for (let i = 0; i < list.length; i++) {
            if (!list[i].parentid) {
              primary.id = list[i].id
              primary.flmc = list[i].flmc
              primary.pxh = list[i].pxh
              primary.key = list[i].pxh
              this.navDatas.push(primary)
              primary = {}
            }
          }
          for (let i = 0; i < list.length; i++) {
            if (list[i].parentid) {
              secondary.flmc = list[i].flmc
              secondary.id = list[i].id
              secondary.parentid = list[i].parentid
              secondary.pxh = list[i].pxh
              secondary.key = list[i].pxh
              if (this.navDatas.length) {
                for (let j = 0; j < this.navDatas.length; j++) {
                  if (secondary.parentid === this.navDatas[j].id) {
                    if (!this.navDatas[j].hasOwnProperty('children')) {
                      this.navDatas[j].children = []
                    }
                    this.navDatas[j].children.push(secondary)
                    secondary = {}
                  }
                }
              } else {
                this.navDatas.push(secondary)
              }
            }
          }
        } else {
          this.$error({ title: res.message })
        }
        this.loading = false
      })
    },
    handleOk () {
      this.loading1 = true
      this.classForm.validateFields((err, values) => {
        if (!err) {
          this.classInformation = this.classForm.getFieldsValue()
          console.log(this.classInformation)
          // 判断是修改还是保存
          if (this.id) {
            if (this.parentid) {
              this.classInformation.parentid = this.parentid
            }
            this.classInformation.id = this.id
            updateInformation(this.classInformation).then(res => {
              if (res.success && res.code === 200) {
                this.successCallback('修改成功')
              } else {
                this.loading1 = false
                this.$error({ title: res.message })
              }
            })
          } else {
            if (this.parentid) {
              this.classInformation.parentid = this.parentid
              addSecond(this.classInformation).then(res => {
                if (res.success && res.code === 200) {
                  this.successCallback('添加成功')
                } else {
                  this.loading1 = false
                  this.$error({ title: res.message })
                }
              })
            } else {
              addFirst(this.classInformation).then(res => {
                if (res.success && res.code === 200) {
                  this.successCallback('添加成功')
                } else {
                  this.loading1 = false
                  this.$error({ title: res.message })
                }
              })
            }
          }
        }
      })
    },
    successCallback (text) {
      this.$message.success(text)
      this.loading1 = false
      this.handleCancel()
      this.loadData()
    },
    handleCancel () {
      this.visible = false
      this.parentid = null
      this.id = null
    },
    // 查询类
    searchQuery () {
      this.loadData()
    },
    // 添加一级类
    addClass () {
      this.visible = true
      this.title = '添加一级类'
    },
    // 添加子类
    handleAdd (record) {
      console.log(record)
      if (record.parentid) {
        this.$warning({
          title: '子类禁止添加子类'
        })
      } else {
        this.title = '添加子类'
        this.parentid = record.id
        this.visible = true
      }
      console.log(this.parentid)
    },
    // 修改类
    handleEdit (record) {
      if (record.parentid) {
        this.parentid = record.parentid
      }
      this.id = record.id
      this.visible = true
      this.title = '修改类'
      this.showClassData(record)
    },
    // 将显示在表中
    showClassData (record) {
      this.$nextTick(() => {
        this.classForm.setFieldsValue(
          pick(record, 'flmc', 'pxh')
        )
      })
    },
    // 删除类
    handleDelete (key) {
      deleteInformationById(key).then(res => {
        if (res.success && res.code === 200) {
          this.$message.success('删除成功')
          this.loadData()
        }
      })
    }
  }
}
</script>
<style scoped>
/*公共样式*/
/*浮动与清除浮动*/
.clearfix:after {
  content: "";
  display: block;
  clear: both;
  height: 0;
  line-height: 0;
  visibility: hidden;
}
.clearfix {
  zoom: 1;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.add-class {
  margin: 3px 0 20px 50px;
}
</style>
