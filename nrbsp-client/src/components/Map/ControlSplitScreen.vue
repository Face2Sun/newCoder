<template>
  <div class="control-split-screen">
    <a-button @click="distoryAllMap">
      单屏
    </a-button>
    <a-button @click="splitTwoScreen">
      分双屏
    </a-button>
    <a-button @click="splitFourScreen">
      分四屏
    </a-button>
  </div>
</template>

<script>
import L from 'leaflet'

export default {
  components: {
    L
  },
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      splitX: 1,
      splitY: 1,
      allMap: [],
      mapContainerX: undefined,
      mapContainerY: undefined
    }
  },
  created () {
    this.mapContainerX = this.map.getContainer().parentNode.offsetWidth
    this.mapContainerY = this.map.getContainer().parentNode.offsetHeight
  },
  methods: {
  // 销毁全部生成的分屏
    distoryAllMap () {
      if (this.splitY !== 1 || this.splitX !== 1) {
        var mapMoudelWrapper = this.map.getContainer().parentNode.parentNode
        var syncMaps = this.map._syncMaps
        for (let i = syncMaps.length - 1; i >= 0; i--) {
          this.map.unsync(syncMaps[i])
        }
        for (let i = 1; i < this.allMap.length; i++) {
          L.DomUtil.remove(this.allMap[i].getContainer().parentNode.parentNode)
          this.allMap[i].remove()
        }
        var mapMoudelWrapperId = mapMoudelWrapper.getAttribute('id')
        mapMoudelWrapper.removeAttribute('id')
        mapMoudelWrapper.parentNode.setAttribute('id', mapMoudelWrapperId)
        var childLength = mapMoudelWrapper.childNodes.length
        for (let i = 0; i < childLength; i++) {
          mapMoudelWrapper.parentNode.appendChild(mapMoudelWrapper.childNodes[0])
        }
        mapMoudelWrapper.parentNode.removeChild(mapMoudelWrapper)
        // var mapInfoWrapper = $(this.map.getContainer()).parent()
        // mapInfoWrapper.splitter('toggle', '#' + mapMoudelWrapperId + '-mapInfo-Content')
        // mapInfoWrapper.splitter('toggle', '#' + mapMoudelWrapperId + '-mapInfo-Content')
        this.allMap = []
        this.map.invalidateSize()
        for (let i = 0; i < this._splitcontainer.childNodes.length; i++) {
          this._splitcontainer.childNodes[i].removeAttribute('class')
        }
        this.splitX = 1
        this.splitY = 1

        if (this.map._navbarControl) {
          var navbarControl = this.map._navbarControl
          navbarControl.getContainer().style.display = 'block'
          navbarControl._viewHistory = [navbarControl._viewHistory[0], navbarControl._viewHistory[navbarControl._viewHistory.length - 1]]
          navbarControl._curIndx = 1
          navbarControl._updateDisabled()
          this.map.off('moveend', navbarControl._updateHistory)
          this.map.once('moveend', function () { this.map.on('moveend', navbarControl._updateHistory, navbarControl) }, navbarControl)
        }
      }
    },
    // 分两个屏
    splitTwoScreen (e) {
      this.splitX = 2
      this.splitY = 1
      this.splitScreen()
      e.stopPropagation()
    },
    // 分四个屏
    splitFourScreen (e) {
      this.splitX = 2
      this.splitY = 2
      this.splitScreen()
      e.stopPropagation()
    },
    // 执行分屏方法
    splitScreen () {
      if (this.map._measureControl && this.map.hasLayer(this.map._measureControl.moveIcon)) {
        this.map._measureControl.measure_layerGroup[this.map._measureControl.measure_layerGroup.length - 1].clearLayers()
        this.map._measureControl.cancleMeasureListener()
      }
      if (this.map._markerControl && (this.map.hasLayer(this.map._markerControl.moveMarker) || this.map.hasLayer(this.map._markerControl.moveIcon))) {
        this.map._markerControl.cancleMarkerListener()
      }
      var splitX = this.splitX
      var splitY = this.splitY
      if (this.allMap.length !== 0 && this.allMap.length !== this.splitX * this.splitY) {
        this.distoryAllMap()
        this.splitX = splitX
        this.splitY = splitY
      } else if (this.allMap.length === this.splitX * this.splitY) {
        this.distoryAllMap()
        return
      }
      if (this.splitX * this.splitY === 2) {
        L.DomUtil.addClass(this._twoScreenContainer, 'leaflet-control-twoScreenActive')
      } else if (this.splitX * this.splitY === 4) {
        L.DomUtil.addClass(this._fourScreenContainer, 'leaflet-control-fourScreenActive')
      }

      var newWidth = (100 / splitX - 0.4) + '%'
      var newHeight = (100 / splitY - 0.4) + '%'

      var mapMoudelWrapper = this.map.getContainer().parentNode.parentNode
      // var mapMoudelWrapperId = $(mapMoudelWrapper).attr('id')
      var mapMoudelWrapperId = mapMoudelWrapper.id
      console.log(mapMoudelWrapperId)
      var allMapWrapper = mapMoudelWrapper.cloneNode()
      allMapWrapper.removeAttribute('id')
      allMapWrapper.innerHTML = ''
      mapMoudelWrapper.parentNode.insertBefore(allMapWrapper, mapMoudelWrapper)
      allMapWrapper.appendChild(mapMoudelWrapper)
      allMapWrapper.style.overflow = 'hidden'

      mapMoudelWrapper.removeAttribute('class')
      mapMoudelWrapper.removeAttribute('style')
      mapMoudelWrapper.style.width = newWidth
      mapMoudelWrapper.style.height = newHeight
      L.DomUtil.addClass(mapMoudelWrapper, 'leaflet-splitScreen-newmapPosition')

      // var mapInfoWrapper = $(this.map.getContainer()).parent()
      // mapInfoWrapper.splitter('toggle', '#' + mapMoudelWrapperId + '-mapInfo-Content')
      // mapInfoWrapper.splitter('toggle', '#' + mapMoudelWrapperId + '-mapInfo-Content')
      this.map.invalidateSize()

      if (this.map._navbarControl) {
        var navbarControl = this.map._navbarControl
        navbarControl.getContainer().style.display = 'none'
      }

      this.allMap.push(this.map)
      for (var i = 1; i < splitX * splitY; i++) {
        var newContainer = L.DomUtil.create('div', '', mapMoudelWrapper.parentNode)
        newContainer.setAttribute('id', 'leaflet-splitScreen-newMap' + i)
        newContainer.style.width = newWidth
        newContainer.style.height = newHeight
        L.DomUtil.addClass(newContainer, 'leaflet-splitScreen-newmapPosition')
        var newInfo = this.map._projectInfo
        var newmap = this.createMapModule('leaflet-splitScreen-newMap' + i, newInfo, true)
        newmap.setMinZoom(this.map.getMinZoom())
        newmap.setMaxZoom(this.map.getMaxZoom())
        newmap._projectInfo = newInfo
        this.allMap.push(newmap)
      }
      for (let i = 0; i < splitX * splitY; i++) {
        for (let j = 0; j < splitX * splitY; j++) {
          if (i !== j) {
            this.allMap[i].sync(this.allMap[j])
          }
        }
      }
    }
    // createMapModule (moduleWrapperId, projectInfo, split) {
    //   var moudleWrapper = $('#' + moduleWrapperId)
    //   moudleWrapper.addClass('leaflet-map-wrapper')

    //   var mapInfoMenu = $('<div></div>').addClass('leaflet-mapInfo-Menu').appendTo(moudleWrapper)
    //   $("<a href='javascript:void(0)'></a>").addClass('leaflet-mapInfo-Menu-visited').html("<span class='glyphicon glyphicon-th-list' ></span>数据").appendTo(mapInfoMenu)

    //   var mapInfoWrapper = $('<div></div>').addClass('leaflet-mapInfo-Wrapper').appendTo(moudleWrapper)

    //   var mapInfoContent = $('<div></div>').attr('id', moduleWrapperId + '-mapInfo-Content').addClass('leaflet-mapInfo-Content').appendTo(mapInfoWrapper)

    //   var mapInfoExpend = $("<div title='隐藏当前窗口'></div>").addClass('leaflet-mapInfo-expend').html("<span class='glyphicon glyphicon-transfer' ></span>").appendTo(mapInfoContent)

    //   $('<div></div>').attr('id', moduleWrapperId + '-map-layerTree').addClass('leaflet-mapInfo-detailOpen').appendTo(mapInfoContent)

    //   var mapContainer = $('<div></div>').attr('id', moduleWrapperId + '-map-container').addClass('leaflet-map-container').appendTo(mapInfoWrapper)
    //   $('<div></div>').addClass('leaflet-mapInfo-display').html("<span class='glyphicon glyphicon-triangle-right' ></span>专题信息").appendTo(mapContainer)

    //   var oprateMap
    //   if (!split) {
    //     oprateMap = createMap(moduleWrapperId + '-map-container', projectInfo)
    //   } else {
    //     oprateMap = createSplitMap(moduleWrapperId + '-map-container', projectInfo)
    //   }
    //   loadLayerTree(moduleWrapperId + '-map-legend', moduleWrapperId + '-map-layerTree', oprateMap, JSON.parse(JSON.stringify(projectInfo)))

    //   mapInfoWrapper.splitter({
    //     panes: [
    //       { collapsible: true, size: '250px' },
    //       { collapsible: false }
    //     ],
    //     create: function () { // 初始化完成事件
    //     	mapInfoWrapper.splitter('collapse', '#' + moduleWrapperId + '-mapInfo-Content')
    //     },
    //     layoutChange: function () { // 布局改变后的事件
    //       oprateMap.invalidateSize()
    //     },
    //     collapse: function (collapsedTarget) { // collapse事件
    //     	mapInfoWrapper.find('.ui-expand-prev').remove()
    //     	mapInfoWrapper.find('.leaflet-mapInfo-display').find('span').attr('class', 'glyphicon glyphicon-triangle-right')
    //     },
    //     expand: function (expandedTarget) { // expand前事件
    //     	mapInfoWrapper.find('.ui-collapse-prev').remove()
    //       mapInfoWrapper.find('.leaflet-mapInfo-display').find('span').attr('class', 'glyphicon glyphicon-triangle-left')
    //     }
    //   })

    //   $('#' + moduleWrapperId + ' .leaflet-mapInfo-expend').on('click', function () {
    //     mapInfoWrapper.splitter('collapse', '#' + moduleWrapperId + '-mapInfo-Content')
    //   })

    //   $('#' + moduleWrapperId + ' .leaflet-mapInfo-display').on('click', function (e) {
    //     mapInfoWrapper.splitter('toggle', '#' + moduleWrapperId + '-mapInfo-Content')
    //     e.stopPropagation()
    //   })
    //   $('#' + moduleWrapperId + ' .leaflet-mapInfo-display').on('mousedown', function (e) {
    //     e.stopPropagation()
    //   })
    //   $('#' + moduleWrapperId + ' .leaflet-mapInfo-display').on('mouseup', function (e) {
    //     e.stopPropagation()
    //   })

    //   $('#' + moduleWrapperId + ' .leaflet-mapInfo-Menu').on('click', 'a', function (e) {
    //     $('#' + moduleWrapperId + ' .leaflet-mapInfo-Menu>a').removeClass('leaflet-mapInfo-Menu-visited')
    //     $(this).addClass('leaflet-mapInfo-Menu-visited')
    //     $('#' + moduleWrapperId + ' .leaflet-mapInfo-Content').children().removeClass('leaflet-mapInfo-detailOpen')
    //     $('#' + moduleWrapperId + ' .leaflet-mapInfo-Content').children().eq($(this).index() + 1).addClass('leaflet-mapInfo-detailOpen')
    //     $('#' + moduleWrapperId + ' .leaflet-mapInfo-display').find('span').attr('class', 'glyphicon glyphicon-triangle-left')
    //     mapInfoWrapper.splitter('expand', '#' + moduleWrapperId + '-mapInfo-Content')
    //     e.stopPropagation()
    //   })

    //   $('#' + moduleWrapperId + ' .leaflet-mapInfo-Menu').on('click', 'a>span:not(.glyphicon)', function (e) {
    //     var thisIndex = $(this).parent().index()
    //     $(this).parent().remove()
    //     var infoDetailDisplay = $('#' + moduleWrapperId + ' .leaflet-mapInfo-Content').children().eq(thisIndex + 1).css('display')
    //     if ($('#' + moduleWrapperId + ' .leaflet-mapInfo-Content').children().eq(thisIndex + 1).hasClass('leaflet-identify-identifyInfo')) {
    //       oprateMap._identifyControl.cancleIdentifyListener()
    //     }
    //     if ($('#' + moduleWrapperId + ' .leaflet-mapInfo-Content').children().eq(thisIndex + 1).hasClass('leaflet-search-searchInfo')) {
    //       oprateMap._searchControl.clearResultLayer()
    //     }
    //     $('#' + moduleWrapperId + ' .leaflet-mapInfo-Content').children().eq(thisIndex + 1).remove()
    //     if (infoDetailDisplay == 'block' && mapInfoContent.width() == 0) {
    //       $('#' + moduleWrapperId + ' .leaflet-mapInfo-Menu>a').eq(thisIndex - 1).click()
    //       mapInfoWrapper.splitter('collapse', '#' + moduleWrapperId + '-mapInfo-Content')
    //     } else if (infoDetailDisplay == 'block') {
    //       $('#' + moduleWrapperId + ' .leaflet-mapInfo-Menu>a').eq(thisIndex - 1).click()
    //     }
    //     e.stopPropagation()
    //   })

    //   return oprateMap
    // },

    // createMap (mapContainerId, projectInfo) {
    //   var crsResolution
    //   var crsOrigin
    //   if (projectInfo.resolution) {
    //     crsResolution = projectInfo.resolution.split(',')
    //     for (var i in crsResolution) {
    //       crsResolution[i] = Number(crsResolution[i])
    //     }
    //   } else {
    //     crsResolution = [152.87436235289138, 76.43717985352637, 38.2185912496825, 19.10929430192194, 9.55464715096097, 4.777323575480485, 2.3886631106595546, 1.1943315553297773, 0.5971657776648887, 0.2985828888324443, 0.14929144441622216]
    //   }
    //   if (projectInfo.origin) {
    //     crsOrigin = projectInfo.origin.split(',')
    //     for (var i in crsOrigin) {
    //       crsOrigin[i] = Number(crsOrigin[i])
    //     }
    //   } else {
    //     crsOrigin = [0, 0]
    //   }
    //   var crs = new L.Proj.CRS(
    //     projectInfo.crsName,
    //     projectInfo.crsConfig.split("'")[1] ? projectInfo.crsConfig.split("'")[1] : projectInfo.crsConfig,
    //     {
    //       resolutions: crsResolution,
    //       origin: crsOrigin
    //     }
    //   )

    //   // 此处处理转换需要判定是否经纬度
    //   var maxBoundsData = (projectInfo.maxBounds.split('[').length > 1) ? projectInfo.maxBounds.split('[')[1].split(']')[0].split(',') : projectInfo.maxBounds.split(',')
    //   var maxConner1 = crs.projection.unproject(new L.point(maxBoundsData[0], maxBoundsData[1]))
    //   var maxConner2 = crs.projection.unproject(new L.point(maxBoundsData[2], maxBoundsData[3]))
    //   var maxBounds = L.latLngBounds(maxConner1, maxConner2)

    //   var mapOptions = {
    //     maxBounds: maxBounds,
    //     zoomControl: false,
    //     doubleClickZoom: false,
    //     closePopupOnClick: false,
    //     attributionControl: false
    //   }

    //   var commonGeographicCrs = ['EPSG:4214', 'EPSG:4326', 'EPSG:4490', 'EPSG:4555', 'EPSG:4610']

    //   if (commonGeographicCrs.indexOf(projectInfo.crsName) < 0) {
    //     mapOptions.crs = crs
    //     mapOptions.maxZoom = crsResolution.length - 1
    //   }

    //   var map = L.map(mapContainerId, mapOptions)

    //   if (commonGeographicCrs.indexOf(projectInfo.crsName) >= 0) {
    //     var minZoom = map.getBoundsZoom(maxBounds)
    //     var maxZoom = minZoom + crsResolution.length - 1
    //     map.setMinZoom(minZoom) // 根据当前范围设置最小比例
    //     map.setMaxZoom(maxZoom)
    //   }

    //   map._projectInfo = projectInfo
    //   map.projInfoUtil = projInfoUtil(projectInfo)

    //   var initBoundsData = (projectInfo.initBounds.split('[').length > 1) ? projectInfo.initBounds.split('[')[1].split(']')[0].split(',') : projectInfo.initBounds.split(',')
    //   var initConner1 = crs.projection.unproject(L.point(initBoundsData[0], initBoundsData[1]))
    //   var initConner2 = crs.projection.unproject(L.point(initBoundsData[2], initBoundsData[3]))
    //   var initBounds = L.latLngBounds(initConner1, initConner2)
    //   map.fitBounds(initBounds)

    //   L.control.zoom({ zoomInTitle: '放大', zoomOutTitle: '缩小' }).addTo(map);
    //   (new L.Control.Fullscreen({
    //     pseudoFullscreen: true // if true, fullscreen to page width and height
    //   })).addTo(map)

    //   L.control.navbar().addTo(map)

    //   var scale = L.control.scale({
    // 	metric: true,
    // 	imperial: false
    //   }).addTo(map)
    //   L.control.mousePosition().addTo(map)

    //   // L.control.Image().addTo(map);
    //   L.control.Legend().addTo(map)
    //   L.control.Marker().addTo(map)
    //   L.control.Swipe().addTo(map)
    //   L.control.SplitScreen().addTo(map)
    //   L.control.Search().addTo(map)
    //   L.control.Identify().addTo(map)
    //   L.control.Measure().addTo(map)
    //   L.control.Position().addTo(map)
    //   if (projectInfo.businessList && projectInfo.businessList.length > 0) {
    // 	L.control.ProjTools().addTo(map)
    //   }
    //   return map
    // },

    // createSplitMap (mapContainerId, projectInfo) {
    //   var crsResolution
    //   var crsOrigin
    //   if (projectInfo.resolution) {
    //     crsResolution = projectInfo.resolution.split(',')
    //     for (var i in crsResolution) {
    //       crsResolution[i] = Number(crsResolution[i])
    //     }
    //   } else {
    //     crsResolution = [152.87436235289138, 76.43717985352637, 38.2185912496825, 19.10929430192194, 9.55464715096097, 4.777323575480485, 2.3886631106595546, 1.1943315553297773, 0.5971657776648887, 0.2985828888324443, 0.14929144441622216]
    //   }
    //   if (projectInfo.origin) {
    //     crsOrigin = projectInfo.origin.split(',')
    //     for (var i in crsOrigin) {
    //       crsOrigin[i] = Number(crsOrigin[i])
    //     }
    //   } else {
    //     crsOrigin = [0, 0]
    //   }
    //   var crs = new L.Proj.CRS(
    //     projectInfo.crsName,
    //     projectInfo.crsConfig.split("'")[1] ? projectInfo.crsConfig.split("'")[1] : projectInfo.crsConfig,
    //     {
    //       resolutions: crsResolution,
    //       origin: crsOrigin
    //     }
    //   )

    //   var mapOptions = {
    //     maxZoom: crsResolution.length - 1,
    //     zoomControl: false,
    //     doubleClickZoom: false,
    //     closePopupOnClick: false,
    //     attributionControl: false
    //   }

    //   var commonGeographicCrs = ['EPSG:4214', 'EPSG:4326', 'EPSG:4490', 'EPSG:4555', 'EPSG:4610']

    //   if (commonGeographicCrs.indexOf(projectInfo.crsName) < 0) {
    //     mapOptions.crs = crs
    //   }

    //   var map = L.map(mapContainerId, mapOptions)

    //   map._projectInfo = projectInfo
    //   map.projInfoUtil = projInfoUtil(projectInfo)

    //   L.control.zoom({ zoomInTitle: '放大', zoomOutTitle: '缩小' }).addTo(map)

    //   var scale = L.control.scale({
    // 	metric: true,
    // 	imperial: false
    //   }).addTo(map)
    //   L.control.mousePosition().addTo(map)
    //   // L.control.Image().addTo(map);
    //   L.control.Marker().addTo(map)
    //   L.control.Identify().addTo(map)
    //   L.control.Measure().addTo(map)
    //   return map
    // },
    // projInfoUtil (projectinfo) {
    //   var serviceList = projectinfo.serviceList
    //   this.getServerUrlByLayerName = function (theLayerName) {
    //     var layerUrl
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].title == theLayerName) {
    //           layerUrl = serviceList[i].serviceUrl
    //           break outer
    //         }
    //       }
    //       if (layerUrl) {
    //         break
    //       }
    //     }
    //     return layerUrl
    //   }

    //   this.getLayerUrlByLayerName = function (theLayerName) {
    //     var layerUrl
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].title == theLayerName) {
    //           layerUrl = serviceList[i].serviceUrl + '/' + layerList[j].id
    //           break outer
    //         }
    //       }
    //       if (layerUrl) {
    //         break
    //       }
    //     }
    //     return layerUrl
    //   }

    //   this.getLayerUrlByLayerBsm = function (layerBsm) {
    //     var layerUrl
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].bsm == layerBsm) {
    //           layerUrl = serviceList[i].serviceUrl + '/' + layerList[j].id
    //           break outer
    //         }
    //       }
    //       if (layerUrl) {
    //         break
    //       }
    //     }
    //     return layerUrl
    //   }

    //   this.getWfsUrlByLayerName = function (theLayerName) {
    //     var layerUrl
    //     var wfsUrl
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].title == theLayerName) {
    //           layerUrl = serviceList[i].serviceUrl
    //           wfsUrl = layerUrl.split('/rest')[0] + layerUrl.split('/rest')[1] + '/WFSServer'
    //           break outer
    //         }
    //       }
    //       if (layerUrl) {
    //         break
    //       }
    //     }
    //     return wfsUrl
    //   }

    //   this.getIdByLayerName = function (theLayerName) {
    //     var layerId
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].title == theLayerName) {
    //           layerId = layerList[j].id
    //           break outer
    //         }
    //       }
    //       if (layerId) {
    //         break
    //       }
    //     }
    //     return layerId
    //   }

    //   this.getAttrByLayerName = function (theLayerName) {
    //     var layerAttr
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].title == theLayerName) {
    //           layerAttr = layerList[j].attributeList
    //           break outer
    //         }
    //       }
    //     }
    //     return layerAttr
    //   }

    //   this.getAttrByLayerBsm = function (layerBsm) {
    //     var layerAttr
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].bsm == layerBsm) {
    //           layerAttr = layerList[j].attributeList
    //           break outer
    //         }
    //       }
    //     }
    //     return layerAttr
    //   }

    //   this.getAttrByLayerId = function (layerId) {
    //     var layerAttr
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].id == layerId) {
    //           layerAttr = layerList[j].attributeList
    //           break outer
    //         }
    //       }
    //     }
    //     return layerAttr
    //   }

    //   this.getLayerNameByBsm = function (layerBsm) {
    //     var layerName
    //     outer:
    //     for (var i = 0; i < serviceList.length; i++) {
    //       var layerList = serviceList[i].gisLayerList
    //       for (var j = 0; j < layerList.length; j++) {
    //         if (layerList[j].bsm == layerBsm) {
    //           layerName = layerList[j].title
    //           break outer
    //         }
    //       }
    //     }
    //     return layerName
    //   }

    //   this.getDefaultAbleBusiness = function () {
    //     for (var i in projectinfo.businessList) {
    //       if (projectinfo.businessList[i].defaultEnable == 1) {
    //         return projectinfo.businessList[i]
    //       }
    //     }
    //   }

    //   return this
    // }

  }
}
</script>
<style lang="less" scoped>
.control-split-screen{
  width: 312px;
  height: 32px;
}
</style>
