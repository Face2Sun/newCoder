<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <div class="top-title">
          <div class="title-name">新闻栏目</div>
        </div>
        <s-tree :dataSource="treeSource" @click="handleClick">
        </s-tree>
      </a-col>
      <a-col :span="19">
        <div class="top-title">
          <div class="title-name">新闻列表</div>
        </div>
        <news-list ref="newsList"></news-list>
      </a-col></a-row>
  </a-card>
</template>

<script>
import STree from '@/components/Tree/Tree'
import NewsList from './model/NewsList'
import { findAll } from '@/api/programa'
export default {
  components: {
    STree,
    NewsList
  },
  data () {
    return {
      treeSource: []
    }
  },
  created () {
    this.loadTreeSource()
  },
  methods: {
    loadData () {
    },
    loadTreeSource () {
      findAll().then(res => {
        if (res.success) {
          var list = res.data.list
          var primary = {}
          var secondary = {}
          for (var i = 0; i < list.length; i++) {
            if (list[i].parentid) {
              secondary.title = list[i].flmc
              secondary.id = list[i].id
              secondary.parentid = list[i].parentid
              secondary.icon = 'file'
              secondary.key = list[i].flmc
              for (var j = 0; j < this.treeSource.length; j++) {
                if (secondary.parentid === this.treeSource[j].id) {
                  if (!this.treeSource[j].hasOwnProperty('children')) {
                    this.treeSource[j].children = []
                  }
                  this.treeSource[j].children.push(secondary)
                  secondary = {}
                }
              }
            } else {
              primary.id = list[i].id
              primary.title = list[i].flmc
              primary.key = list[i].flmc
              primary.icon = 'folder'
              this.treeSource.push(primary)
              primary = {}
            }
          }
          console.log(this.treeSource)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    // 树控件点击事件
    handleClick (e) {
      // console.log('handleClick', e)
      this.$refs.newsList.upData(e.key)
    }
  }
}
</script>
<style scoped>
.top-title{
  width: 100%;
  height: 40px;
  border-bottom: 3px solid rgb(82, 196, 26);
  overflow: hidden;
}
.top-title .title-name{
  width: 100px;
  height: 30px;
  line-height: 30px;
  margin: 10px 0 0 20px;
  text-align: center;
  border-radius: 5px;
  color:#fff;
  background-color: rgb(82, 196, 26);
}
</style>
