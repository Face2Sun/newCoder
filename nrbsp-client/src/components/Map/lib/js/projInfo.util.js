function projInfoUtil (projectinfo) {
  var serviceList = projectinfo.serviceList
  this.getServerUrlByLayerName = function (theLayerName) {
    var layerUrl
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].title == theLayerName) {
          layerUrl = serviceList[i].serviceUrl
          break outer
        }
      }
      if (layerUrl) {
        break
      }
    }
    return layerUrl
  }

  this.getLayerUrlByLayerName = function (theLayerName) {
    var layerUrl
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].title == theLayerName) {
          layerUrl = serviceList[i].serviceUrl + '/' + layerList[j].id
          break outer
        }
      }
      if (layerUrl) {
        break
      }
    }
    return layerUrl
  }

  this.getLayerUrlByLayerBsm = function (layerBsm) {
    var layerUrl
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].bsm == layerBsm) {
          layerUrl = serviceList[i].serviceUrl + '/' + layerList[j].id
          break outer
        }
      }
      if (layerUrl) {
        break
      }
    }
    return layerUrl
  }

  this.getWfsUrlByLayerName = function (theLayerName) {
    var layerUrl
    var wfsUrl
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].title == theLayerName) {
          layerUrl = serviceList[i].serviceUrl
          wfsUrl = layerUrl.split('/rest')[0] + layerUrl.split('/rest')[1] + '/WFSServer'
          break outer
        }
      }
      if (layerUrl) {
        break
      }
    }
    return wfsUrl
  }

  this.getIdByLayerName = function (theLayerName) {
    var layerId
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].title == theLayerName) {
          layerId = layerList[j].id
          break outer
        }
      }
      if (layerId) {
        break
      }
    }
    return layerId
  }

  this.getAttrByLayerName = function (theLayerName) {
    var layerAttr
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].title == theLayerName) {
          layerAttr = layerList[j].attributeList
          break outer
        }
      }
    }
    return layerAttr
  }

  this.getAttrByLayerBsm = function (layerBsm) {
    var layerAttr
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].bsm == layerBsm) {
          layerAttr = layerList[j].attributeList
          break outer
        }
      }
    }
    return layerAttr
  }

  this.getAttrByLayerId = function (layerId) {
    var layerAttr
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].id == layerId) {
          layerAttr = layerList[j].attributeList
          break outer
        }
      }
    }
    return layerAttr
  }

  this.getLayerNameByBsm = function (layerBsm) {
    var layerName
    outer:
    for (var i = 0; i < serviceList.length; i++) {
      var layerList = serviceList[i].gisLayerList
      for (var j = 0; j < layerList.length; j++) {
        if (layerList[j].bsm == layerBsm) {
          layerName = layerList[j].title
          break outer
        }
      }
    }
    return layerName
  }

  this.getDefaultAbleBusiness = function () {
    for (var i in projectinfo.businessList) {
      if (projectinfo.businessList[i].defaultEnable == 1) {
        return projectinfo.businessList[i]
      }
    }
  }

  return this
}
