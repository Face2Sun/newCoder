<template>
  <div class="control">
    <div class="menubar">
      <a-dropdown>
        <a-card slot="overlay" hoverable style="width: 240px;height: 300px;">
        </a-card>
        <a-button class="menubar-item"><a-icon type="profile" /> 专题图 </a-button>
      </a-dropdown>
      <a-divider dashed type="vertical" class="menubar-item-divider" />
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="user" />菜单一</a-menu-item>
          <a-menu-item key="2"><a-icon type="user" />菜单二</a-menu-item>
          <a-menu-item key="3"><a-icon type="user" />菜单三</a-menu-item>
        </a-menu>
        <a-button class="menubar-item"><a-icon type="setting" /> 管理 <a-icon type="down" /> </a-button>
      </a-dropdown>
      <a-divider dashed type="vertical" class="menubar-item-divider" />
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" ><a-icon type="tool" />测量</a-menu-item>
          <a-menu-item key="2" ><a-icon type="tool" />识别</a-menu-item>
          <a-menu-item key="3" ><a-icon type="tool" />查询</a-menu-item>
          <a-menu-item key="4" @click="handleSplitScreen"><a-icon type="tool" />分屏</a-menu-item>
          <a-menu-item key="5" ><a-icon type="tool" />卷帘</a-menu-item>
          <a-menu-item key="6" @click="handleMarker"><a-icon type="tool" />标绘</a-menu-item>
          <a-menu-item key="7" ><a-icon type="tool" />图例</a-menu-item>
        </a-menu>
        <a-button class="menubar-item"><a-icon type="tool" /> 工具箱 <a-icon type="down" /> </a-button>
      </a-dropdown>
    </div>
    <div class="content">
      <control-marker :map="map" @perspective="perspective" v-show="marker"></control-marker>
      <control-splitscreen :map="map" v-show="splitScreen"></control-splitscreen>
    </div>
  </div>
</template>

<script>
import ControlMarker from '@/components/Map/ControlMarker'
import ControlSplitscreen from '@/components/Map/ControlSplitScreen'

export default {
  components: {
    ControlMarker,
    ControlSplitscreen
  },
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      marker: false,
      splitScreen: false
    }
  },
  mounted () {
  },
  methods: {
    handleMarker () {
      this.marker = !this.marker
    },
    handleSplitScreen () {
      this.splitScreen = !this.splitScreen
    },
    perspective (center) {
      this.$emit('perspective', center)
    }
  }
}
</script>

<style lang="less" scoped>
.menubar {
  width: 312px;
  border: 1px solid #000;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  z-index: 999;
  &-item {
    background-color: unset;
    border: none;
    border-radius: 0;
  }
  &-item-divider {
    margin: 0;
    height: 1rem;
    border-top: unset;
    border-right: 1px dashed #000;
  }
}
.content{
  margin-top: 10px;
}
</style>
