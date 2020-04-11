/*************************添加搜索显示与隐藏控件**********************************************************/
L.Control.Position = L.Control.extend({
	options: {
		position: 'bottomright' //初始位置

	},
	initialize: function (options) {
		L.Util.extend(this.options, options);

	},
	onAdd: function (map) {
		var me=this;
		map._positionControl=this;
		this._container = L.DomUtil.create('div', 'leaflet-position-show');
		this._container.title="定位";
		this.stopAllPropagation(this._container);
		L.DomEvent.addListener(this._container, 'click', this.createPosition,this);

		this._positioncontainer = L.DomUtil.create('div', 'leaflet-control-position', this._container);
		this.stopAllPropagation(this._positioncontainer);
		this._positioncontainer.style.display="none";
		
		var lngLabel=L.DomUtil.create('label', '', this._positioncontainer);
		lngLabel.innerHTML="经度：";
		var lngInput=L.DomUtil.create('input', '', this._positioncontainer);
		lngInput.setAttribute("type","text");
		this._lngInput=lngInput;
		this.addPlaceholder(lngInput,"经度");
		// lngInput.setAttribute("placeholder","请输入关键字");

		var latLabel=L.DomUtil.create('label', '', this._positioncontainer);
		latLabel.innerHTML="纬度：";
		var latInput=L.DomUtil.create('input', '', this._positioncontainer);
		latInput.setAttribute("type","text");
		this._latInput=latInput;
		this.addPlaceholder(latInput,"纬度");
		
		var positionBtn=L.DomUtil.create('input', 'leaflet-control-positionBtn', this._positioncontainer);
		positionBtn.setAttribute("type","button");
		this._positionBtn = positionBtn;
		L.DomEvent.addListener(this._positionBtn, 'click', this.position,this);

		return this._container;
	},
	createPosition:function(e){
		if(this._positioncontainer.style.display=="none"){
			this._positioncontainer.style.display="block";
		}else{
			this._positioncontainer.style.display="none";
		}
		e.stopPropagation();
	},
	position:function(){
		var lat=this._latInput.value;
		var lng=this._lngInput.value;
		var re = /^[0-9]+.?[0-9]*$/; 
		if(lat==''||lng==''){
			loft.toast('error','请输入经纬度！');
		}else if(!re.test(lat)||!re.test(lng)||Number(lat)>90||Number(lat)<-90||Number(lng)>180||Number(lng)<-180){
			loft.toast('error','请输入合法的经纬度！');
		}else{
			var maxBounds=this._map.options.maxBounds;
			var latlng = L.latLng(Number(lat), Number(lng));
			if(maxBounds.contains(latlng)){
				this._map.setView(latlng,this._map.getZoom());
			}else{
				loft.toast('error','该经纬度不在地图最大显示范围内！');
			}
		}
	},
	addPlaceholder:function(domElement,placeholderString){
		L.DomEvent.on(domElement, 'focus', function (ev) {
		    domElement.setAttribute("placeholder",placeholderString);
		});
		L.DomEvent.on(domElement, 'blur', function (ev) {
		    domElement.removeAttribute("placeholder");
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
		L.DomEvent.on(domElement, 'mousemove', function (ev) {
		    L.DomEvent.stopPropagation(ev);
		});
	},
});

L.control.Position = function (options) {
    return new L.Control.Position(options);
};



		