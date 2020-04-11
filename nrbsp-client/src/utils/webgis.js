import _ from 'lodash'

function loadTreeChildren (thisLayersInfo, thisServiceInfo) {
  if (thisLayersInfo.parentBsm === null) {
    if (!thisServiceInfo.children) {
      thisServiceInfo.children = []
      thisServiceInfo.expanded = true
    }
    let layerExist = false
    for (const i in thisServiceInfo.children) {
      if (thisServiceInfo.children[i].bsm === thisLayersInfo.bsm) {
        layerExist = true
        break
      }
    }
    if (!layerExist) {
      thisServiceInfo.children.push(thisLayersInfo)
    }
    return thisServiceInfo
  } else {
    for (const i in thisServiceInfo.gisLayerList) {
      if (thisServiceInfo.gisLayerList[i].bsm === thisLayersInfo.parentBsm) {
        if (!thisServiceInfo.gisLayerList[i].children) {
          thisServiceInfo.gisLayerList[i].children = []
          thisServiceInfo.gisLayerList[i].expanded = true
        }
        let layerExist = false
        for (const j in thisServiceInfo.gisLayerList[i].children) {
          if (thisServiceInfo.gisLayerList[i].children[j].bsm === thisLayersInfo.bsm) {
            layerExist = true
            break
          }
        }
        if (!layerExist) {
          thisServiceInfo.gisLayerList[i].children.push(thisLayersInfo)
          for (const j in thisServiceInfo.showLayers) {
            if (thisServiceInfo.gisLayerList[i].bsm === thisServiceInfo.showLayers[j].bsm) {
              thisServiceInfo.showLayers.splice(j, 1)
              break
            }
          }
        }
        return loadTreeChildren(thisServiceInfo.gisLayerList[i], thisServiceInfo)
      }
    }
  }
}

// 格式化专题信息
export function formatJsonInfo (serviceSource) {
  var serviceInfo = _.orderBy(serviceSource, ['orderNo'], ['asc'])
  var checkedArr = []
  var allService = []
  for (const l in serviceInfo) {
    if (serviceInfo[l].layerGroup === 2 || serviceInfo[l].serviceType === 3) {
      serviceInfo[l].treeName = serviceInfo[l].name
      if (serviceInfo[l].serviceType === 3) {
        serviceInfo[l].opacity = 0
      } else {
        serviceInfo[l].showLayers = []
      }
      if (serviceInfo[l].gisLayerList) {
        for (let i = 0; i < serviceInfo[l].gisLayerList.length; i++) {
          if (serviceInfo[l].gisLayerList[i].show === 1) {
            if (serviceInfo[l].serviceType === 3) {
              serviceInfo[l].opacity = 1
            } else {
              serviceInfo[l].showLayers = serviceInfo[l].gisLayerList
            }
            checkedArr.push(serviceInfo[l].bsm)
            break
          }
        }
      }
    } else {
      if (serviceInfo[l].groupName) {
        serviceInfo[l].treeName = serviceInfo[l].groupName
      }
      serviceInfo[l].showLayers = []
      var layersInfo = serviceInfo[l].gisLayerList
      for (let i = 0; i < layersInfo.length; i++) {
        layersInfo[i].treeName = layersInfo[i].alias ? layersInfo[i].alias : (layersInfo[i].title ? layersInfo[i].title : layersInfo[i].bsm)
        layersInfo[i].sortNo = i
        layersInfo[i].serviceBsm = serviceInfo[l].bsm
        if (layersInfo[i].enable !== 1 && layersInfo[i].show === 1) {
          checkedArr.push(layersInfo[i].bsm)
          serviceInfo[l].showLayers.push(layersInfo[i])
        }
      }
      for (let i = 0; i < layersInfo.length; i++) {
        if (layersInfo[i].enable !== 1) {
          loadTreeChildren(layersInfo[i], serviceInfo[l])
        }
      }
    }
    allService.push(serviceInfo[l])
  }
  // 所属组名相同的服务处理
  for (let i = 0; i < serviceInfo.length - 1; i++) {
    for (let j = i + 1; j < serviceInfo.length; j++) {
      if (serviceInfo[i].groupName === serviceInfo[j].groupName && serviceInfo[i].layerGroup !== 2 && serviceInfo[j].layerGroup !== 2) {
        for (const l in serviceInfo[j].children) {
          serviceInfo[i].children.push(serviceInfo[j].children[l])
        }
        serviceInfo.splice(j, 1)
      }
    }
  }
  // 所属组名为空，且图层分组不合并时服务处理
  for (let l in serviceInfo) {
    if (!serviceInfo[l].treeName) {
      var serviceLength = serviceInfo[l].children.length
      for (const i in serviceInfo[l].children) {
        serviceInfo.splice(Number(l) + Number(i), 0, serviceInfo[Number(l) + Number(i)].children[i])
      }
      l = Number(l) + Number(serviceLength)
      serviceInfo.splice(l, 1)
    }
  }

  return {
    serviceInfo: serviceInfo,
    checkedArr: checkedArr,
    allService: allService
  }
}

export function getChildLayersByBsm (projectInfo, layersBsm) {
  const result = []
  for (let i = 0; i < layersBsm.length; i++) {
    _.each(projectInfo.serviceList, function (item) {
      if (layersBsm[i] === item.bsm) {
        result.push(item)
        return false
      }
      let layerExist = false
      _.each(item.gisLayerList, function (layer) {
        if (layersBsm[i] === layer.bsm) {
          const hasChild = _.find(item.gisLayerList, function (o) {
            return o.parentBsm === layer.bsm
          })
          if (!hasChild || !hasChild.length) {
            result.push(layer)
          }
          layerExist = true
          return false
        }
      })
      if (layerExist) {
        return false
      }
    })
  }
  // for (let i = 0; i < layersBsm.length; i++) {
  //   for (let j = 0; j < projectInfo.serviceList.length; j++) {
  //     let service = projectInfo.serviceList[j]
  //     if (layersBsm[i].bsm === service.bsm) {
  //       result.push(projectInfo.serviceList[j])
  //       break
  //     } else {
  //       let layerExist = false
  //       for (let m = 0; m < service.gisLayerList.length; m++) {
  //         let layer = service.gisLayerList[m]
  //         if (!layersBsm[i].bsm === layer.bsm) {
  //           if (!layer.children) {
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  // console.log(services)
  // _.reduce(services, function (items, item) {
  //   console.log(item)
  //   for (let i = 0; i < layersBsm.length; i++) {
  //     if (item.bsm === layersBsm[i] && (!item.serviceBsm || !item.children || !item.children.length)) {
  //       result.push(item)
  //     }
  //   }
  //   if (item.children) {
  //     return item.children
  //   }
  // })
  return result
}
