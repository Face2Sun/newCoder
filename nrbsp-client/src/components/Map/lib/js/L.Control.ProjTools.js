/*************************添加识别控件**********************************************************/
L.Control.ProjTools = L.Control.extend({
	options: {
		position: 'topright' //初始位置
	},
	initialize: function (options) {
		L.Util.extend(this.options, options);
	},
	onAdd: function (map) {
		
		var me=this;
		map._projToolsControl=this;

		this._container = L.DomUtil.create('div', 'leaflet-projTools-show');
		this._container.title="专题工具";
		this.stopAllPropagation(this._container);

		this._toolscontainer = L.DomUtil.create('div', 'leaflet-control-projTools', this._container);
		var allToolsUl=L.DomUtil.create('ul', 'leaflet-projTools-allToolsUl', this._toolscontainer);
		this._allToolsUl=allToolsUl;
		this.allToolsData=map._projectInfo.businessList;
		var allToolsData=this.allToolsData;
		for(var i in allToolsData){
			var toolLi=L.DomUtil.create('li', 'leaflet-projTools-projToolLi',allToolsUl);
			toolLi.setAttribute("toolBsm",allToolsData[i].bsm);
			toolLi.title=allToolsData[i].name;
			var toolIcon=L.DomUtil.create('span', 'glyphicon glyphicon-wrench',toolLi);
			var toolNameLabel=L.DomUtil.create('span', 'leaflet-projTools-toolNameLabel',toolLi);
			toolNameLabel.innerText=allToolsData[i].name;
			$(toolLi).click(function(){
				me.cancleProjToolListener();
				$(this).addClass("leaflet-projTools-projToolActive");
				$(me._container).addClass("leaflet-projTools-active");
				var checkedToolBsm=$(this).attr("toolBsm");
				if(checkedToolBsm!=null){
					me.checkedProjToolBsm=checkedToolBsm;
					me.doIdentify();
				}
			});
		}
		var clearToolRstLi=L.DomUtil.create('li', 'leaflet-projTools-projToolLi',allToolsUl);
		var clearIcon=L.DomUtil.create('span', 'glyphicon glyphicon-trash',clearToolRstLi);
		var clearToolLabel=L.DomUtil.create('span', 'leaflet-projTools-toolNameLabel',clearToolRstLi);
		clearToolLabel.innerText="清除结果";
		clearToolLabel.title="清除结果";
		$(clearToolRstLi).click(function(){
			me.cancleProjToolListener();
		});
		return this._container;
	},
	doIdentify:function(e){
		this._map.getContainer().style.cursor="pointer";
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
		this._map.dragging._draggable._enabled=false;
		this.clickLoaction=[e.latlng.lat,e.latlng.lng];
		this.mouseMoveFn=this.chooseArea;
		this._map.on("mousemove",this.mouseMoveFn,this);
	},
	chooseArea:function(e){
		this.bounds = [this.clickLoaction, [e.latlng.lat, e.latlng.lng]];
		this.identifyArea.setBounds(this.bounds);
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
		this.cancleProjToolListener();
		this.openToolIdentifyInfo();
		this.identifyArea.removeFrom(this._map);
		this.bounds=[[0,0],[0,0]];
	},
	openToolIdentifyInfo:function(callbackFun){
		var me=this;
		var checkedProjToolData;
		var allToolsData=this.allToolsData;
		for(var i in allToolsData){
			if(allToolsData[i].bsm==this.checkedProjToolBsm){
				checkedProjToolData=allToolsData[i];
				break;
			}
		}
		var mapContainerId=$(this._map.getContainer()).attr("id");

		var thisLayerName=this._map.projInfoUtil.getLayerNameByBsm(checkedProjToolData.layerBsm);
		var thisServiceUrl=this._map.projInfoUtil.getServerUrlByLayerName(thisLayerName);
		var thisLayerId=this._map.projInfoUtil.getIdByLayerName(thisLayerName);
		var thisLayerAttr=this._map.projInfoUtil.getAttrByLayerName(thisLayerName);
		if(!thisLayerName||!thisServiceUrl||!thisLayerId||!thisLayerAttr){
			loft.toast("error","专题工具配置错误，请检查！");
			return;
		}
		var fieldAlias;
		for(var i in thisLayerAttr){
			if(thisLayerAttr[i].name==checkedProjToolData.fieldName){
				fieldAlias=thisLayerAttr[i].defaultAlias;
			}
		}
		loft.loading('#'+mapContainerId, '加载中');
		L.esri.identifyFeatures({
		    url: thisServiceUrl
		})
		.on(this._map)
		.at(this.identifyArea)
		.layers("all:"+thisLayerId)
		.run(function(error, featureCollection, response){
			loft.unloading('#'+mapContainerId, '加载中');
			var features=featureCollection.features;
			if(features.length==0){
				loft.toast('error', '该区域没有查询到相关要素！');
			}else if(features.length>10){
				loft.toast('error', '该区域内相关要素过多，请精确查询范围！');
			}else{
				var allResultLayer=L.geoJSON(featureCollection);
				me._map.fitBounds(allResultLayer.getBounds());
				me.resultFeatureLayer=L.featureGroup([]).addTo(me._map);
				for(var i in features){
					var thisFeaturesLayer=L.geoJSON(features[i]).addTo(me.resultFeatureLayer);
					if(checkedProjToolData.showType==1){
						var popupOption={};
						if(checkedProjToolData.width&&checkedProjToolData.width!=0&&checkedProjToolData.width!=''){
							popupOption.minWidth=Number(checkedProjToolData.width)-1;
							popupOption.maxWidth=Number(checkedProjToolData.width)+1;
						}
						if(checkedProjToolData.height&&checkedProjToolData.height!=0&&checkedProjToolData.height!=''){
							popupOption.minHeight=Number(checkedProjToolData.height)-1;
							popupOption.maxHeight=Number(checkedProjToolData.height)+1;
						}
						var paramName=checkedProjToolData.paramName;
						var paramObject={};
						paramObject[paramName]=features[i].properties[fieldAlias];
						thisFeaturesLayer.bindPopup($.ui[checkedProjToolData.executeContent](paramObject).element[0],popupOption).openPopup();
					}else if(checkedProjToolData.showType==2){
						var mapMoudelWrapper=$(me._map.getContainer()).parent().parent();
						var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
						var mapInfoWrapper=mapMoudelWrapper.children(".leaflet-mapInfo-Wrapper");
						var mapInfoContent=mapInfoWrapper.children(".leaflet-mapInfo-Content");
						var mapInfoMenu=mapMoudelWrapper.children('.leaflet-mapInfo-Menu');
						var projToolBtn=mapInfoMenu.children('#'+mapMoudelWrapperId+'-projToolBtn-'+checkedProjToolData.bsm);
						if(!projToolBtn.length){
							projToolBtn=$("<a id='"+mapMoudelWrapperId+'-projToolBtn-'+checkedProjToolData.bsm+"' href='javascript:void(0)'></a>").html("<span class='glyphicon glyphicon-wrench' ></span><span>×</span>"+checkedProjToolData.name).appendTo(mapInfoMenu);
							$("<div></div>").addClass("leaflet-projTools-toolInfo").appendTo(mapInfoContent);
						}
						projToolBtn.click();
						projToolBtn.on('click','span:not(.glyphicon)',function(e){
							me.resultFeatureLayer.clearLayers();
						});
						var projToolInfo=mapInfoContent.children().eq(projToolBtn.index()+1);
						var paramName=checkedProjToolData.paramName;
						var paramObject={};
						paramObject[paramName]=features[i].properties[fieldAlias];
						paramObject.oprateMap=me._map;
						paramObject.toolData=checkedProjToolData;
						paramObject.identifyFeature=features[i];
						$(projToolInfo)[checkedProjToolData.executeContent](paramObject);
						break;
					}else if(checkedProjToolData.showType==3){
						var fieldValue=features[i].properties[fieldAlias];
						var paramName=checkedProjToolData.paramName;
						var url=checkedProjToolData.executeContent;
						loft.hashgo(url+'?'+paramName+'='+fieldValue,'', true, fieldValue, fieldValue);
					}else if(checkedProjToolData.showType==4){
						window.open(checkedProjToolData.executeContent);
					}
				}
			}
			if(callbackFun){
				callbackFun();
			}
		});
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
	cancleProjToolListener:function(){
		if(this._map._markerControl&&(this._map.hasLayer(this._map._markerControl.moveIcon)||this._map.hasLayer(this._map._markerControl.moveMarker))){
			this._map._markerControl.cancleMarkerListener();
		}
		if(this._map._measureControl&&this._map.hasLayer(this._map._measureControl.moveIcon)){
			this._map._measureControl.clearNowMeasure();
		}
		if(this._map._identifyControl){
			var identifyControl=this._map._identifyControl;
			for(var i=0;i<identifyControl._identifycontainer.childNodes.length;i++){
				if(identifyControl._identifycontainer.childNodes[i].hasAttribute('class')){
					identifyControl._identifycontainer.childNodes[i].removeAttribute('class');
					identifyControl.cancleIdentifyListener();
					break;
				}
			}
		}
		if(this.resultFeatureLayer){
			this.resultFeatureLayer.removeFrom(this._map);
			this.resultFeatureLayer=undefined;
		}
		if(this._container){
			$(this._container).removeClass("leaflet-projTools-active");
		}
		if(this._allToolsUl){
			$(this._allToolsUl).children().removeClass("leaflet-projTools-projToolActive");
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
	}
});
		
L.control.ProjTools = function (options) {
    return new L.Control.ProjTools(options);
};






	

