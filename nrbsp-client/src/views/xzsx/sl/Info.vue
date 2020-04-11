<template>
  <div class="ZdInfoForm">
    <!-- 顶部按钮操作栏 -->
    <div align="right">
    </div>
    <!-- 申请方经办人信息 -->
    <a-divider orientation="left">申请方经办人信息</a-divider>
    <a-form class="ant-advanced-search-form">
      <a-row :gutter="24" type="flex">
        <a-col :span="8">
          <a-form-item label="经办人姓名" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入经办人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="经办人证件类型" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select defaultValue="mainlandIdCard" placeholder="请选择经办人证件类型">
              <a-select-option value="mainlandIdCard">身份证</a-select-option>
              <a-select-option value="otherIdCard">港澳台身份证</a-select-option>
            </a-select>
            <!-- <dict-combo dictType="ZJLX" v-model="zjlxVal"></dict-combo> -->
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="经办人证件号码" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入经办人证件号码" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" type="flex">
        <a-col :span="8">
          <a-form-item label="经办人手机" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入经办人手机" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="经办人联系电话" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入经办人联系电话" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="经办人邮箱地址" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入经办人邮箱地址" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" type="flex">
        <a-col :span="8">
          <a-form-item label="经办人邮政编码" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入经办人邮政编码" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="经办人联系地址" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入经办人联系地址" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 申请人信息 -->
    <a-divider orientation="left">申请人信息</a-divider>
    <a-form class="ant-advanced-search-form">
      <a-row :gutter="24">
        <a-col :lg="12" :xxl="8">
          <a-form-item label="法定代表人/负责人" :label-col="{span: 8}" :wrapper-col="{span: 16}">
            <a-radio-group v-decorator="['radio-group']" defaultValue="1" @change="sqrlxChange">
              <a-radio value="1">
                自然人
              </a-radio>
              <a-radio value="2">
                法人
              </a-radio>
              <a-radio value="3">
                其他
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <template v-if="sqrlxInfoShow == '1' || sqrlxInfoShow == '3'">
        <a-row :gutter="24" type="flex">
          <a-col :span="8">
            <a-form-item label="申请人名称" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入申请人名称" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="申请人证件类型" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select defaultValue="mainlandIdCard" placeholder="请选择申请人证件类型">
                <a-select-option value="mainlandIdCard">身份证</a-select-option>
                <a-select-option value="otherIdCard">港澳台身份证</a-select-option>
              </a-select>
              <!-- <dict-combo dictType="ZJLX" v-model="zjlxVal"></dict-combo> -->
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="申请人证件号码" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入申请人证件号码" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" type="flex">
          <a-col :span="8">
            <a-form-item label="申请人手机" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入申请人手机" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入联系电话" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮箱地址" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入邮箱地址" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" type="flex">
          <a-col :span="8">
            <a-form-item label="邮政编码" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入邮政编码" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系地址" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入联系地址" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      <template v-if="sqrlxInfoShow=='2'">
        <a-row :gutter="24" type="flex">
          <a-col :span="8">
            <a-form-item label="单位名称" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入单位名称" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="组织机构代码" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入组织机构代码" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="法定代表人姓名" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入法定代表人姓名" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" type="flex">
          <a-col :span="8">
            <a-form-item label="法人手机号码" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入法人手机号码" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="单位联系电话" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入单位联系电话" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="单位电子邮箱" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入单位电子邮箱" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" type="flex">
          <a-col :span="8">
            <a-form-item label="单位邮政编码" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入单位邮政编码" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="单位地址" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input placeholder="请输入单位地址" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
    </a-form>
  </div>
</template>

<script>

export default {
  name: 'XzsxSlInfo',
  components: {
  },
  data () {
    return {
      sqrlxInfoShow: '1',
      labelCol: {
        md: { span: 12 },
        lg: { span: 10 },
        xxl: { span: 8 }
      },
      wrapperCol: {
        md: { span: 12 },
        lg: { span: 14 },
        xxl: { span: 16 }
      }
    }
  },
  methods: {
    sqrlxChange (e) {
      this.sqrlxInfoShow = e.target.value
    }
  }
}
</script>

<style scoped>
.ZdInfoForm {
  background-color: white;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 15px;
  padding-bottom: 20px;
}
.topBtnDiv {
  margin-right: 15px;
}
.operateBtnClass {
  margin-left: 15px;
  background-color: #169bd5;
  border-color: #169bd5;
}
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}
.rowLayout {
  display: flex;
  align-items: center;
}
</style>
