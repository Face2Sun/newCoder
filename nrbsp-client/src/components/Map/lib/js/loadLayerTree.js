function loadLayerTree(legendContainerId,treeContainerId,oprateMap,thisProjectInfo){
	var projectInfo=JSON.parse(JSON.stringify(thisProjectInfo));
	var serviceInfo=projectInfo.serviceList;
	var checkedArr=[];
	var checkedRows=[];
	oprateMap._baseLayerList=[];
	oprateMap._allService=[];
	formatJsonInfo(serviceInfo);

	$mapDataGrid=$("#"+treeContainerId).grid({
	    data: serviceInfo,
	    colModel: [
	    	{name:'bsm', hidden: true, key: true},
	        { name: 'treeName', label:'数据列表'},
	    ],
	    expandColumn: "treeName",
	    multiselect: true, 
	    multiselectWidth:20,
	    treeGrid: true,
	    shrinkToFit:false,
	    onSelectRow:function(e,rowid,b,evt){
	    	var lastCheckRows=checkedRows;
	    	var nowCheckedRows=$("#"+treeContainerId).grid("getCheckRows");
	    	var thisRow=$("#"+treeContainerId).grid("getRowData",rowid);
	    	if(nowCheckedRows.length>checkedRows.length){
	    		checkParentNode($("#"+treeContainerId),thisRow,true);
	    		checkChildren($("#"+treeContainerId),thisRow,true);
	    	}else if(nowCheckedRows.length<checkedRows.length){
	    		checkParentNode($("#"+treeContainerId),thisRow,false);
	    		checkChildren($("#"+treeContainerId),thisRow,false);
	    	}
	    	checkLayers($("#"+treeContainerId),lastCheckRows);
	    	if(oprateMap._legendControl){
	    		oprateMap._legendControl.visibleLayerLegends();
	    	}
	    },
	    gridComplete:function(e){
	    	//样式及页面元素修改
	      	$("#gview_"+treeContainerId+" .ui-jqgrid-hdiv").remove();
	      	$("#gview_"+treeContainerId).css({"height":"100%","width":"100%"});
	      	$("#gview_"+treeContainerId+" .ui-jqgrid-bdiv").css({"height":"100%","width":"100%","overflow":"auto"});
			$("#"+treeContainerId).css({"height":"100%","width":"100%"});
			$("#"+treeContainerId).css("border","none");
			$("#"+treeContainerId+" div").css("border","none");
			$("#"+treeContainerId+" td").css({"border":"none","padding":"0.4rem 0 0.4rem 0.2rem"});
			$("#"+treeContainerId+" td:first-child").css({"width":"20","padding":"0.4rem 0 0.4rem 1rem"});
			$("#btable_"+treeContainerId).css("width","100%");
			//设置图层选中初始化
	    	for(var c in checkedArr){
	    		$("#"+treeContainerId).grid("setCheckRows",[checkedArr[c]],true,false);
	    		var thisRow=$("#"+treeContainerId).grid("getRowData",checkedArr[c]);
	    		checkParentNode($("#"+treeContainerId),thisRow,true);
	    	}
	    	checkedRows=$("#"+treeContainerId).grid("getCheckRows");
			//服务图层加载
			for(var i in oprateMap._allService){
				var thisService=oprateMap._allService[i];
				loadLayer(thisService);
			}
	    }
	});

	function loadLayer(serviceInfo){
		var thisLayer;
		if(serviceInfo.showLayers){
			serviceInfo.showLayers.sort(theArrDescSort("sortNo"));
		}
		var layerUrl=serviceInfo.serviceUrl;
		var thezIndex=100-serviceInfo.orderNo;
		$.ajax({
	        type:"get",
	        url:layerUrl+'?f=pjson',
	        success:function(data){
	        	var layerInfo=JSON.parse(data);
	        	var maxBoundsData=layerInfo.fullExtent;
	        	var maxBounds;
	        	if(thisProjectInfo.crsName=='EPSG:4610'){
	        		maxBounds=L.latLngBounds(new L.LatLng(maxBoundsData.ymin,maxBoundsData.xmin),new L.LatLng(maxBoundsData.ymax,maxBoundsData.xmax));
	        	}else{
	        		var maxConner1=oprateMap.options.crs.projection.unproject(new L.point(maxBoundsData.xmin,maxBoundsData.ymin));
					var maxConner2=oprateMap.options.crs.projection.unproject(new L.point(maxBoundsData.xmax,maxBoundsData.ymax));
					maxBounds=L.latLngBounds(maxConner1,maxConner2);
	        	}
				if(serviceInfo.serviceType==1){
					var layers=[];
					for(var j in serviceInfo.showLayers){
						layers.push(serviceInfo.showLayers[j].name);
					}
					var serviceUrl=layerUrl.split("/rest")[0]+layerUrl.split("/rest")[1]+"/WMSServer";
					thisLayer=L.tileLayer.wms(serviceUrl, {
						layers: layers,
				        format: 'image/png',
				        transparent: true,
						zIndex: thezIndex,
						bounds:maxBounds,
						maxZoom: oprateMap.getMaxZoom()
					}).addTo(oprateMap);
				}
				else if(serviceInfo.serviceType==2){
					var layers=[];
					for(var j in serviceInfo.showLayers){
						if(serviceInfo.showLayers[j].id){
							layers.push(serviceInfo.showLayers[j].id);	
						}
					}
					thisLayer=L.esri.dynamicMapLayer({
					    url: layerUrl,
					    f:"image",
					    layers: layers,
					    pane: 'tilePane',
					    zIndex: thezIndex,
					    opacity: layers.length?1:0,
						bounds:maxBounds
				    }).addTo(oprateMap);
				    thisLayer.on("load",function(){
				    	if(thisLayer._currentImage&&thisLayer._currentImage._image){
				    		thisLayer._currentImage._image.style.zIndex=thezIndex;
				    	}
				    });
				}
				else if(serviceInfo.serviceType==3){
					thisLayer=L.tileLayer(layerUrl+"/tile/{z}/{y}/{x}", {
						bounds:maxBounds,
						opacity: serviceInfo.opacity,
						zIndex: thezIndex
					}).addTo(oprateMap);
				}
				oprateMap._baseLayerList.push({layerBsm:serviceInfo.bsm,thelayer:thisLayer,maxBounds:maxBounds});
	        }
	    });
	}

	function checkParentNode(thisGrid,thisRow,flag){
		var parentArr=[];
		var thisRowLevel=thisGrid.grid("getNodeDepth",thisRow);
		if(thisRowLevel==0){
			return;
		}else{
			var thisParentNode=thisGrid.grid("getNodeParent",thisRow);
			var theCheckedRows=thisGrid.grid("getCheckRows");
			var brotherExist=false;
			for(var c in theCheckedRows){
				var cRowLevel=thisGrid.grid("getNodeDepth",theCheckedRows[c]);
				var cParentNode=thisGrid.grid("getNodeParent",theCheckedRows[c]);
				if(cRowLevel==thisRowLevel&&cParentNode.bsm==thisParentNode.bsm&&thisRow.bsm!=theCheckedRows[c].bsm){
					brotherExist=true;
					break;
				}
			}
			if(!brotherExist){
				parentArr.push(thisParentNode.bsm);
				thisGrid.grid("setCheckRows",parentArr,flag,false);	
				return checkParentNode(thisGrid,thisParentNode,flag);
			}
		}
	}

	function checkChildren(thisGrid,thisRow,flag){
		var childNodes=thisGrid.grid("getNodeChildren",thisRow);
		var childrenArr=[];
		for(var c in childNodes){
			if(childNodes.length!=0){
				checkChildren(thisGrid,thisGrid.grid("getRowData",childNodes[c].bsm),flag);
			}
			childrenArr.push(childNodes[c].bsm);
		}
		thisGrid.grid("setCheckRows",childrenArr,flag,false);
	}

	function compareArr(array1,array2){
		var result = [];
		for(var i = 0; i < array2.length; i++){
		    var obj = array2[i];
		    var bsm = obj.bsm;
		    var isExist = false;
		    if((obj.parentBsm==undefined&&obj.layerGroup==1&&obj.serviceType!=3)||obj.isLeaf==false){
		    	isExist = true;
		    }
		    for(var j = 0; j < array1.length; j++){
		        var aj = array1[j];
		        var t = aj.bsm;
		        if(t == bsm){
		            isExist = true;
		            break;
		        }
		    }
		    if(!isExist){
		        result.push(obj);
		    }
		}
		return result;
	}




	function checkLayers(thisGrid,lastCheckRows){
		checkedRows=$("#"+treeContainerId).grid("getCheckRows");
		var result=[];
		if(lastCheckRows.length<checkedRows.length){
			result=compareArr(lastCheckRows,checkedRows);
		}else if(lastCheckRows.length>checkedRows.length){
			result=compareArr(checkedRows,lastCheckRows);
		}
		var changeServices=[];
		for(var i=0;i<result.length;i++){
			var thisService;
			var allService=oprateMap._allService;
			for(var j in allService){
				if((result[i].serviceBsm&&allService[j].bsm==result[i].serviceBsm)||(!result[i].serviceBsm&&allService[j].bsm==result[i].bsm)){
					thisService=allService[j];
					break;
				}
			}
			if(!result[i].projectBsm){
				if(lastCheckRows.length<checkedRows.length){
					thisService.showLayers.push(result[i]);
				}else{
					for(var j in thisService.showLayers){
						if(result[i].bsm==thisService.showLayers[j].bsm){
							thisService.showLayers.splice(j,1);
							break;
						}
					}
				}
			}else{
				if(thisService.gisLayerList&&thisService.serviceType!=3){
					thisService.showLayers=thisService.showLayers.length?[]:thisService.gisLayerList;
				}else if(thisService.serviceType==3){
					thisService.opacity=thisService.opacity?0:1;
				}
			}
			if(changeServices.indexOf(thisService)==-1){
				changeServices.push(thisService);
			}
		}
		for(var i in changeServices){
			oprateLayers(changeServices[i]);
		}
	}

	function oprateLayers(thisService){
		var oprateLayer;
		for(var i in oprateMap._baseLayerList){
			if(thisService.bsm==oprateMap._baseLayerList[i].layerBsm){
				oprateLayer=oprateMap._baseLayerList[i].thelayer;
			}
		}
		if(thisService.serviceType==1){
			var layers=[];
			thisService.showLayers.sort(theArrDescSort("sortNo"));
			for(var i in thisService.showLayers){
				if(thisService.showLayers[i].name){
					layers.push(thisService.showLayers[i].name);	
				}
			}
			oprateLayer.setParams({
				layers: layers,
		        format: 'image/png',
		        'transparent': true,
				zIndex: 100-thisService.orderNo
			});
		}else if(thisService.serviceType==2){
			var layers=[];
			thisService.showLayers.sort(theArrDescSort("sortNo"));
			for(var i in thisService.showLayers){
				if(thisService.showLayers[i].id){
					layers.push(thisService.showLayers[i].id);	
				}
			}
			if(layers.length==0){
				oprateLayer.setOpacity(0);
			}else{
				oprateLayer.setLayers(layers);	
				oprateLayer.setOpacity(1);
			}
		}else if(thisService.serviceType==3){
			oprateLayer.setOpacity(thisService.opacity);
		}
	}

	function theArrSort(property){
	    return function(a,b){
	        var value1 = a[property];
	        var value2 = b[property];
	        return value1 - value2;
	    }
	}

	function theArrDescSort(property){
	    return function(a,b){
	        var value1 = a[property];
	        var value2 = b[property];
	        return value2 - value1;
	    }
	}

	function formatJsonInfo(serviceInfo){
		serviceInfo.sort(theArrSort("orderNo"));
		for(var l in serviceInfo){
			if(serviceInfo[l].layerGroup==2||serviceInfo[l].serviceType==3){
				serviceInfo[l].treeName=serviceInfo[l].name;
				if(serviceInfo[l].serviceType==3){
					serviceInfo[l].opacity=0;
				}else{
					serviceInfo[l].showLayers=[];
				}
				if(serviceInfo[l].gisLayerList){
					for(var i=0;i<serviceInfo[l].gisLayerList.length;i++){
						if(serviceInfo[l].gisLayerList[i].show==1){
							if(serviceInfo[l].serviceType==3){
								serviceInfo[l].opacity=1;
							}else{
								serviceInfo[l].showLayers=serviceInfo[l].gisLayerList;
							}
							checkedArr.push(serviceInfo[l].bsm);
							break;
						}
					}	
				}
			}else{
				if(serviceInfo[l].groupName){
					serviceInfo[l].treeName=serviceInfo[l].groupName;
				}
				serviceInfo[l].showLayers=[];
				var layersInfo=serviceInfo[l].gisLayerList;
				for(var i=0;i<layersInfo.length;i++){
					layersInfo[i].treeName=layersInfo[i].alias?layersInfo[i].alias:(layersInfo[i].title?layersInfo[i].title:layersInfo[i].bsm);
	    			layersInfo[i].sortNo=i;
	    			layersInfo[i].serviceBsm=serviceInfo[l].bsm;
	    			if(layersInfo[i].enable!=1&&layersInfo[i].show==1){
						checkedArr.push(layersInfo[i].bsm);
						serviceInfo[l].showLayers.push(layersInfo[i]);
					}
				}
				for(var i=0;i<layersInfo.length;i++){
					if(layersInfo[i].enable!=1){
						loadTreeChildren(layersInfo[i],serviceInfo[l]);
					}
				}
	    	}
			oprateMap._allService.push(serviceInfo[l]);
	    }
		//所属组名相同的服务处理
		for(var i=0;i<serviceInfo.length-1;i++){
			for(var j=i+1;j<serviceInfo.length;j++){
				if(serviceInfo[i].groupName==serviceInfo[j].groupName&&serviceInfo[i].layerGroup!=2&&serviceInfo[j].layerGroup!=2){
					for(var l in serviceInfo[j].children){
						serviceInfo[i].children.push(serviceInfo[j].children[l]);
					}
					serviceInfo.splice(j,1);
				}
			}
		}
		//所属组名为空，且图层分组不合并时服务处理
		for(var l in serviceInfo){
			if(!serviceInfo[l].treeName){
				var serviceLength=serviceInfo[l].children.length;
				for(var i in serviceInfo[l].children){
					serviceInfo.splice(Number(l)+Number(i),0,serviceInfo[Number(l)+Number(i)].children[i]);
				}
				l=Number(l)+Number(serviceLength);
				serviceInfo.splice(l,1);
			}
		}
	}
	function loadTreeChildren(thisLayersInfo,thisServiceInfo){
		if(thisLayersInfo.parentBsm==null){
			if(!thisServiceInfo.children){
				thisServiceInfo.children=[];
				thisServiceInfo.expanded=true;
			}
			var layerExist=false;
			for(var i in thisServiceInfo.children){
				if(thisServiceInfo.children[i].bsm==thisLayersInfo.bsm){
					layerExist=true;
					break;
				}
			}
			if(!layerExist){
				thisServiceInfo.children.push(thisLayersInfo);
			}					
			return thisServiceInfo;
		}else{
			for(var i in thisServiceInfo.gisLayerList){
				if(thisServiceInfo.gisLayerList[i].bsm==thisLayersInfo.parentBsm){
					if(!thisServiceInfo.gisLayerList[i].children){
						thisServiceInfo.gisLayerList[i].children=[];
						thisServiceInfo.gisLayerList[i].expanded=true;
					}
					var layerExist=false;
					for(var j in thisServiceInfo.gisLayerList[i].children){
						if(thisServiceInfo.gisLayerList[i].children[j].bsm==thisLayersInfo.bsm){
							layerExist=true;
							break;
						}
					}
					if(!layerExist){
						thisServiceInfo.gisLayerList[i].children.push(thisLayersInfo);
						for(var j in thisServiceInfo.showLayers){
							if(thisServiceInfo.gisLayerList[i].bsm==thisServiceInfo.showLayers[j].bsm){
								thisServiceInfo.showLayers.splice(j,1);
								break;
							}
						}
					}
					return loadTreeChildren(thisServiceInfo.gisLayerList[i],thisServiceInfo);
				}
			}
		}
	}
}