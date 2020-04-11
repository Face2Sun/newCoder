<template>
  <div>
    <a-button class="editable-add-btn" @click="showModal">添加</a-button>
    <a-table
      style="{align:'center'}"
      :rowKey="data.index"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
    >
      <template
        v-for="col in ['clmc', 'cltxyb', 'lyqd','zzcl','clbyx']"
        :slot="col"
        slot-scope="text, record,index"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col,index)"
          />
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text,record,index">
        <span v-if="record.editable">
          <a @click="() => save(record)">保存</a>
          <a-popconfirm title="确定退出?" @confirm="() => cancel(record.key,index)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a @click="() => edit(record.key,index)">编辑</a>
        </span>
        <a-popconfirm
          v-if="data.length"
          title="确定删除？"
          @confirm="() => onDelete(record)"
        >
          <a style="margin:0px 0px 0px 10px" href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      title="新增材料"
      :width="500"
      :visible="visible"
      :footer="null"
      :closable="true"
      :centered="true"
      :destroyOnClose="true"
      @cancel="cancelModal"
    >
      <a-form :form="addForm">
        <a-form-item label="材料名称">
          <a-input
            placeholder="请填入内容"
            allowClear
            v-decorator="[
              'clmc',
              {rules: [{ required: true, message: '请输入材料名称', whitespace: false}]}
            ]"
          />
        </a-form-item>
        <a-form-item label="材料填写样本">
          <a-input
            placeholder="请填入内容"
            allowClear
            v-decorator="[
              'cltxyb',
              {rules: [{ required: true, message: '请输入填写样本', whitespace: true}]}
            ]"
          />
        </a-form-item>
        <a-form-item label="来源渠道">
          <a-input
            placeholder="请填入内容"
            allowClear
            v-decorator="[
              'lyqd',
              {rules: [{ required: true, message: '请输入来源渠道', whitespace: true}]}
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="纸质材料">
          <a-input
            placeholder="请填入内容"
            allowClear
            v-decorator="[
              'zzcl',
              {rules: [{ required: true, message: '请输入纸质材料', whitespace: true}]}
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="材料必要性">
          <a-input
            placeholder="请填入内容"
            allowClear
            v-decorator="[
              'clbyx',
              {rules: [{ required: true, message: '请输入材料必要性', whitespace: true}]}
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
      <a-row>
        <a-col style="text-align:center">
          <a-button type="primary" @click="handleAdd()">保存</a-button>
          <a-button @click="cancelModal()">取消</a-button>
        </a-col>
      </a-row>
    </a-modal></div>
</template>
<script>
import { findXzsxBlclListByBsznid, addXzsxBlcl, updateXzsxBlcl, deteleXzsxBlclByclmuid } from '@/api/businessGuide'

const columns = [
  {
    title: '材料名称',
    dataIndex: 'clmc',
    key: 'clmc',
    align: 'center',
    scopedSlots: { customRender: 'clmc' }

  },
  {
    title: '材料填写样本',
    dataIndex: 'cltxyb',
    key: 'cltxyb',
    align: 'center',
    scopedSlots: { customRender: 'cltxyb' }
  },
  {
    title: '来源渠道',
    dataIndex: 'lyqd',
    key: 'lyqd',
    align: 'center',
    scopedSlots: { customRender: 'lyqd' }
  },
  {
    title: '纸质材料',
    dataIndex: 'zzcl',
    key: 'zzcl',
    align: 'center',
    scopedSlots: { customRender: 'zzcl' }
  },
  {
    title: '材料必要性',
    dataIndex: 'clbyx',
    key: 'clbyx',
    align: 'center',
    scopedSlots: { customRender: 'clbyx' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'MaterialsMaintain',
  data () {
    return {
      addForm: this.$form.createForm(this),
      data: [],
      columns,
      materialSource: [],
      meterial: {},
      addData: {},
      add: {},
      editIndex: 0,
      deleteid: '',
      loading: false,
      visible: false,
      pagination: {
        pageSize: 6
      },
      Parameters: {
        bsznid: '',
        // bsznid: 'c382e3e27e7e4728b388b48a38539a27',
        pageNo: 1,
        pageSize: 100
      }
    }
  },
  methods: {
    loadData (value) {
      // console.log('材料界面：', value)
      this.Parameters.bsznid = value
      this.loading = true
      findXzsxBlclListByBsznid(this.Parameters).then(res => {
        this.loading = false
        if (res.success) {
          this.materialSource = res.data
          var obj = this.materialSource
          var arr = []
          for (const i in obj) {
            arr.push(obj[i]) // 属性
          }
          for (const i in arr) {
            this.data.push({
              key: i.toString()
            })
          }
          // console.log(arr)
          this.data = arr
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    // 修改操作，需要将修改的数据一起传入并更新调用this.loadData()
    // 绑定input中输入的内容
    handleChange (value, key, column, index) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[index]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit (key, index) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[index]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    // 保存修改调用updata接口
    save (record) {
      updateXzsxBlcl(record).then(res => {
        if (res.success && res.code === 200) {
          this.$message.success('保存成功')
          this.loadData(this.Parameters.bsznid)
        } else {
          this.$message.error('失败')
        }
      })
    },
    cancel (key, index) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[index]
      if (target) {
        target.editable = false
        this.data = newData
      }
    },
    // 删除操作，根据clmuid删除对应条目并更新，this.$emit('loadData')
    onDelete (record) {
      // console.log(record)
      this.deleteid = record.clmuid
      deteleXzsxBlclByclmuid(this.deleteid).then(res => {
        if (res.success && res.code === 200) {
          this.$message.success('删除成功')
          this.loadData(this.Parameters.bsznid)
        } else {
          this.$message.error('失败')
        }
      })
    },
    // 添加操作，添加然后将新增的条目显示在表格中,添加的新条目需要传入bsznid，其中clmuid会自动生成
    handleAdd () {
      this.saveAddForm()
      addXzsxBlcl(this.add).then(res => {
        if (res.success) {
          this.$message.success('添加成功')
          this.loadData(this.Parameters.bsznid)
          this.visible = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    saveAddForm () {
      this.addData = this.addForm.getFieldsValue()
      this.add.bsznid = this.Parameters.bsznid
      this.add = this.extendObject(this.add, this.addData)
    },
    showModal () {
      this.visible = true
    },
    cancelModal () {
      this.visible = false
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
  .editable-add-btn {
    margin-bottom: 8px;
  }
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>
