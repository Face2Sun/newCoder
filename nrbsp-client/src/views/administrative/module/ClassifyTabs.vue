<template>
  <div>
    <a-card>
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="常用分类" key="1">
          <div :style="{height: upDown + 'px'}" class="headerTab">
            <a-row type="flex">
              <a-col :span="4" :key="item.key" v-for="item in usualKinds">
                <a-button @click="loadTable" :counter="counter" id="flBtn" type="link"><span>{{ item.value }}({{ counter }})</span></a-button>
              </a-col>
            </a-row>
            <!-- <span><a @click="closeDown()">收起</a></span> -->
          </div></a-tab-pane>
        <a-tab-pane tab="所有分类" key="2" forceRender>
          <div class="headerTab">
            <a-row type="flex">
              <a-col :span="4" :key="item.key" v-for="item in allKinds">
                <a-button @click="loadTable" id="flBtn" type="link"><span>{{ item.value }}({{ counter }})</span></a-button>
              </a-col>
            </a-row>
            <!-- <span><a @click="closeDown()">收起</a></span> -->
          </div></a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // counter: 1,
      upDown: 250,
      usualKinds: [
        {
          key: 1,
          value: '多审合一'
        },
        {
          key: 2,
          value: '多测合一'
        },
        {
          key: 3,
          value: '多验合一'
        },
        {
          key: 4,
          value: '勘测定界'
        },
        {
          key: 5,
          value: '用地预审类'
        },
        {
          key: 6,
          value: '土地征收类'
        },
        {
          key: 7,
          value: '批后监管'
        },
        {
          key: 8,
          value: '建设项目选址意见书'
        },
        {
          key: 9,
          value: '建设项目用地规划许可证'
        },
        {
          key: 10,
          value: '规划建筑设计方式'
        },
        {
          key: 11,
          value: '建筑工程规划许可证'
        },
        {
          key: 12,
          value: '建筑工程放线验线'
        }
      ],
      allKinds: [
        {
          key: 1,
          value: '多审合一'
        },
        {
          key: 2,
          value: '多测合一'
        },
        {
          key: 3,
          value: '多验合一'
        },
        {
          key: 4,
          value: '勘测定界'
        },
        {
          key: 5,
          value: '用地预审类'
        },
        {
          key: 6,
          value: '土地征收类'
        },
        {
          key: 7,
          value: '批后监管'
        },
        {
          key: 8,
          value: '建设项目选址意见书'
        },
        {
          key: 9,
          value: '建设项目用地规划许可证'
        },
        {
          key: 10,
          value: '规划建筑设计方式'
        },
        {
          key: 11,
          value: '建筑工程规划许可证'
        },
        {
          key: 12,
          value: '建筑工程放线验线'
        },
        {
          key: 13,
          value: '建筑工程规划竣工核实'
        },
        {
          key: 14,
          value: '乡村建设规划许可证'
        },
        {
          key: 15,
          value: '林业管理'
        },
        {
          key: 16,
          value: '地质灾害'
        }
      ]
    }
  },
  components: {
    props: {
      counter: Number
    }
  },
  created () {
    console.log(this.counter)
  }
  // props: {
  //   counter: String
  // }
}
</script>

<style scoped>
.ant-col-4 {
  height: 80px;
  text-align: center
}
.main {
  width: 1150px;
}
.headerTab {
  width: 100%;
  height: 250px
}
.ant-btn-link {
  font-family: "PingFang SC";
  size: 16px;
  white-space: pre-wrap;
}
#flBtn  {
  height: 50px;
  width: 160px;
  border-radius:20px
}
</style>
