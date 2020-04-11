<template>

  <div style="height: 670px;">
    <l-map
      style="height: 100%; width: 100%;"
      :zoom="zoom"
      :center="center"
      ref="map"
      @update:center="centerUpdated"
      @update:zoom="zoomUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-control position="topright">
        <menu-bar :map="map" @perspective="perspective"></menu-bar>
      </l-control>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LControl } from 'vue2-leaflet'
import L from 'leaflet'
import ControlMarker from '@/components/Map/ControlMarker'
import MenuBar from './MenuBar'
import '@/components/Map/js/Leaflet.fullscreen'
import '@/components/Map/js/L.Control.Measure'
import '@/components/Map/js/L.Control.MousePosition'
import '@/components/Map/js/L.Control.PixelFilter'

export default {
  components: {
    L,
    LMap,
    LTileLayer,
    LControl,
    ControlMarker,
    MenuBar
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 3,
      center: [47.413220, -1.219482],
      bounds: null,
      zoom2: 3,
      center2: [47.413220, -1.219482],
      map1: null,
      map: null
    }
  },
  created () {
  },
  mounted () {
    this.map = this.$refs.map.mapObject
    console.log(this.map)
    L.control.fullscreen().addTo(this.map)
    L.control.Measure().addTo(this.map)
    L.control.mousePosition().addTo(this.map)
    L.control.PixelFilter().addTo(this.map)
  },
  methods: {
    zoomUpdated (zoom) {
      console.log(zoom)
      this.zoom = zoom
    },
    centerUpdated (center) {
      this.center = center
    },
    boundsUpdated (bounds) {
      this.bounds = bounds
    },
    perspective (center) {
      this.center = center
    }
  }
}
</script>
<style>
.control-panel .search .ant-input-search-enter-button .ant-input-group-addon .ant-input-search-button{
    font-size: 18px;
    color: #5e5656;
    background-color: #fff;
    border-color: #d9d9d9;
  }
.control-panel .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
padding: 12px 14px;
word-break: break-all;
}
.leaflet-container .leaflet-control-attribution, .leaflet-container .leaflet-control-scale{
  display: none;
}
.leaflet-marker-markerTooltip{
	white-space: nowrap;
	float: left;
	margin-left: 15px;
	margin-top: -5px;
	background-color: #FFFFFF;
	border: 1px solid #000000;
	border-radius: 3px;
	box-shadow: 2px 2px 5px #888888;
	color: #000000;
	padding: 2px 5px;
	font-weight: bold;
	font-size: 12px;
	line-height: 16px;
	cursor: default;
}
</style>
