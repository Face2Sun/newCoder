<template>
  <div>
    <nav>
      <ul>
        <li>
          <router-link to="center-page">首页</router-link>
        </li>
        <li v-for="(item,index) in navDatas" :key="index" class="primary">
          <router-link
            v-if="!item.havesub"
            :to="{path: 'information-subpage', query: {database: item}}"
          >{{ item.flmc }}</router-link>
          <a v-else href="javascript:void(0)">{{ item.flmc }}</a>
          <ul v-if="item.havesub" class="sub">
            <li v-for="(sub,indexs) in item.sub" :key="indexs">
              <router-link
                :to="{path: 'information-subpage', query: {database: sub}}"
              >{{ sub.flmc }}</router-link>
              <span>|</span>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import { findAll } from '@/api/programa'
export default {
  data () {
    return {
      navDatas: []
    }
  },
  created () {
    this.loadData()
  },
  mounted () {

  },
  methods: {
    loadData () {
      findAll().then(res => {
        if (res.success) {
          console.log(res)
          var list = res.data.list
          var primary = {}
          var secondary = {}
          for (let i = 0; i < list.length; i++) {
            if (!list[i].parentid) {
              primary.id = list[i].id
              primary.havesub = false
              primary.flmc = list[i].flmc
              this.navDatas.push(primary)
              primary = {}
            }
          }
          for (let i = 0; i < list.length; i++) {
            if (list[i].parentid) {
              secondary.flmc = list[i].flmc
              secondary.id = list[i].id
              secondary.parentid = list[i].parentid
              for (let j = 0; j < this.navDatas.length; j++) {
                if (secondary.parentid === this.navDatas[j].id) {
                  if (!this.navDatas[j].hasOwnProperty('sub')) {
                    this.navDatas[j].sub = []
                  }
                  this.navDatas[j].havesub = true
                  this.navDatas[j].sub.push(secondary)
                  secondary = {}
                }
              }
            }
          }
          console.log(this.navDatas)
        } else {
          this.$message.error('数据获取失败')
        }
      })
    }
  }
}
</script>
<style scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
nav {
  width: 100%;
  height: 70px;
  overflow: hidden;
}
nav ul{
  height: 64px;
}
nav ul li {
  margin-left: 15px;
  float: left;
  text-align: center;
  line-height: 42px;
  position: relative;
  color: rgb(0, 0, 0);
}
nav ul li a {
  font-family: "Microsoft Yahei";
  font-size: 17px;
  display: inline-block;
  color: black;
  text-decoration: none;
}
nav ul li a:hover {
  color: rgb(93, 203, 159);
  text-decoration: none;
}
nav ul > li:hover .sub {
  display: block;
}

nav .primary {
  position: relative;
}

nav .sub {
  position: absolute;
  top: 34px;
  left: -100%;
  display: none;
  width: 800px;
  height: 30px;
  text-align: center;
}
nav .sub li {
  display: inline-block;
}
nav .sub li a {
  font-size: 14px;
}
nav .sub li span {
  margin-left: 10px;
  font-weight: 700;
}
</style>
