<template>
  <div style="height: 100%;">
    <a-row style="height: 100%;">
      <a-col style="height: 100%;" :span="sideSpan">
        <project-panel
          @loadProjectInfo="loadProjectInfo"
          @checkLayers="checkLayers"
        ></project-panel>
        <slot name="sidePanel">
        </slot>
      </a-col>
      <a-col style="height: 100%;" :span="getMapSpan">
        <l-map
          v-for="(i, index) in mapNum"
          :key="index"
          ref="map"
          :crs="crs"
          :bounds="initBounds"
          :options="mapOptions"
          style="height: 100%"
          @update:center="centerUpdate"
          @update:zoom="zoomUpdate"
          @update:bounds="boundsUpdated"
        >
          <!-- <float-card v-bind="floatCardPorp">
            <slot name="floatCard"></slot>
          </float-card> -->
          <slot></slot>
        </l-map>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { latLng } from 'leaflet'
import { LMap, LTileLayer } from 'vue2-leaflet'
import ProjectPanel from '@/components/map/ProjectPanel'
import _ from 'lodash'
import { dynamicMapLayer } from 'esri-leaflet'
import { getChildLayersByBsm } from '@/utils/webgis'
import 'proj4leaflet'
import 'leaflet-mouse-position'
import '@/components/map/js/Leaflet.fullscreen.js'
import '@/components/map/js/L.Control.Measure.js'
import '@/components/map/js/L.Control.Swipe.js'

export default {
  name: 'MapPanel',
  components: {
    LMap,
    ProjectPanel
  },
  props: {
    sideSpan: {
      type: Number,
      default: 0
    },
    zoomControl: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getMapSpan: function () {
      return (24 - this.sideSpan)
    }
  },
  data () {
    return {
      mapNum: 0,
      projectInfo: {},
      formatInfo: {},
      crs: L.CRS.EPSG3857,
      crsResolution: [152.87436235289138, 76.43717985352637, 38.2185912496825, 19.10929430192194, 9.55464715096097, 4.777323575480485, 2.3886631106595546, 1.1943315553297773, 0.5971657776648887, 0.2985828888324443, 0.14929144441622216],
      crsOrigin: [0, 0],
      maxBounds: null,
      initBounds: null,
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
        // zoomControl: false,
        doubleClickZoom: false,
        closePopupOnClick: false,
        attributionControl: false
      }
    }
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom
    },
    centerUpdate (center) {
      this.currentCenter = center
    },
    loadProjectInfo (projectInfo, formatInfo) {
      this.mapNum = 0
      this.projectInfo = projectInfo
      this.formatInfo = formatInfo
      this.createCrs(projectInfo)
      this.zoomAndBounds(projectInfo)
      this.mapNum = 1
      this.$nextTick(() => {
        this.controlInit()
        for (const i in formatInfo.allService) {
          this.loadLayer(formatInfo.allService[i])
        }
      })
    },
    createCrs (projectInfo) {
      const commonGeographicCrs = ['EPSG:4214', 'EPSG:4326', 'EPSG:4490', 'EPSG:4555', 'EPSG:4610']
      if (commonGeographicCrs.indexOf(projectInfo.crsName) > -1) {
        return
      }
      if (projectInfo.resolution) {
        this.crsResolution = projectInfo.resolution.split(',')
        for (const i in this.crsResolution) {
          this.crsResolution[i] = Number(this.crsResolution[i])
        }
      }
      if (projectInfo.origin) {
        this.crsOrigin = projectInfo.origin.split(',')
        for (const i in this.crsOrigin) {
          this.crsOrigin[i] = Number(this.crsOrigin[i])
        }
      }
      this.crs = new L.Proj.CRS(
        projectInfo.crsName,
        projectInfo.crsConfig.split("'")[1] ? projectInfo.crsConfig.split("'")[1] : projectInfo.crsConfig, {
          resolutions: this.crsResolution,
          origin: this.crsOrigin
        }
      )
    },
    zoomAndBounds (projectInfo) {
      // 此处处理转换需要判定是否经纬度
      const maxBoundsData = (projectInfo.maxBounds.split('[').length > 1) ? projectInfo.maxBounds.split('[')[1].split(']')[0].split(',') : projectInfo.maxBounds.split(',')
      const maxConner1 = this.crs.projection.unproject(new L.point(Number(maxBoundsData[0]), Number(maxBoundsData[1])))
      const maxConner2 = this.crs.projection.unproject(new L.point(Number(maxBoundsData[2]), Number(maxBoundsData[3])))
      this.maxBounds = L.latLngBounds(maxConner1, maxConner2)

      const initBoundsData = (projectInfo.initBounds.split('[').length > 1) ? projectInfo.initBounds.split('[')[1].split(']')[0].split(',') : projectInfo.initBounds.split(',')
      const initConner1 = this.crs.projection.unproject(L.point(Number(initBoundsData[0]), Number(initBoundsData[1])))
      const initConner2 = this.crs.projection.unproject(L.point(Number(initBoundsData[2]), Number(initBoundsData[3])))
      this.initBounds = L.latLngBounds(initConner1, initConner2)
    },
    controlInit () {
      this.$refs.map[0].mapObject._projectInfo = this.projectInfo
      new L.Control.Fullscreen({
        title: {
          'false': 'View Fullscreen',
          'true': 'Exit Fullscreen'
        }
      }).addTo(this.$refs.map[0].mapObject)
      L.control.mousePosition().addTo(this.$refs.map[0].mapObject)
      L.control.Measure().addTo(this.$refs.map[0].mapObject)
      L.control.Swipe().addTo(this.$refs.map[0].mapObject)
    },
    loadLayer (serviceInfo) {
      const oprateMap = this.$refs.map[0].mapObject
      var thisLayer
      if (serviceInfo.showLayers) {
        _.orderBy(serviceInfo.showLayers, ['sortNo'], ['desc'])
      }
      var layerUrl = serviceInfo.serviceUrl
      var thezIndex = 100 - serviceInfo.orderNo
      // $.ajax({
      //   type: 'get',
      //   url: layerUrl + '?f=pjson',
      //   success: function (data) {
      //     var layerInfo = JSON.parse(data)
      //     var maxBoundsData = layerInfo.fullExtent
      //     var maxBounds
      //     var maxConner1 = oprateMap.options.crs.projection.unproject(new L.point(maxBoundsData.xmin, maxBoundsData.ymin))
      //     var maxConner2 = oprateMap.options.crs.projection.unproject(new L.point(maxBoundsData.xmax, maxBoundsData.ymax))
      //     maxBounds = L.latLngBounds(maxConner1, maxConner2)
      if (serviceInfo.serviceType === 1) {
        const layers = []
        for (const j in serviceInfo.showLayers) {
          layers.push(serviceInfo.showLayers[j].name)
        }
        var serviceUrl = layerUrl.split('/rest')[0] + layerUrl.split('/rest')[1] + '/WMSServer'
        thisLayer = L.tileLayer.wms(serviceUrl, {
          layers: layers,
          format: 'image/png',
          transparent: true,
          zIndex: thezIndex,
          // bounds: maxBounds,
          maxZoom: oprateMap.getMaxZoom()
        }).addTo(oprateMap)
      } else if (serviceInfo.serviceType === 2) {
        const layers = []
        for (const j in serviceInfo.showLayers) {
          if (serviceInfo.showLayers[j].id) {
            layers.push(serviceInfo.showLayers[j].id)
          }
        }
        thisLayer = dynamicMapLayer({
          url: layerUrl,
          f: 'image',
          layers: layers,
          pane: 'tilePane',
          zIndex: thezIndex,
          opacity: layers.length ? 1 : 0
          // bounds: maxBounds
        }).addTo(oprateMap)
        thisLayer.on('load', function () {
          if (thisLayer._currentImage && thisLayer._currentImage._image) {
            thisLayer._currentImage._image.style.zIndex = thezIndex
          }
        })
      } else if (serviceInfo.serviceType === 3) {
        thisLayer = L.tileLayer(layerUrl + '/tile/{z}/{y}/{x}', {
          // bounds: maxBounds,
          opacity: serviceInfo.opacity,
          zIndex: thezIndex
        }).addTo(oprateMap)
      }
      if (!oprateMap._baseLayerList) {
        oprateMap._baseLayerList = []
      }
      oprateMap._baseLayerList.push({ layerBsm: serviceInfo.bsm, thelayer: thisLayer })
      // }
      // })
    },
    checkLayers (keys, isCheck) {
      var result = getChildLayersByBsm(this.projectInfo, keys)
      var changeServices = []
      for (let i = 0; i < result.length; i++) {
        var thisService
        var allService = this.formatInfo.allService
        for (const j in allService) {
          if ((result[i].serviceBsm && allService[j].bsm === result[i].serviceBsm) || (!result[i].serviceBsm && allService[j].bsm === result[i].bsm)) {
            thisService = allService[j]
            break
          }
        }
        if (!result[i].projectBsm) {
          if (isCheck) {
            thisService.showLayers.push(result[i])
          } else {
            for (const j in thisService.showLayers) {
              if (result[i].bsm === thisService.showLayers[j].bsm) {
                thisService.showLayers.splice(j, 1)
                break
              }
            }
          }
        } else {
          if (thisService.gisLayerList && thisService.serviceType !== 3) {
            thisService.showLayers = thisService.showLayers.length ? [] : thisService.gisLayerList
          } else if (thisService.serviceType === 3) {
            thisService.opacity = thisService.opacity ? 0 : 1
          }
        }
        if (changeServices.indexOf(thisService) === -1) {
          changeServices.push(thisService)
        }
      }
      for (var i in changeServices) {
        this.oprateLayers(changeServices[i])
      }
    },
    oprateLayers (thisService) {
      const oprateMap = this.$refs.map[0].mapObject
      var oprateLayer
      for (const i in oprateMap._baseLayerList) {
        if (thisService.bsm === oprateMap._baseLayerList[i].layerBsm) {
          oprateLayer = oprateMap._baseLayerList[i].thelayer
        }
      }
      if (thisService.serviceType === 1) {
        const layers = []
        _.orderBy(thisService.showLayers, ['sortNo'], ['desc'])
        for (const i in thisService.showLayers) {
          if (thisService.showLayers[i].name) {
            layers.push(thisService.showLayers[i].name)
          }
        }
        oprateLayer.setParams({
          layers: layers,
          format: 'image/png',
          transparent: true,
          zIndex: 100 - thisService.orderNo
        })
      } else if (thisService.serviceType === 2) {
        const layers = []
        _.orderBy(thisService.showLayers, ['sortNo'], ['desc'])
        for (const i in thisService.showLayers) {
          if (thisService.showLayers[i].id) {
            layers.push(thisService.showLayers[i].id)
          }
        }
        if (layers.length === 0) {
          oprateLayer.setOpacity(0)
        } else {
          oprateLayer.setLayers(layers)
          oprateLayer.setOpacity(1)
        }
      } else if (thisService.serviceType === 3) {
        oprateLayer.setOpacity(thisService.opacity)
      }
    },
    boundsUpdated () {

    }
  },
  watch: {
    zoomControl: {
      immediate: true,
      handler (val) {
        if (typeof this.zoomControl !== 'undefined') {
          this.mapOptions.zoomControl = val
        }
      }
    }
  }
}
</script>
