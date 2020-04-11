<template>
  <div>
    <div>
      <classifyTabs :counter="this.counter"></classifyTabs>
    </div>
    <a-card style="margin:30px auto">
      <div>
        <span>共{{ counter }}个事项</span>
        <span>
          <a-form class="form-search">
            <a-form-item class="searchInput">
              <a-input
                placeholder="请输入搜索内容"
                :value="searchText"
                @input="searchText = $event"
              ></a-input>
            </a-form-item>
            <a-button
              type="primary"
              class="searchBtn"
              html-type="submit"
              icon="search"
              @click="searchQuery"
            >查询</a-button>
          </a-form>
        </span>
      </div>
      <a-table
        :columns="columns"
        :dataSource="data"
        bordered
        rowKey="key"
        :showHeader="false"
      >
        <span slot="bssx" slot-scope="bssx">
          <span>{{ bssx }}</span>
          <span style="float: right">
            <a-button id="blBtn1" type="primary" @click="showDrawer">在线办理</a-button>
            <a-button id="blBtn2" type="primary" @click="showDrawer">办事指南</a-button>
          </span>
          <work-guide ref="workGuide"></work-guide>
        </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { findXzsxBsznListByBsznCode, findXzsxBsznByBsznid } from '@/api/businessGuide'
import WorkGuide from './WorkGuide'

const columns = [
  {
    title: '办事事项',
    dataIndex: 'bssx',
    scopedSlots: {
      customRender: 'bssx'
    }
  }
]

export default {
  name: 'WorkTable',
  components: {
    WorkGuide
  },
  data () {
    return {
      data: [],
      columns,
      workSourse: [],
      counter: 0,
      loading: false,
      // isShow: true,
      Parameters: {
        bssx: null,
        code: 1,
        pageNo: 1,
        pageSize: 100
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    // 弹出模块框
    showDrawer () {
      this.$refs.workGuide.visible = true
      this.$refs.workGuide.loadData()
    },
    loadData () {
      this.loading = true
      findXzsxBsznByBsznid('c382e3e27e7e4728b388b48a38539a27').then(res => {
        if (res.success) {
          console.log(res)
          this.workSourse = res.data
          // 将获得的对象转化成数组使用
          var obj = this.workSourse
          var arr = []
          for (const i in obj) {
            arr.push(obj[i]) // 属性
          }
          for (var i = 0; i < 20; i++) {
            this.data.push({
              key: i.toString(),
              bssx: arr[1] + i
            })
          }
          console.log(this.data)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    showSearchData (searchParameters) {
      this.loading = false // 加载数据
      findXzsxBsznListByBsznCode(searchParameters).then(res => {
        if (res.success && res.code === 200) {
          console.log(res)
          this.workSourse = res.data
          var obj = this.workSourse
          var arr = []
          for (const i in obj) {
            arr.push(obj[i]) // 属性
          }
          this.data = arr
          this.counter = this.data.length
          // for (var i = 0; i < arr.length; i++) {
          //   this.data.bssx = arr[i]
          // }
          console.log(arr)
          console.log(this.data)
          this.loading = true
        } else {
          this.$message.error('数据获取失败')
        }
      })
    },
    searchQuery () {
      this.loading = true
      this.showSearchData(this.Parameters)
      // this.isShow = !this.isShow
    }
  }
}
</script>
<style scoped>
.form-search {
  float: right;
}
.searchInput {
  float: left;
}
.searchBtn {
  margin: 3px 30px 0px 10px
  /* 上右下左 */
}
#blBtn1 {
    margin: 0px 50px 0px 300px
}
#blBtn2 {
    margin: 0px 70px 0px 0px
}
td {
    width: 50%;
    text-align: left
}
</style>
