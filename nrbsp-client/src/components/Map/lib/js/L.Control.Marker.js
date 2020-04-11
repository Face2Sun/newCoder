/*************************添加标绘控件**********************************************************/
L.Control.Marker = L.Control.extend({
	options: {
		position: 'bottomright' //初始位置

	},
	initialize: function (options) {
		L.Util.extend(this.options, options);
		this.marker_zindex=2000;
		this.moveMarker=L.marker([0, 0],{
			zIndexOffset:this.marker_zindex
		});
		this.moveIcon=L.marker([0, 0],{
			zIndexOffset:this.marker_zindex
		});
		this.showMarkers=[];
	},
	onAdd: function (map) {
		map._markerControl=this;

		this.currentMarkerGroup=L.layerGroup([]).addTo(this._map);
		this.markersLayer=L.geoJSON([], {
		    style: function (feature) {
		        return {
		        	color:'#237CC9',
					weight:2,
					fillColor: '#237CC9',
					fillOpacity:0.2
		        };
		    }
		}).addTo(this._map);

		this._container = L.DomUtil.create('div', 'leaflet-marker-show');
		this._container.title="标绘";
		L.DomEvent.addListener(this._container, 'click', this.createMarker,this);
		this.stopAllPropagation(this._container);

		this._markercontainer = L.DomUtil.create('div', 'leaflet-control-marker',this._container);
		this._markercontainer.style.display="none";
		
		var pointContainer=L.DomUtil.create('div', '',this._markercontainer);
		pointContainer.title="标注点";
		this._pointContainer=pointContainer;
		L.DomEvent.addListener(this._pointContainer, 'click', this.pointMarker,this);
		
		var lineContainer=L.DomUtil.create('div', '', this._markercontainer);
		lineContainer.title="标注线";
		this._lineContainer=lineContainer;
		L.DomEvent.addListener(this._lineContainer, 'click', this.lineMarker,this);
		
		var polygonContainer=L.DomUtil.create('div', '', this._markercontainer);
		polygonContainer.title="标注面";
		this._polygonContainer=polygonContainer;
		L.DomEvent.addListener(this._polygonContainer, 'click', this.polygonMarker,this);

		var configContainer=L.DomUtil.create('div', '', this._markercontainer);
		configContainer.title="标绘管理";
		this._configContainer=configContainer;
		L.DomEvent.addListener(this._configContainer, 'click', this.configMarkerWrapper,this);
		this.stopAllPropagation(this._configContainer);
		
		return this._container;
	},
	configMarkerWrapper:function(){
		var me=this;
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		var mapInfoWrapper=mapMoudelWrapper.children(".leaflet-mapInfo-Wrapper");
		var mapInfoContent=mapInfoWrapper.children(".leaflet-mapInfo-Content");
		var mapInfoMenu=mapMoudelWrapper.children('.leaflet-mapInfo-Menu');
		var markerConfigBtn=mapInfoMenu.find('.glyphicon-flag').parent();
		var markerInfo=mapInfoContent.find(".leaflet-marker-markerInfo");
		var allMarkersWrapper=markerInfo.find(".leaflet-marker-markersWrapper");
		if(!markerConfigBtn.length){
			markerConfigBtn=$("<a href='javascript:void(0)'></a>").html("<span class='glyphicon glyphicon-flag' ></span><span>×</span>标绘").appendTo(mapInfoMenu);
			markerConfigBtn.on('click','span:not(.glyphicon)',function(e){
				me.showMarkers=[];
				me.markersLayer.clearLayers();
			});
			markerInfo=$("<div></div>").addClass("leaflet-marker-markerInfo").appendTo(mapInfoContent);
			$("<span></span>").text("标绘管理").addClass('leaflet-marker-markerHead').appendTo(markerInfo);
			var showResult=$("<div id='"+mapMoudelWrapperId+"-marker-showReaultBtn' title='展示当前标绘'></div>").html("<span class='glyphicon glyphicon-eye-open'></span>").addClass('leaflet-marker-showResultMarkers').appendTo(markerInfo);
			L.DomEvent.addListener(showResult[0], 'click', this.showResultLayer,this);
			$("<div class='form-group col-md-12 leaflet-marker-typeSelect'></div>").appendTo(markerInfo).html("<label class='control-label'>类型：</label><input type='text' name='"+mapMoudelWrapperId+"-markerType' id='"+mapMoudelWrapperId+"-markerType'/>");
			var searchWrapper=$("<div class='col-md-12 leaflet-marker-searchWrapper'></div>").appendTo(markerInfo);
			var searchInput=$("<div class='input-group'><input type='text' id='"+mapMoudelWrapperId+"-marker-searchKey' class='form-control'></div>").appendTo(searchWrapper);
			var searchBtn=$("<span class='input-group-addon' id='"+mapMoudelWrapperId+"-marker-searchBtn'><span class='glyphicon glyphicon-search'></span></span>").appendTo(searchInput);
			allMarkersWrapper=$("<div class='col-md-12' id='"+mapMoudelWrapperId+"-allMarkers'></div>").addClass('leaflet-marker-markersWrapper').appendTo(markerInfo);
			this.initAllMarkersGrid();
			$("#"+mapMoudelWrapperId+"-markerType").combobox({
				dataSource:[{name:"全部",value:"allTypes"},{name:"点",value:"Point"},{name:"线",value:"LineString"},{name:"面",value:"Polygon"}],
				dataTextField:'name',
				dataValueField:'value',
				value:"allTypes",
				change:function(){

					var showResultBtn=$("#"+mapMoudelWrapperId+"-marker-showReaultBtn");
					if(showResultBtn.attr("title")=="隐藏所有标绘"){
						me.showResultLayer();
					}
					var filterMarkerType=$("#"+mapMoudelWrapperId+"-markerType").combobox("value");
					if(!filterMarkerType||filterMarkerType==''||filterMarkerType=="allTypes"){
						me.markersGrid.grid("reloadData",me.allMarkerData);
						me.classifyMarkerData=me.allMarkerData;
					}else{
						me.classifyMarkerData=[];
						for(var i in me.allMarkerData){
							var theGeometry=JSON.parse(me.allMarkerData[i].geometry);
							if(theGeometry.type==filterMarkerType){
								me.classifyMarkerData.push(me.allMarkerData[i]);
							}
						}
						me.markersGrid.grid("reloadData",me.classifyMarkerData);
					}
				}
			});
			$("#"+mapMoudelWrapperId+"-marker-searchBtn").on("click",function(){
				var searchKey=$("#"+mapMoudelWrapperId+"-marker-searchKey").val();
				if(!searchKey||searchKey==""){
					me.markersGrid.grid("reloadData",me.classifyMarkerData);
					return;
				}
				var newMarkerData=[];
				for(var i in me.classifyMarkerData){
					var containIndex=me.classifyMarkerData[i].remark.indexOf(searchKey);
					if(containIndex>-1){
						newMarkerData.push(me.classifyMarkerData[i]);
					}
				}
				me.markersGrid.grid("reloadData",newMarkerData);
			});
		}
		markerConfigBtn.click();
		mapInfoContent.show('fast',function(){
			mapMoudelWrapper.find('.leaflet-mapInfo-display').find("span").attr("class","glyphicon glyphicon-triangle-left");
			allMarkersWrapper.height(markerInfo.height()-allMarkersWrapper.position().top-10);
			me.markersGrid.grid("reloadData",me.allMarkerData);			
		});
	},
	showResultLayer:function(){
		var me=this;
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		var showResultBtn=$("#"+mapMoudelWrapperId+"-marker-showReaultBtn");
		if(showResultBtn.attr("title")=="展示当前标绘"){
			var nowMarkerData=this.markersGrid.grid("getRowData");
			for(var i in nowMarkerData){
				var markerAlreadyShow=false;
				for(var j in this.showMarkers){
					if(nowMarkerData[i].bsm==this.showMarkers[j].bsm){
						markerAlreadyShow=true;
						break;
					}
				}
				if(!markerAlreadyShow){
					var theGeometry=JSON.parse(nowMarkerData[i].geometry);
					var markerGeoJsonData={type:"Feature",properties:{},geometry:theGeometry};
					var thisMarker;
					if(theGeometry.type=='Point'){
						var center=L.GeoJSON.coordsToLatLng(theGeometry.coordinates);
						thisMarker=L.marker(center).addTo(this.markersLayer);
						thisMarker.bounce(3).on('click',function(){
							this.bounce(3);
						});
		            }else{
		            	thisMarker=L.geoJSON(markerGeoJsonData).addTo(this.markersLayer);
		            }
					this.showMarkers.push({bsm:nowMarkerData[i].bsm,theMarker:thisMarker});
					var tipLocation=null;
					if(nowMarkerData[i].tipLocation){
						tipLocation=nowMarkerData[i].tipLocation.split(','); 
						tipLocation[0]=Number(tipLocation[0]);
						tipLocation[1]=Number(tipLocation[1]);
					}
					this.bindPopupToMarker(thisMarker,nowMarkerData[i].remark,tipLocation);
				}
			}
			showResultBtn.attr("title","隐藏所有标绘");
			showResultBtn.children().first().removeClass("glyphicon-eye-open");
			showResultBtn.children().first().addClass("glyphicon-eye-close");
		}else{
			this.showMarkers=[];
			this.markersLayer.clearLayers();	
			showResultBtn.attr("title","展示当前标绘");
			showResultBtn.children().first().removeClass("glyphicon-eye-close");
			showResultBtn.children().first().addClass("glyphicon-eye-open");
		}
	},
	getAllMarkersByProjNo:function(projNo) {
		var me=this;
	    var url = '/rest/cerdar/customGraphicsController/getGraphicsList?projectNo='+ projNo;
	    var errorCallback = function(resp) {
	        console.log('resp', resp);
	    }
	    var request = me.getRestApi(url, 'get', '', errorCallback);
	    return request;
	},
	addNewMarker:function(markerData){
		var me=this;
	    var url = '/rest/cerdar/customGraphicsController/add';
	    var errorCallback = function(resp) {
	        console.log('resp', resp);
	    }
	    var request = me.getRestApi(url, 'post', markerData, errorCallback);
	    return request;
	},
	deletaMarkerByBsm:function(markerBsm){
		var me=this;
	    var url = '/rest/cerdar/customGraphicsController/deleteByBsm?bsm='+markerBsm;
	    var errorCallback = function(resp) {
	        console.log('resp', resp);
	    }
	    var request = me.getRestApi(url, 'DELETE', markerBsm, errorCallback);
	    return request;
	},
	updateTipOfMarker:function(markerBsm,tip){
		var me=this;
	    var url = '/rest/cerdar/customGraphicsController/updateRemark?bsm='+markerBsm+'&remark='+tip;
	    var errorCallback = function(resp) {
	        console.log('resp', resp);
	    }
	    var request = me.getRestApi(url, 'POST', '', errorCallback);
	    return request;
	},
	initAllMarkersGrid:function(){
		var me=this;
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		this.allMarkerData=[];
		this.markersGrid=$("#"+mapMoudelWrapperId+"-allMarkers").grid({
			data: [],   
            colModel: [
            	{ name: 'bsm',key:true, hidden:true},
                { name: 'remark', label:'备注', resizable:false, editable:true,classes:'leaflet-marker-oprate'},
                {
                    name: '操作',
                    formatter: 'actions',
                    width:120,
                    resizable:false,
                    sortable:false,
                    formatoptions: {
                        editbutton: true, 
                        delbutton: true,
                        inlineButtonAdd: [{
                            id: "showGeometry_btn", //每个图标的id规则为id+"_"+rowid
                            className: "leaflet-marker-gemoBtn",//每个图标的class
                            icon: "glyphicon glyphicon-map-marker",//图标的样子
                            title: "查看标绘"//鼠标移上去显示的内容
                        }]
                    }
                }
            ],
            autowidth:true,
            beforeSaveRow:function( e, rowid, data, option ){
            	me.updateTipOfMarker(rowid,data.remark).done(function(resp) {
            		for(var i in me.showMarkers){
						if(rowid==me.showMarkers[i].bsm){
							me.showMarkers[i].theMarker.setPopupContent(data.remark);
							break;
						}
					}
					for(var i in me.allMarkerData){
						if(rowid==me.allMarkerData[i].bsm){
							me.allMarkerData[i].remark=data.remark;
							break;
						}
					}
		        }).fail(function(){
		        	loft.toast("error","标绘更新失败,请检查!")
		        });
            },
            beforeDeleteRow:function( e, rowid, data, option ){
            	me.deletaMarkerByBsm(rowid).done(function(resp) {
            		for(var i in me.showMarkers){
						if(rowid==me.showMarkers[i].bsm){
							me.showMarkers[i].theMarker.remove();
							me.showMarkers.splice(i,1);
							break;
						}
					}
					for(var i in me.allMarkerData){
						if(rowid==me.allMarkerData[i].bsm){
							me.allMarkerData.splice(i,1);
							break;
						}
					}
		        }).fail(function(){
		        	loft.toast("error","标绘删除失败,请检查!")
		        });
            },
            gridComplete:function(){
            	$("#"+mapMoudelWrapperId+"-allMarkers").css("width","100%");
            	$("#"+mapMoudelWrapperId+"-allMarkers .ui-jqgrid-view").css({"width":"100%","height":"100%","padding-top":$("#"+mapMoudelWrapperId+"-allMarkers .ui-jqgrid-hdiv").height(),"left":"0", "box-sizing":"border-box","position":"relative"});
            	$("#"+mapMoudelWrapperId+"-allMarkers .ui-jqgrid-hdiv").css({"width":"100%","position":"absolute","top":"0","left":"0"});
            	$("#"+mapMoudelWrapperId+"-allMarkers .ui-jqgrid-hbox").css({"width":"100%","padding-right":"0"});
            	$("#"+mapMoudelWrapperId+"-allMarkers .ui-jqgrid-bdiv").css({"width":"100%","height":"100%"});
            	$("#"+mapMoudelWrapperId+"-allMarkers").find('table').css("width","100%");
            }
		});
		this.markersGrid.on("click", ".leaflet-marker-gemoBtn", function (e) {
            var rowid = $(this).closest("tr.jqgrow").attr("id");
            var thisMarkerData=me.markersGrid.grid("getRowData",rowid);
            var theGeometry=JSON.parse(thisMarkerData.geometry);
            var markerGeoJsonData={type:"Feature",properties:{},geometry:theGeometry};
            var tips=thisMarkerData.remark;
            var theMarkerBsm=thisMarkerData.bsm;
            for(var i in me.showMarkers){
            	if(me.showMarkers[i].bsm==theMarkerBsm){
            		if(theGeometry.type=='Point'){
						var center=L.GeoJSON.coordsToLatLng(theGeometry.coordinates);
						me.showMarkers[i].theMarker.bounce(3);
		            	me._map.setView(center,me._map.getZoom());
		            }else{
		            	me._map.fitBounds(me.showMarkers[i].theMarker.getBounds());
		            }
		            return;
            	}
            }
			var thisMarker;
			if(theGeometry.type=='Point'){
				var center=L.GeoJSON.coordsToLatLng(theGeometry.coordinates);
				thisMarker=L.marker(center).addTo(me.markersLayer);
				me.bindPopupToMarker(thisMarker,tips);
				thisMarker.bounce(3).on('click',function(){
					this.bounce(3);
				});
            	me._map.setView(center,me._map.getZoom());
            }else{
            	thisMarker=L.geoJSON(markerGeoJsonData).addTo(me.markersLayer);
            	var tipLocation=thisMarkerData.tipLocation;
            	if(tipLocation){
					tipLocation=tipLocation.split(','); 
					tipLocation[0]=Number(tipLocation[0]);
					tipLocation[1]=Number(tipLocation[1]);
            		me.bindPopupToMarker(thisMarker,tips,tipLocation);
            	}else{
            		me.bindPopupToMarker(thisMarker,tips);
            	}
            	me._map.fitBounds(thisMarker.getBounds());
            }
            me.showMarkers.push({bsm:theMarkerBsm,theMarker:thisMarker});
            var showResultBtn=$("#"+mapMoudelWrapperId+"-marker-showReaultBtn");
			if(showResultBtn.attr("title")=="展示当前标绘"){
				showResultBtn.attr("title","隐藏所有标绘");
				showResultBtn.children().first().removeClass("glyphicon-eye-open");
				showResultBtn.children().first().addClass("glyphicon-eye-close");
			}
        });
        this.getAllMarkersByProjNo(me._map._projectInfo.no).done(function(resp) {
            me.allMarkerData=resp.rest;
            me.classifyMarkerData=me.allMarkerData;
            me.markersGrid.grid("reloadData",me.allMarkerData);	
        });
	},
	createMarker:function(e){
		if(this._markercontainer.style.display=="none"){
			this._markercontainer.style.display="block";
		}else{
			this._markercontainer.style.display="none";
		}
		e.stopPropagation();
	},
	pointMarker:function(e){

		this.cancleMarkerListener();
		L.DomUtil.addClass(this._pointContainer,'leaflet-control-pointActive');

		this.clickFunction=this.addClickMarker;
		this._map.on("click",this.clickFunction,this);
		
		this.moveFunction=this.addMoveMarker;
		this._map.on("mousemove",this.moveFunction,this);
		
		this.rightClickFunction=this.cancleMarkerListener;
		this._map.on("contextmenu",this.rightClickFunction,this);
		
		e.stopPropagation();
	},
	addClickMarker:function(e){
		this.clickLocation=[e.latlng.lat,e.latlng.lng];
		this.cancleMarkerListener();
		var pointMarker=L.marker(this.clickLocation).addTo(this.markersLayer).bounce(3).on('click',function(){
			this.bounce(3);
		});
		this.addTip(pointMarker);
	},
	addMoveMarker:function(e){
		this._map.getContainer().style.cursor="pointer";
		this.moveMarker.addTo(this.currentMarkerGroup);
		this.moveMarker.setLatLng(e.latlng);
		this.moveMarker.setZIndexOffset(this.marker_zindex);
	},
	lineMarker:function(e){

		this.cancleMarkerListener();
		L.DomUtil.addClass(this._lineContainer,'leaflet-control-lineActive');
		
		this.poly_points = [];
		this.poly_line=new L.Polyline([],{
			color:'#237CC9',
			//opacity:0.6,
			weight:2
		});//折线
		this.dashLine=new L.Polyline([],{
			color:'#237CC9',
			//opacity:0.6,
			dashArray: [10, 10],
			weight:2
		});
		
		this.clickFunction=this.addLineLatlng;
		this._map.on('click',this.clickFunction,this);
		
		this.dblclickFunction=this.addLineMarker;
		this._map.on('dblclick',this.dblclickFunction,this);
		
		this.moveFunction=this.addDashLine;
		this._map.on("mousemove",this.moveFunction,this);
		
		this.rightClickFunction=this.cancleMarkerListener;
		this._map.on("contextmenu",this.rightClickFunction,this);
		
		e.stopPropagation();
	},
	addLineLatlng:function(e){
		this.poly_points.push([e.latlng.lat,e.latlng.lng]);
	},
	addLineMarker:function(e){
		this.cancleMarkerListener();
		this._map.removeLayer(this.dashLine);
		if(this.poly_points.length>2){
			this.poly_line.setLatLngs(this.poly_points);
			this.poly_line.addTo(this.markersLayer);
			return this.addTip(this.poly_line,this.poly_points[this.poly_points.length-1]);
		}else{
			return;
		}
	},
	addDashLine:function(e){
		this._map.getContainer().style.cursor="pointer";
		this.moveIcon.addTo(this.currentMarkerGroup);
		if(this.poly_points.length>0){
			this.dashLine.setLatLngs(this.poly_points);
			this.dashLine.addLatLng([e.latlng.lat,e.latlng.lng]).addTo(this.currentMarkerGroup);
			this.moveIcon.setIcon(L.divIcon({html:"<div class='leaflet-marker-markerTooltip'>双击添加备注</div>",className:"leaflet-marker-noDefaultDivIcon"}));
		}else{
			this.moveIcon.setIcon(L.divIcon({html:"<div class='leaflet-marker-markerTooltip'>点击开始绘制，双击结束</div>",className:"leaflet-marker-noDefaultDivIcon"}));
		}
		this.moveIcon.setLatLng(e.latlng);
		this.moveIcon.setZIndexOffset(this.marker_zindex+20);
	},
	polygonMarker:function(e){
		
		this.cancleMarkerListener();
		L.DomUtil.addClass(this._polygonContainer,'leaflet-control-polyActive');

		this.poly_points = [];//区域点
		this.poly_area=new L.polygon([],{
			color:'#237CC9',
			//opacity:0.6,
			weight:2,
			fillColor: '#237CC9',
			fillOpacity:0.2
		});
		
		this.poly_now=new L.polygon([],{
			color:'#237CC9',
			//opacity:0.6,
			weight:2,
			dashArray: [10, 10],
			fillColor: '#237CC9',
			fillOpacity:0.3
		});
		
		this.clickFunction=this.addPolyLatlng;
		this._map.on('click',this.clickFunction,this);
		
		this.dblclickFunction=this.addPloygonMarker;
		this._map.on('dblclick',this.dblclickFunction,this);
		
		this.moveFunction=this.addPolyNow;
		this._map.on("mousemove",this.moveFunction,this);
		
		this.rightClickFunction=this.cancleMarkerListener;
		this._map.on("contextmenu",this.rightClickFunction,this);
		
		e.stopPropagation();
	},
	addPolyLatlng:function(e){
		this.poly_points.push([e.latlng.lat,e.latlng.lng]);
	},
	addPloygonMarker:function(e){
		this.cancleMarkerListener();
		this._map.removeLayer(this.poly_now);		
		
		if(this.poly_points.length>2){
			this.poly_area.setLatLngs(this.poly_points).addTo(this.markersLayer);
			var tipLocation=this.poly_points[this.poly_points.length-1];
			return this.addTip(this.poly_area,tipLocation);
		}else{
			return;
		}
	},
	addPolyNow:function(e){
		this._map.getContainer().style.cursor="pointer";
		this.moveIcon.addTo(this.currentMarkerGroup);
		if(this.poly_points.length>0){
			this.poly_now.setLatLngs(this.poly_points);
			this.poly_now.addLatLng([e.latlng.lat,e.latlng.lng]).addTo(this.currentMarkerGroup);
			this.moveIcon.setIcon(L.divIcon({html:"<div class='leaflet-marker-markerTooltip'>双击添加备注</div>",className:"leaflet-marker-noDefaultDivIcon"}));
		}else{
			this.moveIcon.setIcon(L.divIcon({html:"<div class='leaflet-marker-markerTooltip'>点击开始绘制，双击结束</div>",className:"leaflet-marker-noDefaultDivIcon"}));
		}
		this.moveIcon.setLatLng(e.latlng);
		this.moveIcon.setZIndexOffset(this.marker_zindex+20);
	},
	addTip:function(marker_add,tipLocation){
		var me=this;
		var coverAll=L.DomUtil.create('div', 'leaflet-marker-coverAll',document.body);
		var markTipWrapper=L.DomUtil.create('div', 'leaflet-marker-markerTipWrapper',coverAll);
		markTipWrapper.innerHTML="<p>备注</p><input type='text' placeholder='请输入备注' /><p><input type='button' value='确定'  /><input type='button' value='取消' /></p>";
		markTipWrapper.childNodes[1].focus();
		L.DomEvent.addListener(markTipWrapper.childNodes[2].childNodes[0], 'click', function(){
			var tips="暂无备注";
			if(markTipWrapper.childNodes[1].value!=null&&markTipWrapper.childNodes[1].value.length!=0){
				tips=markTipWrapper.childNodes[1].value;
			}
			if(tipLocation!=null){
				me.bindPopupToMarker(marker_add,tips,tipLocation);
			}else{
				me.bindPopupToMarker(marker_add,tips);
			}
			var newMarkerData={};
			newMarkerData.geometry=JSON.stringify(marker_add.toGeoJSON().geometry);
			newMarkerData.projectNo=me._map._projectInfo.no;
			newMarkerData.remark=tips;
			if(tipLocation){
				newMarkerData.tipLocation=tipLocation.toString();
			}
			me.addNewMarker(newMarkerData).done(function(resp) {
				me.addMarkerToConfig(resp.rest);
				me.showMarkers.push({bsm:resp.rest.bsm,theMarker:marker_add});
	        }).fail(function(){
	        	loft.toast("error","标绘保存失败,请检查!")
	        });
			L.DomUtil.remove(markTipWrapper.parentNode);
		});
		
		L.DomEvent.addListener(markTipWrapper.childNodes[2].childNodes[1], 'click', function(){
			marker_add.removeFrom(me.markersLayer);
			L.DomUtil.remove(markTipWrapper.parentNode);
		});
		return  markTipWrapper;
	},
	bindPopupToMarker:function(theMarker,theTip,tipLocation){
		if(tipLocation!=null){
			theMarker.bindPopup(theTip,{
				autoPan:false,
				autoClose:false,
				className:'leaflet-marker-markerTip',
				keepInView:false
			}).openPopup(L.latLng(tipLocation[0],tipLocation[1]));
			theMarker.off("click");
			theMarker.on('click',function(){
				theMarker.openPopup(L.latLng(tipLocation[0],tipLocation[1]));
			})	
		}else{
			theMarker.bindPopup(theTip,{
				autoClose:false,
				className:'leaflet-marker-markerTip'
			}).openPopup();
		}
	},
	addMarkerToConfig:function(markerGeoJson){
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapMoudelWrapperId=mapMoudelWrapper.attr("id");
		var allMarkersWrapper=mapMoudelWrapper.find(".leaflet-marker-markersWrapper");
		if(allMarkersWrapper.length>0){
			this.allMarkerData.unshift(markerGeoJson);
			var filterMarkerType=$("#"+mapMoudelWrapperId+"-markerType").combobox("value");
			if(filterMarkerType==markerGeoJson.geometry.type||!filterMarkerType||filterMarkerType=="allTypes"){
				this.markersGrid.grid("addRowData",markerGeoJson,'first');
			}
		}
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
	cancleMarkerListener:function(){
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
		if(this._map._projToolsControl&&$(this._map._projToolsControl._container).hasClass("leaflet-projTools-active")){
			var projToolsControl=this._map._projToolsControl;
			if($(projToolsControl._container).hasClass("leaflet-projTools-active")){
				projToolsControl.cancleProjToolListener();
			}
		}
		if(this._markercontainer){
			for(var i=0;i<this._markercontainer.childNodes.length;i++){
				this._markercontainer.childNodes[i].removeAttribute('class');
			}
		}
		if(this.clickFunction){
			this._map.off('click',this.clickFunction,this);
		}
		if(this.dblclickFunction){
			this._map.off('dblclick',this.dblclickFunction,this);	
		}
		if(this.moveFunction){
			this._map.off('mousemove',this.moveFunction,this);
		}
		if(this.rightClickFunction){
			this._map.off("contextmenu",this.rightClickFunction,this);
		}
		if(this._map.hasLayer(this.currentMarkerGroup)){
			this.currentMarkerGroup.clearLayers();
		}
		this._map.getContainer().style.cursor="-webkit-grab";
	},
	uuid:function(){
		var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    s[8] = s[13] = s[18] = s[23] = "-";
	 
	    var uuid = s.join("");
	    return uuid;
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
		
L.control.Marker = function (options) {
    return new L.Control.Marker(options);
};