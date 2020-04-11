<template>
  <div class="center">
    <p class="title">新闻信息发布</p>
    <a-form :form="newsForm">
      <a-form-item label="标题" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          placeholder="请输入标题"
          v-decorator="[
            'bt',
            {rules: [{ required: true, message: '请输入标题', whitespace: true}]}
          ]"
        />
      </a-form-item>
      <a-form-item label="副标题" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          placeholder="请输入副标题"
          v-decorator="[
            'fbt',
            {rules: [{ required: true, message: '请输入副标题', whitespace: true}]}
          ]"
        />
      </a-form-item>
      <a-form-item label="关键字" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input
          placeholder="请输入关键字"
          v-decorator="[
            'gjz',
            {rules: [{ required: false, message: '请输入关键字', whitespace: true}]}
          ]"
        />
      </a-form-item>
      <a-form-item label="栏目" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-select v-model="selectValue">
          <a-select-option v-for="item in selectList" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :md="12" style="margin-left: 4px;">
          <a-form-item label="发布人" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
            <a-input
              placeholder="请输入发布人"
              v-decorator="[
                'fbr',
                {rules: [{ required: false, message: '请输入发布人', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="10" style="margin-left: 9px;">
          <a-form-item label="发布部门" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
            <a-input
              placeholder="管理员:"
              v-decorator="[
                'fbbm',
                {rules: [{ required: false, message: '请输入发布部门', whitespace: true}]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="滚动图片" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          :fileList="fileList"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 4">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传图片</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
      <a-form-item label="领导审核" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-radio-group @change="radioChange" v-model="radioValue">
          <a-radio value="1">需要</a-radio>
          <a-radio value="2">不需要</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :md="8" :sm="24" style="margin-left: 6px;">
          <a-form-item label="是否置顶" :label-col="{ span: 15 }" :wrapper-col="{ span: 9 }">
            <a-radio-group @change="topChange" v-model="topValue">
              <a-radio value="1">否</a-radio>
              <a-radio value="2">是</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :md="14" :sm="24">
          <a-form-item label="置顶时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 17 }">
            <a-radio-group :disabled="disabled" v-model="timeValue">
              <a-radio value="1">分钟</a-radio>
              <a-radio value="2">小时</a-radio>
              <a-radio value="3">工作日</a-radio>
              <a-radio value="4">自然日</a-radio>
            </a-radio-group>
            <a-input-number :disabled="disabled" :min="0" v-model="topTime" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="附件" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-upload
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :headers="headers"
          @change="accessoryChange"
        >
          <a-button> <a-icon type="upload" /> 上传附件 </a-button>
        </a-upload>
        <a-checkbox class="whether-download" :checked="checked" @click="downloadAttachment">点击标题直接下载附件</a-checkbox>
      </a-form-item>
      <a-form-item label="内容" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <quill-editor ref="quillEditor" class="quill-editor"></quill-editor>
      </a-form-item>
      <a-button type="primary" style="margin-left: 450px;" @click="directRelease">直接发布</a-button>
      <a-button type="primary" style="margin: 0 0 20px 100px;" @click="handleSave">保存到草稿箱</a-button>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import QuillEditor from './model/QuillEditor'
import { findAll } from '@/api/programa'
import { addInformation, updateInformation } from '@/api/newsManage'
export default {
  components: {
    QuillEditor
  },
  data () {
    return {
      newsForm: this.$form.createForm(this),
      confirmDirty: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      selectValue: '要闻播放',
      selectList: [],
      disabled: true,
      radioValue: '1',
      topValue: '1',
      timeValue: '1',
      topTime: 1,
      checked: false,
      goto: false,
      id: null,
      newsInformation: {},
      headers: {
        authorization: 'authorization-text'
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      findAll().then(res => {
        if (res.success) {
          var list = res.data.list
          var primary = {}
          var secondary = {}
          var navDatas = []
          for (let i = 0; i < list.length; i++) {
            if (!list[i].parentid) {
              primary.id = list[i].id
              primary.flmc = list[i].flmc
              this.selectList.push(list[i].flmc)
              navDatas.push(primary)
              primary = {}
            }
          }
          for (var i = 0; i < list.length; i++) {
            if (list[i].parentid) {
              secondary.flmc = list[i].flmc
              secondary.id = list[i].id
              secondary.parentid = list[i].parentid
              this.selectList.push(list[i].flmc)
              for (let j = 0; j < navDatas.length; j++) {
                if (secondary.parentid === navDatas[j].id) {
                  this.selectList.splice(j, 1)
                  secondary = {}
                }
              }
            }
          }
        } else {
          this.$message.error('数据获取失败')
        }
      })
      if (this.$route.query.database) {
        this.showDetail(this.$route.query.database)
      }
    },

    // 文件上传方法---开始
    // 上传滚动图
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      this.fileList = fileList
    },
    // 上传附件
    accessoryChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    // 文件上传方法---结束

    // 是否需要审核
    radioChange (e) {
      this.radioValue = e.target.value
    },
    // 是否需要置顶
    topChange (e) {
      this.topValue = e.target.value
      if (this.topValue === '1') {
        this.disabled = true
        this.timeValue = null
        this.topTime = null
      } else {
        this.disabled = false
      }
    },
    // 点击标题直接下载附件
    downloadAttachment (e) {
      this.checked = !this.checked
    },
    // 直接发布
    directRelease () {
      this.newsInformation.yfb = 2
      this.addInformations()
      if (this.goto) {
        setTimeout(() => {
          this.$router.replace({ path: 'news-parameter', query: { database: this.selectValue } })
        }, 500)
      }
    },
    // 保存到草稿箱
    handleSave () {
      this.newsInformation.yfb = 0
      this.addInformations()
      if (this.goto) {
        setTimeout(() => {
          this.$router.replace('news-drafts')
        }, 500)
      }
    },
    // 将信息显示在表中
    showDetail (data) {
      this.newsInformation = data
      this.id = data.id
      this.selectValue = this.newsInformation.lmfl
      this.radioValue = String(this.newsInformation.sfxyldsh)
      this.topValue = String(this.newsInformation.sfzd)
      if (this.topValue === '1') {
        this.disabled = true
      } else {
        this.disabled = false
        this.timeValue = this.newsInformation.zdsjdw
        this.topTime = this.newsInformation.zdsjdx
      }
      this.checked = this.newsInformation.djbtzjxzfj > 0
      this.$nextTick(() => {
        console.log(this.newsInformation.nr)
        this.$refs.quillEditor.content = this.unescapeHTML(this.newsInformation.nr)
        console.log(this.unescapeHTML(this.newsInformation.nr))
        this.newsForm.setFieldsValue(
          pick(this.newsInformation, 'bt', 'fbt', 'gjz', 'fbr', 'fbbm')
        )
      })
    },
    // 保存表单数据内容
    saveForm () {
      var Information = this.newsForm.getFieldsValue()
      this.newsInformation = this.extendObject(this.newsInformation, Information)
      this.newsInformation.lmfl = this.selectValue
      this.newsInformation.sfxyldsh = this.radioValue
      this.newsInformation.sfzd = this.topValue
      this.newsInformation.zdsjdw = this.timeValue
      this.newsInformation.zdsjdx = this.topTime
      this.newsInformation.djbtzjxzfj = this.checked ? '1' : '0'
      console.log(this.$refs.quillEditor.content)
      this.newsInformation.nr = this.escapeHTML(this.$refs.quillEditor.content)
      console.log(this.escapeHTML(this.$refs.quillEditor.content))
      console.log(this.newsInformation)
    },
    // 保存数据到数据库
    addInformations () {
      // 验证表单信息
      this.newsForm.validateFields((err, values) => {
        if (!err) {
          this.saveForm()
          this.goto = true
          // 判断是提交还是保存
          if (this.id) {
            this.newsInformation.id = this.id
            updateInformation(this.newsInformation).then(res => {
              if (res.success && res.code === 200) {
                this.$message.success('修改成功')
              } else {
                this.$message.error('失败')
              }
            })
          } else {
            addInformation(this.newsInformation).then(res => {
              if (res.success && res.code === 200) {
                this.$message.success('发布成功')
              } else {
                this.$message.error('失败')
              }
            })
          }
        }
      })
    },
    // 对象深拷贝方法
    extendObject (target, source) {
      for (var obj in source) {
        target[obj] = source[obj]
      }
      return target
    },
    // 转义html脚本
    escapeHTML (a) {
      a = '' + a
      return a.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
    },
    // 还原html脚本
    unescapeHTML (a) {
      a = '' + a
      return a.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    }
  }
}
</script>
<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.center{
  margin: 0 auto;
  width: 1200px;
  background-color: #fff;
}
.center .title{
  text-align: center;
  font-size: 26px;
  font-weight: 700;
}
.quill-editor{
  height: 500px;
}
.whether-download{
  color: red;
  width: 300px;
  position: absolute;
  top: -10px;
  left: 180px;
}
</style>
