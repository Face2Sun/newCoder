import './../index.less'
import L from 'leaflet'
/** 添加测量控件 **/
L.Control.Measure = L.Control.extend({
  options: {
    position: 'bottomright' // 初始位置
  },
  initialize: function (options) {
    L.Util.extend(this.options, options)
    this.measure_layerGroup = []
    this.marker_zindex = 2000
    this.measureNum = 0
    this.moveIcon = L.marker([0, 0], {
      zIndexOffset: this.marker_zindex
    })
    this.clickMarkerOptions = {
      radius: 3,
      color: 'red',
      opacity: 0.6,
      weight: 2,
      fillColor: '#FFFFFF',
      fillOpacity: 1
    }
  },
  onAdd: function (map) {
    this.measureNum = 0
    this.measure_layerGroup = []
    map._measureControl = this

    this._container = L.DomUtil.create('div', 'leaflet-measure-show')
    this._container.title = '测量'
    L.DomEvent.addListener(this._container, 'click', this.createMeasure, this)
    this.stopAllPropagation(this._container)

    this._measureContainer = L.DomUtil.create('div', 'leaflet-control-measure', this._container)
    this._measureContainer.style.display = 'none'
    var lengthContainer = L.DomUtil.create('div', '', this._measureContainer)
    lengthContainer.title = '测距离'
    this._lengthContainer = lengthContainer
    L.DomEvent.addListener(this._lengthContainer, 'click', this.formatLength, this)

    var areaContainer = L.DomUtil.create('div', '', this._measureContainer)
    areaContainer.title = '测面积'
    this._areaContainer = areaContainer
    L.DomEvent.addListener(this._areaContainer, 'click', this.formatArea, this)

    var clearContainer = L.DomUtil.create('div', '', this._measureContainer)
    clearContainer.title = '清空测量记录'
    this._clearContainer = clearContainer
    L.DomEvent.addListener(this._clearContainer, 'click', this.clearMeasure, this)

    return this._container
  },
  createMeasure: function () {
    if (this._measureContainer.style.display === 'none') {
      this._measureContainer.style.display = 'block'
    } else {
      this._measureContainer.style.display = 'none'
    }
  },
  formatLength: function (e) {
    this.clearNowMeasure()
    L.DomUtil.addClass(this._lengthContainer, 'leaflet-control-lengthActive')
    this._map.getContainer().style.cursor = 'pointer'
    this.lengthGroup = L.layerGroup([]).addTo(this._map)
    this.measure_layerGroup.push(this.lengthGroup)
    this.layerThisNum = this.measureNum++
    this.poly_points = [] // 所有线段的点
    this.poly_line = new L.Polyline([], { // 单击后显示的实线
      color: 'red',
      opacity: 0.6,
      weight: 2
    })
    this.dashLine = new L.Polyline([], {// 跟随鼠标移动的虚线
      color: 'red',
      opacity: 0.6,
      dashArray: [10, 10],
      weight: 2
    })

    this.distance = 0
    this.divIcon = L.marker([0, 0], {
      zIndexOffset: this.marker_zindex,
      riseOnHover: true
    })

    this.clickFunction = this.addLineLatlng
    this._map.on('click', this.clickFunction, this)

    this.moveFunction = this.addDashLine
    this._map.on('mousemove', this.moveFunction, this)

    this.dblclickFunction = this.showLine
    this._map.on('dblclick', this.dblclickFunction, this)

    this.rightClickFunction = this.cancleFormatLength
    this._map.on('contextmenu', this.rightClickFunction, this)

    e.stopPropagation()
  },
  addLineLatlng: function (e) {
    this.marker_zindex += 10

    this.clickLocation = [e.latlng.lat, e.latlng.lng]
    this.poly_points.push(this.clickLocation)

    this.poly_line.addLatLng(e.latlng)
    this.lengthGroup.addLayer(this.poly_line)
    this.clickMarker = L.circleMarker(this.clickLocation, this.clickMarkerOptions).addTo(this.lengthGroup)
    if (this.poly_points.length - 1 > 0) {
      var lastLocation = this.poly_points[this.poly_points.length - 2]
      this.distance = Number(this.distance) + Number(e.latlng.distanceTo(new L.LatLng(lastLocation[0], lastLocation[1])) / 1000)
      if (e.latlng.lat !== lastLocation[0] && e.latlng.lng !== lastLocation[1]) {
        this.divIcon = L.marker(this.clickLocation, {
          zIndexOffset: this.marker_zindex,
          icon: L.divIcon({ html: "<div class='leaflet-measure-measureTooltip'>" + this.outputLength(this.distance) + '</div>', className: 'leaflet-measure-noDefault' }),
          riseOnHover: true
        })
        this.divIcon.setZIndexOffset(this.marker_zindex)
        this.divIcon.addTo(this.lengthGroup)
      }
    } else {
      this.divIcon = L.marker(this.clickLocation, {
        zIndexOffset: this.marker_zindex,
        icon: L.divIcon({ html: "<div class='leaflet-measure-measureTooltip'>起点</div>", className: 'leaflet-measure-noDefault' }),
        riseOnHover: true
      })
      this.divIcon.setZIndexOffset(this.marker_zindex)
      this.divIcon.addTo(this.lengthGroup)
    }
  },
  addDashLine: function (e) {
    this.lengthGroup.addLayer(this.dashLine)
    this.moveIcon.addTo(this.lengthGroup)
    if (this.poly_points.length > 0) {
      var lastLocation = [this.poly_points[this.poly_points.length - 1][0], this.poly_points[this.poly_points.length - 1][1]]
      var dashPoints = [
        lastLocation,
        [e.latlng.lat, e.latlng.lng]
      ]
      var nowDistance = Number(this.distance) + Number((e.latlng.distanceTo(new L.LatLng(lastLocation[0], lastLocation[1]))) / 1000)
      this.dashLine.setLatLngs(dashPoints)
      this.moveIcon.setIcon(L.divIcon({ html: "<div class='leaflet-measure-measureTooltip'>当前" + this.outputLength(nowDistance) + '</div>', className: 'leaflet-measure-noDefault' }))
    } else {
      this.moveIcon.setIcon(L.divIcon({ html: "<div class='leaflet-measure-measureTooltip'>点击开始测量距离，双击结束</div>", className: 'leaflet-measure-noDefault' }))
    }
    this.moveIcon.setLatLng(e.latlng)
    this.moveIcon.setZIndexOffset(this.marker_zindex + 20)
  },
  showLine: function (e) {
    this.cancleMeasureListener()
    this.lengthGroup.removeLayer(this.dashLine)
    if (this.distance.toFixed(2) === 0) {
      this.lengthGroup.clearLayers()
    } else {
      this.lengthGroup.removeLayer(this.divIcon)
      var lastIcon = L.marker(this.clickLocation, {
        zIndexOffset: this.marker_zindex,
        riseOnHover: true,
        icon: L.divIcon({ html: "<div class='leaflet-measure-measureTooltip'>" + this.outputLength(this.distance) + '</div>', className: 'leaflet-measure-noDefault' })
      })
      lastIcon.setZIndexOffset(this.marker_zindex)
      lastIcon.addTo(this.lengthGroup)

      this.addDeleteBtn(lastIcon)
    }
  },
  outputLength: function (distance) {
    var outputLength
    if (distance < 1) {
      outputLength = Number(distance * 1000).toFixed(2) + 'm'
    } else {
      outputLength = Number(distance).toFixed(2) + 'km'
    }
    return outputLength
  },
  addDeleteBtn: function (lastIcon) {
    var measureLayerNum = this.layerThisNum
    var divIconArr = lastIcon.getPane().getElementsByClassName('leaflet-measure-noDefault')
    var deleteImg = L.DomUtil.create('div', 'leaflet-measure-deleteBtn', divIconArr[divIconArr.length - 1].childNodes[0])
    L.DomEvent.addListener(deleteImg, 'click', function () {
      this.measure_layerGroup[measureLayerNum].clearLayers()
    }, this)
  },
  cancleFormatLength: function (e) {
    if (this.distance === 0) {
      this.clearNowMeasure()
    } else {
      this.cancleMeasureListener()
      this.lengthGroup.removeLayer(this.dashLine)
      var lengthGroupLayers = this.lengthGroup.getLayers()
      this.addDeleteBtn(lengthGroupLayers[lengthGroupLayers.length - 1])
    }
  },
  formatArea: function (e) {
    // var me = this
    this.clearNowMeasure()
    L.DomUtil.addClass(this._areaContainer, 'leaflet-control-areaActive')
    this._map.getContainer().style.cursor = 'pointer'
    this.areaGroup = L.layerGroup([]).addTo(this._map)
    this.measure_layerGroup.push(this.areaGroup)
    this.layerThisNum = this.measureNum++

    this.poly_points = [] // 区域点

    this.ploy_area = new L.Polygon([], {
      color: 'red',
      opacity: 0.6,
      weight: 2,
      fillColor: 'red',
      fillOpacity: 0.1
    })

    this.ploy_now = new L.Polygon([], {
      color: 'red',
      opacity: 0.6,
      weight: 2,
      dashArray: [10, 10],
      fillColor: 'red',
      fillOpacity: 0.3
    })

    this.clickFunction = this.addPloyLatlng
    this._map.on('click', this.clickFunction, this)

    this.moveFunction = this.addPolyNow
    this._map.on('mousemove', this.moveFunction, this)

    this.dblclickFunction = this.showPoly
    this._map.on('dblclick', this.dblclickFunction, this)

    this.rightClickFunction = this.cancleFormatArea
    this._map.on('contextmenu', this.rightClickFunction, this)

    e.stopPropagation()
  },
  addPloyLatlng: function (e) {
    this.clickLocation = [e.latlng.lat, e.latlng.lng]
    this.poly_points.push(this.clickLocation)
    this.clickMarker = L.circleMarker(this.clickLocation, this.clickMarkerOptions).addTo(this.areaGroup)
  },
  addPolyNow: function (e) {
    this.areaGroup.addLayer(this.ploy_now)
    this.moveIcon.addTo(this.areaGroup)
    if (this.poly_points.length > 0) {
      this.ploy_now.setLatLngs(this.poly_points)
      this.ploy_now.addLatLng([e.latlng.lat, e.latlng.lng])
      var nowArea = L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(this.ploy_now.getLatLngs()[0]), 1)
      this.moveIcon.setIcon(L.divIcon({ html: "<div class='leaflet-measure-measureTooltip'>当前" + nowArea + '</div>', className: 'leaflet-measure-noDefault' }))
      this.moveIcon.setLatLng(this.ploy_now.getCenter())
    } else {
      this.moveIcon.setIcon(L.divIcon({ html: "<div class='leaflet-measure-measureTooltip'>点击开始测量面积，双击结束</div>", className: 'leaflet-measure-noDefault' }))
      this.moveIcon.setLatLng(e.latlng)
    }
    this.moveIcon.setZIndexOffset(this.marker_zindex + 20)
  },
  showPoly: function (e) {
    this.cancleMeasureListener()
    this.marker_zindex += 10
    this.areaGroup.removeLayer(this.ploy_now)
    this.ploy_area.setLatLngs(this.poly_points)
    this.areaGroup.addLayer(this.ploy_area)
    for (var i = 0; i < this.poly_points.length; i++) {
      var clickMarker = L.circleMarker(this.poly_points[i], {
        radius: 3,
        color: 'red',
        opacity: 0.6,
        weight: 2,
        fillColor: '#FFFFFF',
        fillOpacity: 1
      }).addTo(this.areaGroup)
    }
    console.log(clickMarker)
    var lastArea = L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(this.ploy_area.getLatLngs()[0]), 1)
    if (lastArea === '0.00 m&sup2') {
      this.areaGroup.clearLayers()
      return
    }
    var lastIcon = L.marker(this.ploy_area.getCenter(), {
      zIndexOffset: this.marker_zindex,
      riseOnHover: true,
      icon: L.divIcon({ html: "<div class='leaflet-measure-measureTooltip'>总计" + lastArea + '</div>', className: 'leaflet-measure-noDefault' })
    })
    lastIcon.setZIndexOffset(this.marker_zindex)
    lastIcon.addTo(this.areaGroup)

    this.addDeleteBtn(lastIcon)
  },
  cancleFormatArea: function (e) {
    if (this.poly_points.length < 3) {
      this.clearNowMeasure()
    } else {
      this.showPoly()
    }
  },
  clearNowMeasure: function (e) {
    if (this._map.hasLayer(this._map._measureControl.moveIcon)) {
      this.measure_layerGroup[this.measure_layerGroup.length - 1].clearLayers()
    }
    this.cancleMeasureListener()
  },
  clearMeasure: function (e) {
    this.cancleMeasureListener()
    for (var i = 0; i < this.measure_layerGroup.length; i++) {
      this.measure_layerGroup[i].clearLayers()
    }
    e.stopPropagation()
  },
  stopAllPropagation: function (domElement) {
    L.DomEvent.on(domElement, 'mousedown', function (ev) {
      L.DomEvent.stopPropagation(ev)
    })
    L.DomEvent.on(domElement, 'click', function (ev) {
      L.DomEvent.stopPropagation(ev)
    })
    L.DomEvent.on(domElement, 'mouseup', function (ev) {
      L.DomEvent.stopPropagation(ev)
    })
  },
  cancleMeasureListener: function () {
    if (this._map._markerControl && (this._map.hasLayer(this._map._markerControl.moveIcon) || this._map.hasLayer(this._map._markerControl.moveMarker))) {
      this._map._markerControl.cancleMarkerListener()
    }
    if (this._map._identifyControl) {
      var identifyControl = this._map._identifyControl
      for (let i = 0; i < identifyControl._identifycontainer.childNodes.length; i++) {
        if (identifyControl._identifycontainer.childNodes[i].hasAttribute('class')) {
          identifyControl._identifycontainer.childNodes[i].removeAttribute('class')
          identifyControl.cancleIdentifyListener()
          break
        }
      }
    }
    // if (this._map._projToolsControl && $(this._map._projToolsControl._container).hasClass('leaflet-projTools-active')) {
    //   var projToolsControl = this._map._projToolsControl
    //   if ($(projToolsControl._container).hasClass('leaflet-projTools-active')) {
    //     projToolsControl.cancleProjToolListener()
    //   }
    // }
    if (this._measureContainer) {
      for (let i = 0; i < this._measureContainer.childNodes.length; i++) {
        this._measureContainer.childNodes[i].removeAttribute('class')
      }
    }
    if (this.clickFunction) {
      this._map.off('click', this.clickFunction, this)
    }
    if (this.dblclickFunction) {
      this._map.off('dblclick', this.dblclickFunction, this)
    }
    if (this.moveFunction) {
      this._map.off('mousemove', this.moveFunction, this)
    }
    if (this.rightClickFunction) {
      this._map.off('contextmenu', this.rightClickFunction, this)
    }
    if (this._map.hasLayer(this._map._measureControl.moveIcon)) {
      this.moveIcon.removeFrom(this._map)
    }
    this._map.getContainer().style.cursor = '-webkit-grab'
  }
})

L.control.Measure = function (options) {
  return new L.Control.Measure(options)
}
