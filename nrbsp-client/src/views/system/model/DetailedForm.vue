<template>
  <a-modal
    :maskClosable="false"
    :visible="visible"
    :afterClose="afterClose"
    :destroyOnClose="destroy"
    :width="1000"
    @cancel="handleCancel"
    :footer="null"
  >
    <div>
      <a-tabs @change="callback" :activeKey="activeKey">
        <a-tab-pane tab="项目基本信息" key="1">
          <basic-message ref="basicMessage"></basic-message>
        </a-tab-pane>
        <a-tab-pane tab="财务决算信息" key="2" forceRender>
          <financial-statements ref="financialStatements"></financial-statements>
        </a-tab-pane>
        <a-tab-pane tab="附件材料" key="3">
          <appurtenant-material ref="appurtenantMaterial"></appurtenant-material>
        </a-tab-pane>
        <a-tab-pane tab="巡查信息" key="4">
          <search-information ref="searchInformation"></search-information>
        </a-tab-pane>
        <a-tab-pane tab="地图" key="5">
          <map-selection ref="mapSelection"></map-selection>
        </a-tab-pane>
        <a-button
          type="primary"
          ghost
          @click="handleSave"
          html-type="submit"
          slot="tabBarExtraContent"
          style="margin-right: 50px;"
          v-if="show"
        >保存</a-button>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import BasicMessage from './BasicMessage'
import FinancialStatements from './FinancialStatements'
import AppurtenantMaterial from './AppurtenantMaterial'
import SearchInformation from './SearchInformation'
import MapSelection from './MapSelection.vue'
import { updateProjectInfo, addProject, findById, findFinancialById, updateProjectFinancial, addFinancial } from '@/api/projects'

export default {
  name: 'DetailedForm',
  components: {
    BasicMessage,
    FinancialStatements,
    AppurtenantMaterial,
    SearchInformation,
    MapSelection
  },
  data () {
    return {
      visible: false,
      destroy: false,
      show: true,
      validation: false,
      projectId: '',
      financialId: '',
      activeKey: '1',
      searchParameters: {
        beginDay: null,
        endDay: null,
        pageNo: 1,
        pageSize: 100,
        projectId: ''
      },
      basic: {},
      financial: {},
      appurtenant: {},
      search: {},
      map: {},
      basicInformation: {},
      financialInformation: {}
    }
  },

  methods: {
    // 弹出模块框
    showModal (source) {
      this.visible = true
      this.destroy = true
      this.projectId = ''
      this.financialId = ''
      this.activeKey = '1'
      if (source === 'btn') {
        this.show = false
      }
    },
    // 点击取消
    handleCancel (e) {
      this.visible = false
    },
    afterClose () {
      this.show = true
    },
    // 点击保存按钮
    handleSave (e) {
      this.saveProject(e)
      if (this.validation) { return }
      if (this.projectId) {
        this.saveFinancial()
      }
    },
    // 调用保存项目接口
    saveProject (e) {
      this.saveBasicForm(e)
      if (this.validation) { return }
      // 要判断是新建的保存还是编辑的保存
      if (this.projectId) {
        this.basic.id = this.projectId
        updateProjectInfo(this.basic).then(res => {
          if (res.success && res.code === 200) {
            this.$message.success('保存成功')
            this.$emit('loadData')
          } else {
            this.$message.error('失败')
          }
        })
      } else {
        addProject(this.basic).then(res => {
          if (res.success && res.code === 200) {
            this.$message.success('添加成功')
            this.projectId = res.data.id
            this.$emit('loadData')
          } else {
            this.$message.error('失败')
          }
        })
      }
    },
    // 保存基础表中数据内容
    saveBasicForm (e) {
      // 提交按钮，需要验证表单，并关闭弹窗 需要提交这里全部的信息
      this.validation = this.$refs.basicMessage.handleValidation(e)
      if (this.validation) { return }
      this.basicInformation = this.$refs.basicMessage.basicForm.getFieldsValue()
      this.basic = this.extendObject(this.basic, this.basicInformation)
      this.basic.xmlx = this.$refs.basicMessage.getSelect()
      this.basic.xmzt = '1'
      if (this.basic.pfrq) {
        this.basic.pfrq = this.basic.pfrq.format('YYYY-MM-DD')
      }
      if (this.basic.ysrq) {
        this.basic.ysrq = this.basic.ysrq.format('YYYY-MM-DD')
      }
      console.log(this.basic)
    },
    // 将查询的结果显示在基本信息表中
    showBasicData (record) {
      this.$nextTick(() => {
        findById(record.id).then(res => {
          if (res.success && res.code === 200) {
            this.basic = res.data
            this.$refs.basicMessage.setSelect(this.basic.xmlx)
            if (this.basic.pfrq) {
              this.basic.pfrq = moment(this.basic.pfrq, 'YYYY-MM-DD HH:mm:ss')
            }
            if (this.basic.ysrq) {
              this.basic.ysrq = moment(this.basic.ysrq, 'YYYY-MM-DD HH:mm:ss')
            }
            this.$refs.basicMessage.basicForm.setFieldsValue(
              pick(this.basic, 'xmbh', 'xmmc', 'tdzl', 'xmgm', 'xmztz', 'pfrq',
                'ysrq', 'yswh', 'ssdw', 'ssdwlxr', 'ssdwlxdh', 'jldw', 'jldwlxr', 'jldwlxdh')
            )
            this.projectId = this.basic.id
          } else {
            this.$message.error('失败')
          }
        }
        )
      })
    },
    // 调用保存项目决算财务信息接口
    saveFinancial (e) {
      // 提交按钮，需要验证表单，并关闭弹窗 需要提交这里全部的信息
      this.saveFinancialForm(e)
      // 要判断是新建的保存还是编辑的保存
      if (this.financialId) {
        this.financial.id = this.financialId
        updateProjectFinancial(this.financial).then(res => {
          if (res.success && res.code === 200) {
          } else {
            this.$message.error('失败')
          }
        })
      } else {
        this.financial.projectId = this.projectId
        addFinancial(this.financial).then(res => {
          if (res.success && res.code === 200) {
            this.financialId = res.data.id
            this.$emit('loadData')
          } else {
            this.$message.error('失败')
          }
        })
      }
    },
    // 保存决算财务表中数据内容
    saveFinancialForm (e) {
      this.financialInformation = this.$refs.financialStatements.financialForm.getFieldsValue()
      this.financial = this.extendObject(this.financial, this.financialInformation)
      console.log(this.financial)
    },
    // 将查询的结果显示在决算财务表中
    showFinancialData () {
      this.$nextTick(() => {
        findFinancialById(this.projectId).then(res => {
          if (res.success && res.code === 200) {
            if (res.data) {
              this.financial = res.data
              this.financialId = res.data.id
              this.$refs.financialStatements.financialForm.setFieldsValue(
                pick(this.financial, 'czbzsr', 'czbr', 'lxsr', 'jzsr', 'qtsr', 'jrkx',
                  'yfzk', 'qtyfk', 'qtfyzc', 'syzc', 'gcsgfyzc', 'sbgzfzc', 'yszk',
                  'qtysk', 'yufzk', 'hbzj', 'jgjsjy')
              )
            }
          } else {
            this.$message.error('失败')
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
    callback (key) {
      if (this.projectId) {
        this.activeKey = key
        if (key === '2') {
          this.showFinancialData()
        } else if (key === '4') {
          setTimeout(() => {
            this.searchParameters.projectId = this.projectId
            if (this.show) {
              this.$refs.searchInformation.show = true
            } else {
              this.$refs.searchInformation.show = false
            }
            this.$refs.searchInformation.showSearchData(this.searchParameters)
          }, 300)
        }
      } else {
        alert('请先点击保存，再添加其他')
        this.activeKey = '1'
      }
    }
  }
}
</script>

<style>
</style>
