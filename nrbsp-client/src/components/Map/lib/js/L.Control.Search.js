/*************************添加搜索显示与隐藏控件**********************************************************/
L.Control.Search = L.Control.extend({
	options: {
		position: 'bottomright' //初始位置

	},
	initialize: function (options) {
		L.Util.extend(this.options, options);

	},
	onAdd: function (map) {
		var me=this;
		map._searchControl=this;
		this._container = L.DomUtil.create('div', 'leaflet-search-show');
		this._container.title="查询";
		this.stopAllPropagation(this._container);
		L.DomEvent.addListener(this._container, 'click', this.createSearch,this);

		this.getAllDictionary().done(function(resp){
			me.allDictionary=resp.rest;
		});

		return this._container;
	},
	createSearch:function(e){
		var me=this;
		this.searchLayers=this.loadAllSearchLayer();
		if(this.searchLayers.length==0){
			loft.toast('error', '没有可供查询的图层！');
			return;
		}
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		var mapInfoWrapper=mapMoudelWrapper.children(".leaflet-mapInfo-Wrapper");
		var mapInfoContent=mapInfoWrapper.children(".leaflet-mapInfo-Content");
		var mapInfoMenu=mapMoudelWrapper.children('.leaflet-mapInfo-Menu');
		var searchInfoBtn=mapInfoMenu.find('.glyphicon-search').parent();
		var searchInfo=mapInfoContent.find(".leaflet-search-searchInfo");
		var detailWrapper=searchInfo.find(".leaflet-search-detailWrapper");
		var detailContent=searchInfo.find(".leaflet-search-detailWrapper>div:nth-child(2)");
		if(!searchInfoBtn.length){
			searchInfoBtn=$("<a href='javascript:void(0)'></a>").html("<span class='glyphicon glyphicon-search' ></span><span>×</span>查询").appendTo(mapInfoMenu);
			searchInfoBtn.on('click',function(){
				if(me._map.resultMapLayer){
					me._map.resultMapLayer.removeFrom(me._map);
				}
				if(me.resultMapLayer){
					me._map.resultMapLayer=me.resultMapLayer;
					me._map.resultMapLayer.addTo(me._map);
				}
			});
			searchInfo=$("<div></div>").addClass("leaflet-search-searchInfo").appendTo(mapInfoContent);
			var searchInfoHead=$("<div></div>").appendTo(searchInfo);
			$("<span></span>").text("属性查询").addClass('leaflet-search-searchHead').appendTo(searchInfoHead);
			var clearResult=$("<div title='清除识别结果'></div>").html("<span class='glyphicon glyphicon-erase'></span>").addClass('leaflet-search-clearResult').appendTo(searchInfo);
			L.DomEvent.addListener(clearResult[0], 'click', this.clearResultLayer,this);
			$("<div class='form-group col-md-12 leaflet-search-layerSelect'></div>").appendTo(searchInfoHead).html("<label class='control-label'>图层：</label><input type='text' name='"+mapMoudelWrapperId+"-searchLayer' id='"+mapMoudelWrapperId+"-searchLayer'/>");
			$("#"+mapMoudelWrapperId+"-searchLayer").combobox({
				dataSource:this.searchLayers,
				dataTextField:'treeName',
				dataValueField:'id',
				value:this.searchLayers[0].id
			});
			var searchWrapper=$("<div class='col-md-12 leaflet-search-searchWrapper'></div>").appendTo(searchInfoHead).html("");
			var searchInput=$("<div class='input-group'><input type='text' id='"+mapMoudelWrapperId+"-searchKey' class='form-control'></div>").appendTo(searchWrapper);
			var searchBtn=$("<span class='input-group-addon' id='"+mapMoudelWrapperId+"-searchBtn'><span class='glyphicon glyphicon-search'></span></span>").appendTo(searchInput);
			L.DomEvent.addListener(searchBtn[0], 'click', this.doSearch,this);
			var searchInfoResult=$("<div id='"+mapMoudelWrapperId+"-searchInfoResult'></div>").addClass("leaflet-search-searchInfoResult").appendTo(searchInfo);
			$("<div class='col-md-12' id='"+mapMoudelWrapperId+"-searchResult'></div>").addClass('leaflet-search-resultWrapper').appendTo(searchInfoResult);
			detailWrapper=$("<div class='col-md-12 leaflet-search-detailWrapper'></div>").appendTo(searchInfoResult);
			$("<div class='col-md-12'></div>").html("<table class='col-md-12' ><thead><tr><td colspan='2' class='leaflet-search-detailHead'>详细属性</td></tr></thead></table>").appendTo(detailWrapper);
			detailContent=$("<div class='col-md-12'></div>").addClass("leaflet-search-detailContent").appendTo(detailWrapper);
			this.featureDetail=$("<table id='leaflet-search-detailGrid'></table>").html("<tbody></tbody>").appendTo(detailContent);
			$("#"+mapMoudelWrapperId+"-searchInfoResult").splitter({
		        orientation: "vertical",
		        panes: [
		            {collapsible: false,size: "35%" },
		            {}
		        ]
		    });
			searchInfoBtn.click();
			this.initResultGrid();	
		}
		searchInfoBtn.click();
	},
	loadAllSearchLayer:function(){
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		var layerTreeId=this.getLayerTreeGrid();
		var allLayer=$("#"+layerTreeId).grid("getRowData");
		var searchLayers=[];
		for(var i in allLayer){
			if(allLayer[i].serviceBsm&&allLayer[i].isLeaf){
				var searchLayer={};
				searchLayer.serviceBsm=allLayer[i].bsm;
				searchLayer.treeName=allLayer[i].treeName;
				searchLayer.title=allLayer[i].title;
				searchLayer.id=allLayer[i].id;
				searchLayers.push(searchLayer);
			}
		}
		return searchLayers;
	},
	initResultGrid:function(){
		var me=this;
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		this.featureGrid=$("#"+mapMoudelWrapperId+"-searchResult").grid({
			data: [],   
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
            	var selectLayerId=$("#"+mapMoudelWrapperId+"-searchLayer").combobox("value");
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
				me.featureDetail.find('tbody').fadeIn("slow");
            },
            gridComplete:function(){
            	$("#"+mapMoudelWrapperId+"-searchResult").css("width","100%");
            	$("#"+mapMoudelWrapperId+"-searchResult .ui-jqgrid-view").css({"width":"100%","height":"100%","padding-top":$("#"+mapMoudelWrapperId+"-searchResult .ui-jqgrid-hdiv").height(),"left":"0", "box-sizing":"border-box","position":"relative"});
            	$("#"+mapMoudelWrapperId+"-searchResult .ui-jqgrid-hdiv").css({"width":"100%","position":"absolute","top":"0","left":"0"});
            	$("#"+mapMoudelWrapperId+"-searchResult .ui-jqgrid-hbox").css({"width":"100%","padding-right":"0"});
            	$("#"+mapMoudelWrapperId+"-searchResult .ui-jqgrid-bdiv").css({"width":"100%","height":"100%"});
            	$("#"+mapMoudelWrapperId+"-searchResult").find('table').css({"width":"100%","table-layout":"auto"});
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
            	featureLayer=L.geoJSON(thisFeature);
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
	},
	doSearch:function(e){
		var me=this;
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		var mapContainerId=$(this._map.getContainer()).attr("id");
		var searchLayerId=$("#"+mapMoudelWrapperId+"-searchLayer").combobox("value");
		var searchLayerTreeName=$("#"+mapMoudelWrapperId+"-searchLayer").combobox("text");
		var searchKey=$("#"+mapMoudelWrapperId+"-searchKey").val();
		if(!searchLayerId||searchLayerId==""){
			loft.toast('error', '请选择查询的图层！');
			return;
		}else if(!searchKey||searchKey==""){
			loft.toast('error', '请输入关键字进行查询！');
			return;
		}
		for(var i in this.searchLayers){
			if(this.searchLayers[i].treeName==searchLayerTreeName&&this.searchLayers[i].id==searchLayerId){
				var searchLayerUrl=this._map.projInfoUtil.getServerUrlByLayerName(this.searchLayers[i].title);
				break;
			}
		}
		// me._map.spin(true);
		loft.loading('#'+mapContainerId, '加载中');
		L.esri.find({
		    url: searchLayerUrl
		})
		.layers(searchLayerId)
		.contains(true)
		.text(searchKey)
		.run(function(error, featureCollection, response){
			// me._map.spin(false);
			loft.unloading('#'+mapContainerId, '加载中');
			if(me._map.resultMapLayer){
				me._map.resultMapLayer.removeFrom(me._map);
				me._map.resultMapLayer=undefined;
				me.resultMapLayer=undefined;
			}
			me.loadSearchResult(featureCollection);
			if(featureCollection.features.length>0){
				me._map.resultMapLayer = L.markerClusterGroup({maxClusterRadius:60});
				var featuresLayer=L.geoJSON(featureCollection, {
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
					// layer.off('click');
			    	if(layer.feature.geometry.type=='Point'){
			    		layer.on('click',function(){
			    			this.bounce(3);
			    		});
			    	}
					layer.on('click',function(){
						me.featureGrid.grid("setSelection",layer.feature);
						var attrTable=me.featureDetail.clone().removeAttr("id").addClass("leaflet-search-popupTable");
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
			}else{
				loft.toast('error', '未查询到相关要素！');
			}
		});
	},
	loadSearchResult:function(featureCollection){
		var me=this;
		this.featureGrid.grid("reloadData",featureCollection.features);
		me.featureDetail.find('tbody').text("");
	},
	clearResultLayer:function(){
		var me=this;
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		if(this._map.resultMapLayer){
			this._map.resultMapLayer.removeFrom(this._map);
			this._map.resultMapLayer=undefined;
			this.resultMapLayer=undefined;
		}
		$("#"+mapMoudelWrapperId+"-searchKey").val("");
		this.featureGrid.grid("reloadData",[]);
		this.featureDetail.find('tbody').text("");
	},
	stopAllPropagation:function(domElement){
		L.DomEvent.on(domElement, 'mousedown', function (ev) {
		    L.DomEvent.stopPropagation(ev);
		});
		L.DomEvent.on(domElement, 'click', function (ev) {
		    L.DomEvent.stopPropagation(ev);
		});
		L.DomEvent.on(domElement, 'mouseup', function (ev) {
		    L.DomEvent.stopPropagation(ev);
		});
	},
	getLayerTreeGrid:function(){
		var mapContainer=this._map.getContainer();
		var mapContainerId=mapContainer.getAttribute("id");
		return mapContainerId.split('-map-container')[0]+'-map-layerTree';
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

L.control.Search = function (options) {
    return new L.Control.Search(options);
};



		