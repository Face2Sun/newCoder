/*************************添加图例控件************************************/
L.Control.Legend = L.Control.extend({
	options: {
		position: 'bottomright' //初始位置
	},
	initialize: function (options) {
		L.Util.extend(this.options, options);
	},
	onAdd: function (map) {
		map._legendControl=this;
		this._container = L.DomUtil.create('div', 'leaflet-legend-show');
		this._container.title="图例";
		L.DomEvent.addListener(this._container, 'click', this.addLegend,this);
		this.stopAllPropagation(this._container);

		return this._container;
	},
	addLegend:function(){
		var containerId=this.getLegendContainerId();
		var container=$("#"+containerId);
		var mapMoudelWrapper=$(this._map.getContainer()).parent().parent();
		var mapInfoWrapper=mapMoudelWrapper.children(".leaflet-mapInfo-Wrapper");
		var mapInfoContent=mapInfoWrapper.children(".leaflet-mapInfo-Content");
		var mapInfoMenu=mapMoudelWrapper.children('.leaflet-mapInfo-Menu');
		var legendInfoBtn=mapInfoMenu.find('.glyphicon-picture').parent();
		if(!container.length){
			legendInfoBtn=$("<a href='javascript:void(0)'></a>").html("<span class='glyphicon glyphicon-picture' ></span><span>×</span>图例").appendTo(mapInfoMenu);
			$("<div></div>").attr("id",containerId).addClass("leaflet-legend-legendInfo").appendTo(mapInfoContent);
			var projectInfo=this._map._projectInfo;
			for(var i in projectInfo.serviceList){
				this.loadServiceLengend(projectInfo.serviceList[i]);
			}
		}
		legendInfoBtn.click();
		if(mapInfoWrapper.css("display")=="none"){
			mapInfoWrapper.show('fast',function(){
				mapMoudelWrapper.find('.leaflet-mapInfo-display').find("span").attr("class","glyphicon glyphicon-triangle-left");
			});
		}
	},
	loadServiceLengend:function(serviceInfo){
		var me=this;
		var containerId=this.getLegendContainerId();
		var container=$("#"+containerId);
		$.ajax({
			url:serviceInfo.serviceUrl+"/legend?f=pjson",
			success:function(data){
				var legends=JSON.parse(data);
				var serviceLegendWrapper=$("<div></div>").attr({"orderData":serviceInfo.orderNo,"serviceBsm":serviceInfo.bsm}).appendTo(container);
				for(var j in legends.layers){
					var layerLegendWrapper=$("<div></div>").attr({"layerId":legends.layers[j].layerId,"layerName":legends.layers[j].layerName}).appendTo(serviceLegendWrapper);
					var layerTitleWrapper=$("<div></div>").addClass("leaflet-legend-titleWrapper").appendTo(layerLegendWrapper);
					var layerLegendExpend=$("<span></span>").addClass("glyphicon glyphicon-triangle-bottom").appendTo(layerTitleWrapper);
					layerTitleWrapper.on("click",function(){
						if($(this).children().eq(0).hasClass("glyphicon glyphicon-triangle-right")){
							$(this).children().eq(0).attr("class","glyphicon glyphicon-triangle-bottom");
						}else{
							$(this).children().eq(0).attr("class","glyphicon glyphicon-triangle-right");
						}
						$(this).next().toggle();
					});
					var layerTitle=$("<span></span>").addClass("leaflet-legend-title").html(legends.layers[j].layerName).appendTo(layerTitleWrapper);
					var legendList=$("<ul></ul>").addClass("leaflet-legend-list").appendTo(layerLegendWrapper);
					for(var m in legends.layers[j].legend){
						var legend=legends.layers[j].legend[m];
						var legendWrapper=$("<li></li>").appendTo(legendList);
						var legendImg=$("<img />").attr({"src":"data:"+legend.contentType+";base64,"+legend.imageData,"height":legend.height,"width":legend.width}).appendTo(legendWrapper);
						var legendLabel=$("<span></span>").text(legend.label).appendTo(legendWrapper);
					}
				}
				var allServiceLegend=$("#"+containerId).children();
				var projectInfo=me._map._projectInfo;
				if(allServiceLegend.length==projectInfo.serviceList.length){
					for(var i=0;i<allServiceLegend.length-1;i++){
						for(var j=i+1;j<allServiceLegend.length;j++){
							if(allServiceLegend.eq(i).attr("orderData")>allServiceLegend.eq(j).attr("orderData")){
								allServiceLegend.eq(j).insertBefore(allServiceLegend.eq(i));
							}
						}
					}
				}
				me.visibleLayerLegends();
			}
		});
	},
	visibleLayerLegends:function(){
		var containerId=this.getLegendContainerId();
		var allServiceLegend=$("#"+containerId).children();
		var allService=this._map._allService;
		for(var i in allServiceLegend){
			for(var j in allService){
				if(allServiceLegend.eq(i).attr("serviceBsm")==allService[j].bsm){
					if((allService[j].showLayers&&allService[j].showLayers.length==0)||allService[j].opacity==0){
						allServiceLegend.eq(i).css("display","none");
					}else{
						allServiceLegend.eq(i).css("display","block");
						if(allService[j].showLayers){
							var layersLegend=allServiceLegend.eq(i).children();
							for(var m in layersLegend){
								var layerLegendShow=false;
								for(var n in allService[j].showLayers){
									if(layersLegend.eq(m).attr("layerId")==allService[j].showLayers[n].id&&layersLegend.eq(m).attr("layerName")==allService[j].showLayers[n].title){
										layerLegendShow=true;
										layersLegend.eq(m).css("display","block");
										break;
									}
								}
								if(!layerLegendShow){
									layersLegend.eq(m).css("display","none");
								}
							}
						}
					}
					continue;
				}
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
	getLegendContainerId:function(){
		var mapContainer=this._map.getContainer();
		var mapContainerId=mapContainer.getAttribute("id");
		return mapContainerId.split('-map-container')[0]+'-map-legend';
	}
});
		
L.control.Legend = function (options) {
    return new L.Control.Legend(options);
};