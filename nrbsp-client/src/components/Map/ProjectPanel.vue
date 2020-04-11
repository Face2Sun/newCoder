<template>
  <div class="wrapper">
    <div class="select-wrapper">
      <a-select
        :value="projectNo"
        class="select"
        :dropdownStyle="{ textAlign: 'center' }"
      >
        <a-select-option
          v-for="pj in projectList"
          :key="pj.no"
          :value="pj.no"
        >
          {{ pj.name }}
        </a-select-option>
      </a-select>
    </div>
    <div class="tree-wrapper">
      <project-tree
        :checkable="true"
        :dataSource="treeData"
        :checkedKeys="checkedKeys"
        @check="layerCheck"
      ></project-tree>
    </div>
  </div>
</template>

<script>

import { getProject, getProjectList } from '@/api/webgis/index'
import { formatJsonInfo } from '@/utils/webgis'
import ProjectTree from '@/components/Map/ProjectTree'
import _ from 'lodash'

export default {
  name: 'ProjectPanel',
  components: {
    ProjectTree
  },
  props: {
  },
  computed: {
  },
  data () {
    return {
      projectList: [],
      projectNo: '',
      projectInfo: {},
      treeData: [],
      checkedKeys: []
    }
  },
  watch: {
    projectNo (val) {
      this.loadProject(val)
    }
  },
  mounted () {
    getProjectList().then((res) => {
      this.projectList = res.data
      this.projectNo = res.data.length ? res.data[0].no : ''
    })
  },
  methods: {
    loadProject (val) {
      getProject({ projectNo: val }).then((res) => {
        if (res.data && res.data.serviceList) {
          this.projectInfo = res.data
          const formatInfo = formatJsonInfo(res.data.serviceList)
          this.$emit('loadProjectInfo', res.data, formatInfo)
          this.treeData = formatInfo.serviceInfo
          this.checkedKeys = formatInfo.checkedArr
        }
      })
    },
    layerCheck (key, e, nodes) {
      const isCheck = key.length > this.checkedKeys.length
      const changedKeys = isCheck ? _.difference(key, this.checkedKeys) : _.difference(this.checkedKeys, key)
      this.checkedKeys = key
      this.$emit('checkLayers', changedKeys, isCheck)
    }
  }
}
</script>

<style lang='less' scoped>
.wrapper{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.select-wrapper{
  height: 60px;
  padding: 12px 32px;
  .select{
    width: 100%;
    border-radius: 4px;
    color: #FFFFFF;
  }
  /deep/.ant-select-selection{
    background-color: #1890FF;
    border: none;
    text-align: center;
  }
  /deep/.ant-select-selection-selected-value{
    float: unset;
  }
}
.tree-wrapper{
  width: 100%;
  height: 100%;
  flex: 1;
  padding: 0 22px;
  overflow: auto;
}
</style>
