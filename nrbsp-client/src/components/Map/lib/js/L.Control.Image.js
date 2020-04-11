/*******************添加地图导出和打印控件**********************************/
L.Control.Image = L.Control.extend({
	options: {
		position: 'bottomright' //初始位置

	},
	initialize: function (options) {
		L.Util.extend(this.options, options);
	},
	onAdd: function (map) {		
		this._container = L.DomUtil.create('div', 'leaflet-image-show');
		this._container.title="导出当前地图";
		L.DomEvent.addListener(this._container, 'click', this.createImage,this);
		this.stopAllPropagation(this._container);

		this._imagecontainer = L.DomUtil.create('div', 'leaflet-control-image', this._container);
		this._imagecontainer.style.display="none";
		
		var exportContainer=L.DomUtil.create('div', '', this._imagecontainer);
		exportContainer.title="导出图片";
		this._exportContainer=exportContainer;
		L.DomEvent.addListener(this._exportContainer, 'click', this.outputImage,this);
		this.stopAllPropagation(this._exportContainer);
		
		var printContainer=L.DomUtil.create('div', '', this._imagecontainer);
		printContainer.title="打印地图";
		this._printContainer=printContainer;
		L.DomEvent.addListener(this._printContainer, 'click', this.printMap,this);
		this.stopAllPropagation(this._printContainer);


		return this._container;
	},
	createImage:function(e){
		if(this._imagecontainer.style.display=="none"){
			this._imagecontainer.style.display="block";
		}else{
			this._imagecontainer.style.display="none";
		}
		e.stopPropagation();
	},
	outputImage:function(){
		this.easyPrint(true);
	},
	printMap:function(){
		this.easyPrint(false);
	},
	easyPrint:function(isexport){
		var me=this;
		if(this._printer){
			this._printer.remove();
		}
		var dimensions = me._map.getSize();
		var mapSize = {
			width: dimensions.x,
			height: dimensions.y,
			className: 'mapCssClass',
			tooltip: 'map container size'
		}
		var baseLayers=this._map._baseLayerList;
		this._printer= L.easyPrint({
      		hidden:true,
      		sizeModes: ['Current', 'A4Landscape', 'A4Portrait',mapSize],
      		filename: 'myMap',
      		exportOnly: isexport,
      		hideControlContainer: true
		}).addTo(me._map);
		this._printer.printMap('mapCssClass', 'MyFileName');
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
		
L.control.Image = function (options) {
    return new L.Control.Image(options);
};