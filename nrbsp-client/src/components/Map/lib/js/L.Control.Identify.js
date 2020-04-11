/*************************添加识别控件**********************************************************/
L.Control.Identify = L.Control.extend({
	options: {
		position: 'bottomright' //初始位置
	},
	initialize: function (options) {
		L.Util.extend(this.options, options);
	},
	onAdd: function (map) {
		
		map._identifyControl=this;
		var me=this;

		this._container = L.DomUtil.create('div', 'leaflet-identify-show');
		this._container.title="识别";
		L.DomEvent.addListener(this._container, 'click', this.createIdentify,this);
		this.stopAllPropagation(this._container);

		this._identifycontainer = L.DomUtil.create('div', 'leaflet-control-identify', this._container);
		this._identifycontainer.style.display="none";
		
		var thisLayerContainer=L.DomUtil.create('div', '', this._identifycontainer);
		thisLayerContainer.title="当前层";
		this._thisLayerContainer=thisLayerContainer;
		L.DomEvent.addListener(this._thisLayerContainer, 'click', this.thisLayerIdentify,this);
		this.stopAllPropagation(this._thisLayerContainer);
		
		var visibleLayerContainer=L.DomUtil.create('div', '', this._identifycontainer);
		visibleLayerContainer.title="可见层";
		this._visibleLayerContainer=visibleLayerContainer;
		L.DomEvent.addListener(this._visibleLayerContainer, 'click', this.visibleLayerIdentify,this);
		this.stopAllPropagation(this._visibleLayerContainer);

		var clearLayerContainer=L.DomUtil.create('div', '', this._identifycontainer);
		clearLayerContainer.title="清除结果";
		this._clearLayerContainer=clearLayerContainer;
		L.DomEvent.addListener(this._clearLayerContainer, 'click', this.clearResultLayer,this);
		this.stopAllPropagation(this._clearLayerContainer);

		this.getAllDictionary().done(function(resp){
			me.allDictionary=resp.rest;
		});

		return this._container;
	},
	stopAllPropagation:function(domElement){
		L.DomEvent.on(domElement, 'mousedown', function (ev) {
		    L.DomEvent.stopPropagation(ev);
		});
		L.DomEvent.on(domElement, 'click', function (ev) {
		    L.DomEvent.stopPropagation(ev);
		});
		L.DomEvent.on(domElement, 'mousemove', function (ev) {
		    L.DomEvent.stopPropagation(ev);
		});
		L.DomEvent.on(domElement, 'mouseup', function (ev) {
		    L.DomEvent.stopPropagation(ev);
		});
	},
	createIdentify:function(e){
		if(this._identifycontainer.style.display=="none"){
			this._identifycontainer.style.display="block";
		}else{
			this._identifycontainer.style.display="none";
		}
		e.stopPropagation();
	},
	thisLayerIdentify:function(e){
		this.cancleIdentifyListener();
		this._map.getContainer().style.cursor="pointer";
		if(!this._layerTree){
			var layerTreeId=this.getLayerTreeGrid();
			this._layerTree=$("#"+layerTreeId);
		}
		var layers=this._layerTree.grid('getSelection');
		var serviceGroup=this.identifyLayersOprate([layers]);
		if(serviceGroup.length==0){
			loft.toast('error', '请选择识别的图层！');
			return;
		}
		L.DomUtil.addClass(this._thisLayerContainer,'leaflet-control-thisLayerActive');
		this.doIdentify(serviceGroup);
		e.stopPropagation();
	},
	visibleLayerIdentify:function(e){
		this.cancleIdentifyListener();
		this._map.getContainer().style.cursor="pointer";
		if(!this._layerTree){
			var layerTreeId=this.getLayerTreeGrid();
			this._layerTree=$("#"+layerTreeId);
		}
		var layers=this._layerTree.grid('getCheckRows');
		var serviceGroup=this.identifyLayersOprate(layers);
		if(serviceGroup.length==0){
			loft.toast('error', '请选择识别的图层！');
			return;
		}
		L.DomUtil.addClass(this._visibleLayerContainer,'leaflet-control-visibleLayerActive');
		this.doIdentify(serviceGroup);
		e.stopPropagation();
	},
	doIdentify:function(serviceGroup){
		this.identifyServices=serviceGroup;
		this.bounds=[[0,0],[0,0]];
		this.identifyArea=L.rectangle(this.bounds, {color: "red", weight: 1,fillColor: 'red',fillOpacity:0.3});

		this.mouseDownFn=this.drawAreaStart;
		this._map.on("mousedown",this.mouseDownFn,this);
		
		this.mouseUpFn=this.drawAreaEnd;
		this._map.on("mouseup",this.mouseUpFn,this);
	},
	drawAreaStart:function(e){
		this.identifyArea.removeFrom(this._map);
		this.bounds=[[0,0],[0,0]];
		this.identifyArea=L.rectangle(this.bounds, {color: "red", weight: 1,fillColor: 'red',fillOpacity:0.3}).addTo(this._map);
		if(this.featureGroup){
			this.featureGroup.removeFrom(this._map);
		}
		this._map.dragging._draggable._enabled=false;
		this.clickLoaction=[e.latlng.lat,e.latlng.lng];
		this.mouseMoveFn=this.chooseArea;
		this._map.on("mousemove",this.mouseMoveFn,this);
	},
	drawAreaEnd:function(e){
		var me=this;
		var mapContainerId=this._map.getContainer().getAttribute("id");
		this._map.off("mousemove",this.mouseMoveFn,this);
		this._map.dragging._draggable._enabled=true;
		if(this.bounds.toString()=="0,0,0,0"||this.bounds[0].toString()==this.bounds[1].toString()){
			this.bounds = L.latLngBounds(this._map.containerPointToLatLng([e.containerPoint.x-2,e.containerPoint.y-2]), this._map.containerPointToLatLng([e.containerPoint.x+2,e.containerPoint.y+2]));
			this.identifyArea.setBounds(this.bounds);
		}
		this.cancleIdentifyListener();
		for(var i in this.identifyServices){
			// me._map.spin(true);
			loft.loading('#'+mapContainerId, '加载中');
			this.loadResultInfo(i);
		}
		this.identifyArea.removeFrom(this._map);
		this.bounds=[[0,0],[0,0]];
	},
	loadResultInfo:function(i){
		var me=this;
		var mapContainerId=this._map.getContainer().getAttribute("id");
		var thisService=this.identifyServices[i];
		var layers=this.identifyServices[i].layers;
		var layersStr='all';
		for(var j in layers){
			if(j==0){
				layersStr+=':'+layers[j].id;
			}else{
				layersStr+=','+layers[j].id;
			}
		}
		L.esri.identifyFeatures({
		    url: thisService.serviceUrl
		})
		.on(this._map)
		.at(this.identifyArea)
		.layers(layersStr)
		.run(function(error, featureCollection, response){
			var features=featureCollection.features;
			if(features.length!=0){
				for(var j in features){
			    	features[j].serviceName=thisService.serviceName;
			    }
			    var resultLayers=me.formatFeatures(features);
				if(!me._map.resultMapLayer){
					me._map.resultMapLayer = L.markerClusterGroup({maxClusterRadius:60});
					var featuresLayer=L.geoJSON(featureCollection, {
					    style: function (geoJsonFeature) {
					        return {
					        	color: '#65F7CD',
					        	weight: 3,
					        	fillColor: '#65F7CD',
					        	fillOpacity: 0.5
					        };
					    },
					    onEachFeature:function(feature, layer){
					    	if(feature.geometry.type=='Point'){
					    		layer.on('click',function(){
					    			this.bounce(3);
					    		});
					    	}
					    }
					});
					me._map.resultMapLayer.once('add',function(){
						me.addFeatureInfoWrapper(resultLayers);
						me.resultMapLayer=me._map.resultMapLayer;
					});
					me._map.resultMapLayer.addLayer(featuresLayer).addTo(me._map);
				}else{
					//TODO待测试
					// me._map.resultMapLayer.addData(featureCollection);
					// me.resultMapLayer=me._map.resultMapLayer
					me.updateIdentifyLayer(resultLayers,'add');
				}
			}else{
				if(i==me.identifyServices.length-1&&!me._map.resultMapLayer){
					loft.toast('error', '该区域内没有相关要素！');
				}
			}
			if(i==me.identifyServices.length-1){
				loft.unloading('#'+mapContainerId, '加载中');
			}
		});
	},
	chooseArea:function(e){
		this.bounds = [this.clickLoaction, [e.latlng.lat, e.latlng.lng]];
		this.identifyArea.setBounds(this.bounds);
	},
	addFeatureInfoWrapper:function(resultLayers){
		var me=this;
		var mapMoudelWrapper=this._layerTree.parent().parent().parent();
		var mapMoudelWrapperId=$(mapMoudelWrapper).attr("id");
		var mapInfoWrapper=this._layerTree.parent().parent();
		var mapInfoContent=this._layerTree.parent();
		var mapInfoMenu=mapMoudelWrapper.children('.leaflet-mapInfo-Menu');
		var identifyInfoBtn=mapInfoMenu.find('.glyphicon-info-sign').parent();
		var identifyInfo=mapInfoContent.find(".leaflet-identify-identifyInfo");
		var detailWrapper=identifyInfo.find(".leaflet-identify-detailWrapper");
		var detailContent=identifyInfo.find(".leaflet-identify-detailWrapper>div:nth-child(2)");
		if(!identifyInfoBtn.length){
			this.featureGrid=undefined;
			identifyInfoBtn=$("<a href='javascript:void(0)'></a>").html("<span class='glyphicon glyphicon-info-sign' ></span><span>×</span>识别").appendTo(mapInfoMenu);
			identifyInfoBtn.on('click',function(){
				if(me._map.resultMapLayer){
					me._map.resultMapLayer.removeFrom(me._map);
				}
				if(me.resultMapLayer){
					me._map.resultMapLayer=me.resultMapLayer;
					me._map.resultMapLayer.addTo(me._map);
				}
			});
			identifyInfo=$("<div></div>").addClass("leaflet-identify-identifyInfo").appendTo(mapInfoContent);
			$("<span></span>").text("识别结果").addClass('leaflet-identify-resultHead').appendTo(identifyInfo);
			var clearResult=$("<div title='清除识别结果'></div>").html("<span class='glyphicon glyphicon-erase'></span>").addClass('leaflet-identify-clearResult').appendTo(identifyInfo);
			L.DomEvent.addListener(clearResult[0], 'click', this.clearResultLayer,this);
			$("<div class='form-group col-md-12 leaflet-identify-layerSelect'></div>").appendTo(identifyInfo).html("<label class='control-label'>图层：</label><input type='text' name='"+this.getLayerTreeGrid()+"identifyLayer' id='"+this.getLayerTreeGrid()+"identifyLayer'/>");
			var identifyInfoResult=$("<div id='"+mapMoudelWrapperId+"-identifyInfoResult'></div>").addClass("leaflet-identify-identifyInfoResult").appendTo(identifyInfo);
			$("<div class='col-md-12' id='"+this.getLayerTreeGrid()+"featureGrid'></div>").addClass('leaflet-identify-resultWrapper').appendTo(identifyInfoResult);
			detailWrapper=$("<div class='col-md-12 leaflet-identify-detailWrapper'></div>").appendTo(identifyInfoResult);
			$("<div class='col-md-12'></div>").html("<table class='col-md-12' ><thead><tr><td colspan='2' class='leaflet-identify-detailHead'>详细属性</td></tr></thead></table>").appendTo(detailWrapper);
			detailContent=$("<div class='col-md-12'></div>").addClass("leaflet-identify-detailContent").appendTo(detailWrapper);
			this.featureDetail=$("<table id='leaflet-identify-detailGrid'></table>").html("<tbody></tbody>").appendTo(detailContent);
			$("#"+mapMoudelWrapperId+"-identifyInfoResult").splitter({
		        orientation: "vertical",
		        panes: [
		            {collapsible: false,size: "35%" },
		            {}
		        ]
		    });
		}
		identifyInfoBtn.click();
		me.initFeatureInfo(resultLayers);
	},
	initFeatureInfo:function(resultLayers){
		var me=this;
		if(this.featureDetail){
			this.featureDetail.find('tbody').text("");
		}
		if(this.featureGrid){
			this.featureGrid.grid("reloadData",resultLayers[0]?resultLayers[0].features:[]);
		}else{
			this.featureGrid=$("#"+this.getLayerTreeGrid()+"featureGrid").grid({
				data: resultLayers[0]?resultLayers[0].features:[],   
	            colModel: [
	                { name: 'id',key:true, label:'ObjectID',resizable:false, sortable:true, sorttype:'int'},
	                {
	                    name: '定位',
	                    formatter: 'actions',
	                    width:60,
	                    resizable:false,
	                    sortable:false,
	                    formatoptions: {
	                        editbutton: false, 
	                        delbutton: false,
	                        inlineButtonAdd: [{
	                            id: "showGeometry_btn", //每个图标的id规则为id+"_"+rowid
	                            className: "leaflet-identify-gemoBtn",//每个图标的class
	                            icon: "glyphicon glyphicon-map-marker",//图标的样子
	                            title: "查看图形"//鼠标移上去显示的内容
	                        }]
	                    }
	                }
	            ],
	            autowidth:true,
	            onSelectRow:function( t, rowid, state, e ){
					me.featureDetail.find('tbody').text('');
					me.featureDetail.find('tbody').css('display','none');
					var featureInfo=me.featureGrid.grid("getRowData",rowid);
	            	var selectLayerId=$("#"+me.getLayerTreeGrid()+"identifyLayer").combobox("value");
	            	var attrList=me._map.projInfoUtil.getAttrByLayerId(selectLayerId);
	            	for(var i in featureInfo.properties){
	            		var fieleName=i;
	            		var fieldValue=featureInfo.properties[i];
	            		var theFieldShow=true;
	            		for(var j in attrList){
	            			if(i==attrList[j].defaultAlias){
	            				if(attrList[j].show==0){
	            					theFieldShow=false;
	            					break;
	            				}
	            				if(attrList[j].alias){
	            					fieleName=attrList[j].alias;
	            				}
	            				if(attrList[j].dicLx&&attrList[j].dicLx!=""){
	            					for(var k in me.allDictionary){
		            					if(attrList[j].dicLx==me.allDictionary[k].lx&&fieldValue==me.allDictionary[k].dm){
		            						fieldValue=me.allDictionary[k].mc;
		            						break;
		            					}
		            				}
	            				}
	            				break;
	            			}
	            		}
	            		if(!fieldValue){
                            fieldValue="";
                        }
                        if(theFieldShow){
                        	$("<tr></tr>").html("<td>"+fieleName+"</td><td>"+fieldValue+"</td>").appendTo(me.featureDetail.find('tbody'));
                        }
	            	}
					me.featureDetail.find('tbody').fadeIn('slow');
	            },
	            gridComplete:function(){
	            	$("#"+me.getLayerTreeGrid()+"featureGrid").css("width","100%");
	            	$("#"+me.getLayerTreeGrid()+"featureGrid .ui-jqgrid-view").css({"width":"100%","height":"100%","padding-top":$("#"+me.getLayerTreeGrid()+"featureGrid .ui-jqgrid-hdiv").height(),"left":"0", "box-sizing":"border-box","position":"relative"});
	            	$("#"+me.getLayerTreeGrid()+"featureGrid .ui-jqgrid-hdiv").css({"width":"100%","position":"absolute","top":"0","left":"0"});
	            	$("#"+me.getLayerTreeGrid()+"featureGrid .ui-jqgrid-hbox").css({"width":"100%","padding-right":"0"});
	            	$("#"+me.getLayerTreeGrid()+"featureGrid .ui-jqgrid-bdiv").css({"width":"100%","height":"100%"});
	            	$("#"+me.getLayerTreeGrid()+"featureGrid").find('table').css({"width":"100%","table-layout":"auto"});
	            }
			});
			this.featureGrid.on("click", ".leaflet-identify-gemoBtn", function (e) {
	            var rowid = $(this).closest("tr.jqgrow").attr("id");
	            var thisFeature=me.featureGrid.grid("getRowData",rowid);
				if(thisFeature.geometry.type=='Point'){
					var center=L.GeoJSON.coordsToLatLng(thisFeature.geometry.coordinates);
					me._map.resultMapLayer.eachLayer(function(layer){
	            		if(layer.feature.layerId==thisFeature.layerId&&layer.feature.id==thisFeature.id){
	            			me._map.resultMapLayer.zoomToShowLayer(layer,function(){
	            				layer.bounce(3);
	            				me._map.setView(center,me._map.getZoom());
	            			});
	            		}
	            	});
	            }else{
	            	var featureLayer=L.geoJSON(thisFeature);
	            	if(me.locatedLayer){
	            		me.locatedLayer.setStyle({
					        	color: '#65F7CD',
					        	weight: 3,
					        	fillColor: '#65F7CD',
					        	fillOpacity: 0.5
					    });
	            	}
	            	me._map.resultMapLayer.eachLayer(function(layer){
	            		if(layer.feature.layerId==thisFeature.layerId&&layer.feature.id==thisFeature.id){
	            			me.locatedLayer=layer;
	            			layer.setStyle({
						        	color: '#65F7CD',
						        	weight: 3,
						        	fillColor: '#3388ff',
						        	fillOpacity: 0.5
						    });
	            		}
	            	});
	            	me._map.fitBounds(featureLayer.getBounds());
	            }
	        });
		}
		this.updateIdentifyLayer(resultLayers,'new');
	},
	updateIdentifyLayer:function(resultLayers,oprate){
		var me=this;
		if(oprate=='add'){
			resultLayers=$.merge( this.resultLayers, resultLayers );
			this.theSelectLayer=$("#"+this.getLayerTreeGrid()+"identifyLayer").combobox('value');
		}else{
			this.resultLayers=resultLayers;
			this.theSelectLayer=resultLayers[0]?resultLayers[0].id:null;
			$("#"+this.getLayerTreeGrid()+"identifyLayer").val("");
			$("#"+this.getLayerTreeGrid()+"identifyLayer").combobox("value","");
			$("#"+this.getLayerTreeGrid()+"identifyLayer").combobox("destroy");
			$("#"+this.getLayerTreeGrid()+"identifyLayer").combobox({
				dataSource:resultLayers,
				dataTextField:'title',
				dataValueField:'id',
				value:me.theSelectLayer,
				change:function(event){
					if(me.lastSelect&&me.lastSelect==$("#"+me.getLayerTreeGrid()+"identifyLayer").val()){
						me.lastSelect=$("#"+me.getLayerTreeGrid()+"identifyLayer").val();
						return;
					}else{
						me.lastSelect=$("#"+me.getLayerTreeGrid()+"identifyLayer").val();
					}
					for(var i in resultLayers){
						if(resultLayers[i].id==$("#"+me.getLayerTreeGrid()+"identifyLayer").val()){
							me.featureGrid.grid("reloadData",resultLayers[i].features);
							if(me._map.resultMapLayer){
								me._map.resultMapLayer.removeFrom(me._map);
							}
							me._map.resultMapLayer = L.markerClusterGroup({maxClusterRadius:60});
							var featuresLayer=L.geoJSON(resultLayers[i].features, {
							    style: function (geoJsonFeature) {
							        return {
							        	color: '#65F7CD',
							        	weight: 3,
							        	fillColor: '#65F7CD',
							        	fillOpacity: 0.5
							        };
							    }
							});
							featuresLayer.eachLayer(function(layer){
						    	if(layer.feature.geometry.type=='Point'){
						    		layer.on('click',function(){
						    			this.bounce(3);
						    		});
						    	}
								layer.on('click',function(){
									me.featureGrid.grid("setSelection",layer.feature);
									var attrTable=me.featureDetail.clone().removeAttr("id").addClass("leaflet-identify-popupTable");
									attrTable.find('tbody').removeAttr("style");
									var hasPopup=layer.getPopup();
									var popupOpen=layer.isPopupOpen();
									if(!hasPopup||(hasPopup&&!popupOpen)){
										layer.unbindPopup().bindPopup(attrTable[0],{
											maxHeight:$(me._map.getContainer()).height()*0.4,
											maxWidth:$(me._map.getContainer()).width()*0.3,
											closeOnClick:false
										}).openPopup();
									}else{
										layer.closePopup().unbindPopup();
									}
								})
							});
							me._map.resultMapLayer.addLayer(featuresLayer).addTo(me._map);
							me.resultMapLayer=me._map.resultMapLayer;
							me._map.fitBounds(featuresLayer.getBounds());
							me.featureDetail.find('tbody').text("");
							break;
						}
					}
				}
			});
		}
		if(oprate=='add'){
			$("#"+this.getLayerTreeGrid()+"identifyLayer").combobox({ dataSource: resultLayers });
		}
		if(oprate=='new'&&!resultLayers[0]){
			$("#"+this.getLayerTreeGrid()+"identifyLayer").combobox('text', '');
		}
	},
	clearResultLayer:function(e){
		this.initFeatureInfo([]);
		this.cancleIdentifyListener();
		e.stopPropagation();
	},
	cancleIdentifyListener:function(){
		if(this._map._markerControl&&(this._map.hasLayer(this._map._markerControl.moveIcon)||this._map.hasLayer(this._map._markerControl.moveMarker))){
			this._map._markerControl.cancleMarkerListener();
		}
		if(this._map._measureControl&&this._map.hasLayer(this._map._measureControl.moveIcon)){
			this._map._measureControl.clearNowMeasure();
		}
		if(this._map._projToolsControl&&$(this._map._projToolsControl._container).hasClass("leaflet-projTools-active")){
			var projToolsControl=this._map._projToolsControl;
			if($(projToolsControl._container).hasClass("leaflet-projTools-active")){
				projToolsControl.cancleProjToolListener();
			}
		}
		if(this._identifycontainer){
			for(var i=0;i<this._identifycontainer.childNodes.length;i++){
				this._identifycontainer.childNodes[i].removeAttribute('class');
			}
		}
		if(this._map.resultMapLayer){
			this._map.resultMapLayer.removeFrom(this._map);
			this._map.resultMapLayer=undefined;
			this.resultMapLayer=undefined;
		}
		this._map.getContainer().style.cursor="-webkit-grab";
		if(this.mouseMoveFn){
			this._map.off("mousemove",this.mouseMoveFn,this);
		}
		if(this.mouseDownFn){
			this._map.off("mousedown",this.mouseDownFn,this);
		}
		if(this.mouseUpFn){
			this._map.off("mouseup",this.mouseUpFn,this);
		}
	},
	getLayerTreeGrid:function(){
		var mapContainer=this._map.getContainer();
		var mapContainerId=mapContainer.getAttribute("id");
		return mapContainerId.split('-map-container')[0]+'-map-layerTree';
	},
	formatFeatures:function(features){
		var layers=[];
		for(var i in features){
			var layersExist=false;
			for(var j in layers){
				if(features[i].layerId==layers[j].id){
					var featureExist=false;
					for(var m in layers[j].features){
						if(features[i].id==layers[j].features[m].id){
							featureExist=true;
							break;
						}
					}
					if(!featureExist){
						layers[j].features.push(features[i]);
					}
					layersExist=true;
					break;
				}
			}
			if(!layersExist){
				for(var j in this.identifyServices){
					if(features[i].serviceName==this.identifyServices[j].serviceName){
						var identifyLayers=this.identifyServices[j].layers;
						for(var m in identifyLayers){
							if(identifyLayers[m].id==features[i].layerId){
								layers.push({serviceName:features[i].serviceName,id:features[i].layerId,title:identifyLayers[m].title,features:[features[i]]});
							}
						}
					}
				}
			}
		}
		return layers;
	},
	identifyLayersOprate:function(layers){
		var projectInfo=this._map._projectInfo;
		var serviceGroup=[];
		for(var i in layers){
			if(!layers[i].serviceBsm){
				continue;
			}else if(layers[i].isLeaf==false){
				continue;
			}else{
				for(var j in projectInfo.serviceList){
					if(layers[i].serviceBsm==projectInfo.serviceList[j].bsm&&projectInfo.serviceList[j].serviceType!=3){
						var serviceExist=false;
						for(var l in serviceGroup){
							if(serviceGroup[l].serviceUrl==projectInfo.serviceList[j].serviceUrl){
								serviceExist=true;
								serviceGroup[l].layers.push({title:layers[i].treeName,id:layers[i].id});
								break;
							}
						}
						if(!serviceExist){
							serviceGroup.push({serviceName:projectInfo.serviceList[j].name,serviceUrl:projectInfo.serviceList[j].serviceUrl,layers:[{title:layers[i].treeName,id:layers[i].id}]});
						}
						break;
					}
				}
			}
		}
		return serviceGroup;
	},
	getAllDictionary:function(){
		var me=this;
	    var url = '/rest/cerdar/gisZhcbController/getAllZhcbMap';
	    var errorCallback = function(resp) {
	        console.log('resp', resp);
	    }
	    var request = me.getRestApi(url, 'GET', "", errorCallback);
	    return request;
	},
	getRestApi:function(url, method, data, errorCallback) {
	    var deferred = $.Deferred();
	    var timestamp = new Date().getTime().toString();
	    var timeFlag = '';
	    if (url.indexOf('?') > -1) {
	        timeFlag = '&timestamp=' + timestamp;
	    } else {
	        timeFlag = '?timestamp=' + timestamp;
	    }

	    $.ajax({
	        method: method,
	        url: method.toLowerCase() === 'get' ? url + timeFlag : url,
	        data: data,
	        contentType: 'application/json',
	        beforeSend: function(request) {
	            //ajax请求，node层获取后进行处理，在session无效时返回错误code
	            request.setRequestHeader("x-client-ajax", "true");
	        },
	        success: function(resp, status, xhr) {
	            deferred.resolve(resp);
	        },
	        error: function(resp) {
	            loft.unloading();
	            if (resp.status === 418 || resp.status === 401) {
	                //浏览器重新请求，以被node层拦截进行auth
	                location.reload();
	            } else {
	                if(resp.status === 504){
	                    loft.toast('error','网络超时，请稍后重试')
	                }
	                errorCallback && errorCallback(resp);
	                deferred.reject(resp);
	            }

	        }
	    });


	    // getData;
	    return deferred.promise();
	}
	
});
		
L.control.Identify = function (options) {
    return new L.Control.Identify(options);
};






	

