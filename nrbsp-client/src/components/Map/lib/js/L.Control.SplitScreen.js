/*************************添加对比显示与隐藏控件**********************************************************/
L.Control.SplitScreen = L.Control.extend({
	options: {
		position: 'bottomright' //初始位置

	},
	initialize: function (options) {
		L.Util.extend(this.options, options);
		this.splitX=1;
		this.splitY=1;
		this.allMap=[];
		this.mapContainerX=undefined;
		this.mapContainerY=undefined;

	},
	onAdd: function (map) {
		this.mapContainerX=map.getContainer().parentNode.offsetWidth;
		this.mapContainerY=map.getContainer().parentNode.offsetHeight;
		
		this._container = L.DomUtil.create('div', 'leaflet-splitScreen-show');
		this._container.title="分屏";
		L.DomEvent.addListener(this._container, 'click', this.createSplitScreen,this);
		this.stopAllPropagation(this._container);

		this._splitcontainer = L.DomUtil.create('div', 'leaflet-control-splitScreen',this._container);
		this._splitcontainer.style.display="none";
		
		var oneScreenContainer=L.DomUtil.create('div', '', this._splitcontainer);
		oneScreenContainer.title="取消分屏";
		this._oneScreenContainer=oneScreenContainer;
		L.DomEvent.addListener(this._oneScreenContainer, 'click', this.distoryAllMap,this);
		this.stopAllPropagation(this._oneScreenContainer);
		
		var twoScreenContainer=L.DomUtil.create('div', '', this._splitcontainer);
		twoScreenContainer.title="两屏";
		this._twoScreenContainer=twoScreenContainer;
		L.DomEvent.addListener(this._twoScreenContainer, 'click', this.splitTwoScreen,this);
		
		var fourScreenContainer=L.DomUtil.create('div', '', this._splitcontainer);
		fourScreenContainer.title="四屏";
		this._fourScreenContainer=fourScreenContainer;
		L.DomEvent.addListener(this._fourScreenContainer, 'click', this.splitFourScreen,this);

		return this._container;
	},
	createSplitScreen:function(e){
		if(this._splitcontainer.style.display=="none"){
			this._splitcontainer.style.display="block";
		}else{
			this._splitcontainer.style.display="none";
		}
		e.stopPropagation();
	},
	distoryAllMap:function(){
		if(this.splitY!=1||this.splitX!=1){
			var mapMoudelWrapper=this._map.getContainer().parentNode.parentNode;
			var syncMaps=this._map._syncMaps;
			for(var i=syncMaps.length-1;i>=0;i--){
				this._map.unsync(syncMaps[i]);
			}
			for(var i=1;i<this.allMap.length;i++){
				L.DomUtil.remove(this.allMap[i].getContainer().parentNode.parentNode);
				this.allMap[i].remove();
			}
			var mapMoudelWrapperId=mapMoudelWrapper.getAttribute("id");
			mapMoudelWrapper.removeAttribute("id");
			mapMoudelWrapper.parentNode.setAttribute("id",mapMoudelWrapperId);
			var childLength=mapMoudelWrapper.childNodes.length;
			for(var i=0;i<childLength;i++){
				mapMoudelWrapper.parentNode.appendChild(mapMoudelWrapper.childNodes[0]);
			}
			mapMoudelWrapper.parentNode.removeChild(mapMoudelWrapper);
			var mapInfoWrapper=$(this._map.getContainer()).parent();
			mapInfoWrapper.splitter("toggle","#"+mapMoudelWrapperId+"-mapInfo-Content");
			mapInfoWrapper.splitter("toggle","#"+mapMoudelWrapperId+"-mapInfo-Content");
			this.allMap=[];
			this._map.invalidateSize();
			for(var i=0;i<this._splitcontainer.childNodes.length;i++){
				this._splitcontainer.childNodes[i].removeAttribute('class');
			}
			this.splitX=1;
			this.splitY=1;

			if(this._map._navbarControl){
				var navbarControl=this._map._navbarControl;
				navbarControl.getContainer().style.display='block';
				navbarControl._viewHistory = [navbarControl._viewHistory[0],navbarControl._viewHistory[navbarControl._viewHistory.length-1]];
				navbarControl._curIndx=1;
				navbarControl._updateDisabled();
				this._map.off('moveend',navbarControl._updateHistory);
				this._map.once('moveend', function() {this._map.on('moveend', navbarControl._updateHistory, navbarControl);}, navbarControl);
			}

		}
	},
	splitTwoScreen:function(e){
		this.splitX=2;
		this.splitY=1;
		this.splitScreen();
		e.stopPropagation();
	},
	splitFourScreen:function(e){
		this.splitX=2;
		this.splitY=2;
		this.splitScreen();
		e.stopPropagation();
	},
	splitScreen:function(){
		if(this._map._measureControl&&this._map.hasLayer(this._map._measureControl.moveIcon)){
			this._map._measureControl.measure_layerGroup[this._map._measureControl.measure_layerGroup.length-1].clearLayers();
			this._map._measureControl.cancleMeasureListener();
		}
		if(this._map._markerControl&&(this._map.hasLayer(this._map._markerControl.moveMarker)||this._map.hasLayer(this._map._markerControl.moveIcon))){
			this._map._markerControl.cancleMarkerListener();
		}
		var splitX=this.splitX;
		var splitY=this.splitY;
		if(this.allMap.length!=0&&this.allMap.length!=this.splitX*this.splitY){
			this.distoryAllMap();
			this.splitX=splitX;
			this.splitY=splitY;
		}else if(this.allMap.length==this.splitX*this.splitY){
			this.distoryAllMap();
			return;
		}
		if(this.splitX*this.splitY==2){
			L.DomUtil.addClass(this._twoScreenContainer,'leaflet-control-twoScreenActive');
		}else if(this.splitX*this.splitY==4){
			L.DomUtil.addClass(this._fourScreenContainer,'leaflet-control-fourScreenActive');
		}
	
		var newWidth=(100/splitX-0.4)+"%";
		var newHeight=(100/splitY-0.4)+"%";
		
		var mapMoudelWrapper=this._map.getContainer().parentNode.parentNode;
		var mapMoudelWrapperId=$(mapMoudelWrapper).attr("id");
		var allMapWrapper=mapMoudelWrapper.cloneNode();
		allMapWrapper.removeAttribute("id");
		allMapWrapper.innerHTML="";
		mapMoudelWrapper.parentNode.insertBefore(allMapWrapper,mapMoudelWrapper);
		allMapWrapper.appendChild(mapMoudelWrapper);
		allMapWrapper.style.overflow="hidden";
		
		mapMoudelWrapper.removeAttribute("class");
		mapMoudelWrapper.removeAttribute("style");
		mapMoudelWrapper.style.width=newWidth;
		mapMoudelWrapper.style.height=newHeight;
		L.DomUtil.addClass(mapMoudelWrapper,'leaflet-splitScreen-newmapPosition');

		var mapInfoWrapper=$(this._map.getContainer()).parent();
		mapInfoWrapper.splitter("toggle","#"+mapMoudelWrapperId+"-mapInfo-Content");
		mapInfoWrapper.splitter("toggle","#"+mapMoudelWrapperId+"-mapInfo-Content");
		this._map.invalidateSize();

		if(this._map._navbarControl){
			var navbarControl=this._map._navbarControl;
			navbarControl.getContainer().style.display='none';
		}
		
		this.allMap.push(this._map);
		for(var i=1;i<splitX*splitY;i++){
			var newContainer=L.DomUtil.create('div', '', mapMoudelWrapper.parentNode);
			newContainer.setAttribute("id","leaflet-splitScreen-newMap"+i);
			newContainer.style.width=newWidth;
			newContainer.style.height=newHeight;
			L.DomUtil.addClass(newContainer,'leaflet-splitScreen-newmapPosition');
			var newInfo=this._map._projectInfo;
			var newmap=createMapModule("leaflet-splitScreen-newMap"+i,newInfo,true);
			newmap.setMinZoom(this._map.getMinZoom());
			newmap.setMaxZoom(this._map.getMaxZoom());
			newmap._projectInfo=newInfo;
			this.allMap.push(newmap);
		}
		for(var i=0;i<splitX*splitY;i++){
			for(j=0;j<splitX*splitY;j++){
				if(i!=j){
					this.allMap[i].sync(this.allMap[j]);
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
	}
});
		
L.control.SplitScreen  = function (options) {
    return new L.Control.SplitScreen(options);
};





