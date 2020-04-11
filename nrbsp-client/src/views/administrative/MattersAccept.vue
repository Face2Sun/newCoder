<template>
  <div>
    <div>
      <a-card>
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="常用分类" key="1">
            <div class="headerTab">
              <a-row type="flex">
                <a-col :span="4" :key="item.key" v-for="(item,index) in showList1">
                  <a-button @click.once="loadTable(index)" :class="{active: myIndex === index}" id="flBtn" type="link">
                    <span>{{ item.value }}</span>
                  </a-button>
                </a-col>
                <a-col :span="4">
                  <a @click="showAll = !showAll">{{ word }}<a-icon :type="showAll ? 'up' : 'down'" /></a>
                </a-col>
              </a-row>
            </div></a-tab-pane>
          <a-tab-pane tab="所有分类" key="2" forceRender>
            <div class="headerTab">
              <a-row type="flex">
                <a-col :span="4" :key="item.key" v-for="(item,index) in showList2">
                  <a-button @click="loadTable(index)" :class="{active: myIndex === index}" id="flBtn" type="link">
                    <span>{{ item.value }}</span>
                  </a-button>
                </a-col>
                <a-col :span="4">
                  <a @click="showAll = !showAll">{{ word }}<a-icon :type="showAll ? 'up' : 'down'" /></a>
                </a-col>
              </a-row>
            </div></a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
    <a-card style="margin:30px auto">
      <div>
        <span>共{{ counter }}个事项</span>
        <span>
          <a-form class="form-search">
            <a-form-item class="searchInput">
              <a-input
                placeholder="请输入搜索内容"
                v-model="Parameters.bssx"
              ></a-input>
            </a-form-item>
            <a-button
              type="primary"
              class="searchBtn"
              html-type="submit"
              icon="search"
              :style="{height:760}"
              @click="searchQuery"
            >查询</a-button>
          </a-form>
        </span>
      </div>
      <a-table
        :columns="columns"
        :dataSource="data"
        bordered
        rowKey="bsznid"
        :showHeader="false"
        :loading="this.loading"
        :pagination="pagination"
        height="500"
      >
        <span slot="bssx" slot-scope="text,record">
          <span>{{ text }}</span>
          <span style="float: right">
            <a-button id="blBtn1" type="primary" @click="showModel(record)">在线办理</a-button>
            <a-button id="blBtn2" type="primary" @click="showModel(record)">办事指南</a-button>
          </span>
        </span>
      </a-table>
      <work-guide ref="workGuide"></work-guide>
    </a-card>
  </div>
</template>
<script>
import { findXzsxBsznListByBsznCode, findXzsxBsznListLikeBssxAndCode } from '@/api/businessGuide'
import WorkGuide from './module/WorkGuide'

export default {
  components: {
    WorkGuide
  },
  data () {
    return {
      data: [],
      columns: [
        {
          title: '办事事项',
          dataIndex: 'bssx',
          scopedSlots: {
            customRender: 'bssx'
          }
        }
      ],
      workSourse: [],
      counter: 0,
      counterKind: 0,
      myIndex: 0,
      loading: false,
      isActive: false,
      pagination: {
        pageSize: 6
      },
      Parameters: {
        bssx: null,
        code: parseInt,
        pageNo: 1,
        pageSize: 100
      },
      usualKinds: [
        {
          key: 1,
          value: '多审合一(9)',
          code: 1
        },
        {
          key: 2,
          value: '多测合一(9)',
          code: 2
        },
        {
          key: 3,
          value: '多验合一(3)',
          code: 3
        },
        {
          key: 4,
          value: '勘测定界(2)',
          code: 4
        },
        {
          key: 5,
          value: '用地预审类(2)',
          code: 5
        },
        {
          key: 6,
          value: '土地征收类(3)',
          code: 6
        },
        {
          key: 7,
          value: '批后监管(8)',
          code: 7
        },
        {
          key: 8,
          value: '建设项目选址意见书(3)',
          code: 8
        },
        {
          key: 9,
          value: '建设项目用地规划许可证(1)',
          code: 9
        },
        {
          key: 10,
          value: '规划建筑设计方式(4)',
          code: 10
        },
        {
          key: 11,
          value: '建筑工程规划许可证(18)',
          code: 11
        },
        {
          key: 12,
          value: '建筑工程放线验线(1)',
          code: 12
        },
        {
          key: 13,
          value: '乡村建设规划许可证(1)',
          code: 13
        },
        {
          key: 14,
          value: '乡村建设规划许可证(1)',
          code: 15
        }
      ],
      allKinds: [
        {
          key: 1,
          value: '多审合一(9)',
          code: 1
        },
        {
          key: 2,
          value: '多测合一(9)',
          code: 2
        },
        {
          key: 3,
          value: '多验合一(3)',
          code: 3
        },
        {
          key: 4,
          value: '勘测定界(2)',
          code: 4
        },
        {
          key: 5,
          value: '用地预审类(2)',
          code: 5
        },
        {
          key: 6,
          value: '土地征收类(3)',
          code: 6
        },
        {
          key: 7,
          value: '批后监管(8)',
          code: 7
        },
        {
          key: 8,
          value: '建设项目选址意见书(3)',
          code: 8
        },
        {
          key: 9,
          value: '建设项目用地规划许可证(1)',
          code: 9
        },
        {
          key: 10,
          value: '规划建筑设计方式(4)',
          code: 10
        },
        {
          key: 11,
          value: '建筑工程规划许可证(18)',
          code: 11
        },
        {
          key: 12,
          value: '建筑工程放线验线(1)',
          code: 12
        },
        {
          key: 13,
          value: '乡村建设规划许可证(1)',
          code: 13
        },
        {
          key: 14,
          value: '林业管理(1)',
          code: 14
        },
        {
          key: 15,
          value: '地质灾害(3)',
          code: 15
        },
        {
          key: 16,
          value: '矿产管理(8)',
          code: 16
        },
        {
          key: 17,
          value: '生态修复(6)',
          code: 17
        },
        {
          key: 18,
          value: '耕地保护(3)',
          code: 18
        },
        {
          key: 19,
          value: '法律法规(3)',
          code: 19
        }
      ],
      showAll: false
    }
  },
  created () {
    // this.showSearchData()
    this.loadTable()
  },
  computed: {
    showList1: function () {
      if (this.showAll === false) {
        var showList1 = []
        if (this.usualKinds.length > 11) {
          for (var i = 0; i < 11; i++) {
            showList1.push(this.usualKinds[i])
          }
        } else {
          showList1 = this.usualKinds
        }
        return showList1
      } else {
        return this.usualKinds
      }
    },
    showList2: function () {
      if (this.showAll === false) {
        var showList2 = []
        if (this.allKinds.length > 11) {
          for (var i = 0; i < 11; i++) {
            showList2.push(this.allKinds[i])
          }
        } else {
          showList2 = this.allKinds
        }
        return showList2
      } else {
        return this.allKinds
      }
    },
    word: function () {
      if (this.showAll === false) {
        return '点击展开'
      } else {
        return '收起'
      }
    }
  },
  methods: {
    // 弹出模块框
    showModel (record) {
      this.$refs.workGuide.showModel()
      this.$refs.workGuide.loadData(record)
    },
    loadTable (index) {
      this.loading = true // 加载数据
      if (index) {
        this.Parameters.code = index
      } else {
        this.Parameters.code = 0
      }
      // this.Parameters.code = index
      findXzsxBsznListByBsznCode(this.Parameters).then(res => {
        if (res.success && res.code === 200) {
          this.workSourse = res.data
          var obj = this.workSourse
          var arr = []
          for (const i in obj) {
            arr.push(obj[i])
          }
          this.data = arr
          this.counter = this.data.length
          this.counterKind = this.data.length
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
      this.myIndex = index
    },
    searchQuery () {
      this.loading = true
      console.log('搜索传入参数' + this.Parameters)
      findXzsxBsznListLikeBssxAndCode(this.Parameters).then(res => {
        if (res.success && res.code === 200) {
          this.workSourse = res.data
          var obj = this.workSourse
          var arr1 = []
          for (const i in obj) {
            arr1.push(obj[i])
          }
          this.data = arr1
          this.counter = this.data.length
          this.loading = false
        } else {
          this.$message.error('数据获取失败')
        }
      })
    }
  }
}
</script>
<style scoped>
a{
  color: #409eff
}
.ant-col-4 {
  height: 80px;
  text-align: center
}
.main {
  width: 1150px;
}
/* .headerTab {
  width: 100%;
  height: 300px
} */
.ant-btn-link {
  font-family: "PingFang SC";
  size: 16px;
  white-space: pre-wrap;
  color: #606266
}
#flBtn  {
  height: 50px;
  width: 160px;
  border-radius:20px
}
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
