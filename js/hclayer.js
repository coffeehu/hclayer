/*
    hucong 2018-03-28
    弹出层插件
*/
(function(){


var utils = {
	width:function(el){
		if(this.isWindow(el)){
			return window.document.documentElement.clientWidth;
		}
		return this.getWidthOrHeight(el,'width','content');
	},
	inWidth:function(el){
		return this.getWidthOrHeight(el,'width','padding');
	},
	outWidth:function(el,margin){
		var extra = margin?'margin':'border';
		return this.getWidthOrHeight(el,'width',extra);
	},
	height:function(el){
		if(this.isWindow(el)){
			return window.document.documentElement.clientHeight;
		}
		return this.getWidthOrHeight(el,'height','content');
	},
	inHeight:function(el){
		return this.getWidthOrHeight(el,'height','padding');
	},
	outHeight:function(el,margin){
		var extra = margin?'margin':'border';
		return this.getWidthOrHeight(el,'height',extra);
	},
	getWidthOrHeight:function(el,type,extra){
		var isHide = false;
		var _display, _visibility;
		if(el.style.display === 'none') { //不可见
			isHide = true;
			_display = el.style.display, 
			_visibility = el.style.visibility;
			el.style.display = 'block';
			el.style.visibility = 'hidden';
		}

		var styles = this.getStyle(el),
			val = this.curCSS(el,type,styles),
			isBorderBox = this.curCSS(el,'boxSizing',styles) === 'border-box';

		if(val === 'auto'){
			val = el['offset'+type[0].toUpperCase()+type.slice(1)];
		}

		val = parseFloat(val)||0;
		
		var finalVal = ( val + this.argumentWidthOrHeight(el,type,extra,isBorderBox,styles) );

		if(isHide){
			el.style.display = _display;
			el.style.visibility = _visibility;
		}

		return finalVal;
	},
	getStyle:function(el){
		var view = el.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( el );
	},
	curCSS:function(el,type,styles){
		var val;
		if(styles){
			val = styles.getPropertyValue(type) || styles[type];
		}
		return val;
	},
	//当为 borderBox 时，width 宽度为 content+padding+border
	argumentWidthOrHeight:function(el,type,extra,isBorderBox,styles){
		var val = 0, that = this;
		var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
		var i;

		if(extra === (isBorderBox?'border':'content') ){ // 此时不需要进行padding、border、margin的加减，所以不参与循环
			i = 4;
		}else{
			i = ( type==='width' ? 1 : 0 );			
		}

		for(;i<4;i=i+2){

			if(extra === 'margin'){
				val += parseFloat( that.curCSS(el, 'margin'+cssExpand[i], styles) );
			}

			// 当为 border-box 时，减去
			if(isBorderBox){
				// padding 和 content 时都会减去 border
				if(extra !== 'margin'){
					val -= parseFloat( that.curCSS(el, 'border'+cssExpand[i]+'Width', styles) );
				}

				if(extra === 'content'){
					val -= parseFloat( that.curCSS(el, 'padding'+cssExpand[i], styles) );
				}
			}else{
				if(extra !== 'content'){
					val += parseFloat( that.curCSS(el, 'padding'+cssExpand[i], styles) );
				}
				if(extra === 'border'|| extra === 'margin'){
					val += parseFloat( that.curCSS(el, 'border'+cssExpand[i]+'Width', styles) );
				}
			}

		}
		return val;
	},
	isWindow:function( obj ) {
		return obj != null && obj === obj.window;
	},
	css:function(el,name,value){
		// 取值
		if(typeof name === 'string' && value === undefined){
			var styles = this.getStyle(el);
			var val = this.curCSS(el,name,styles);
			return val;
		}

		// 赋值		
		var type = typeof name,
		i;
		if(type === 'string'){
			this.style(el,name,value);
		}else if(type === 'object'){
			for(i in name){
				this.style(el,i,name[i]);
			}
		}
	},
	style:function(el,name,value){
		var type = typeof value,
			style = el.style;
		if ( value !== undefined ) {

			if(type === 'number'){
				value += this.cssNumber[name]?'':'px';
			}

			style[ name ] = value;
		}
	},
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},
	remove:function(el){
		var p = el.parentNode;
		if(p){
			el.parentNode.removeChild( el );
		}
		return el;
	},
	hasClass:function(el,value){
		var className = ' '+value+' ';
		var curValue = el.getAttribute && el.getAttribute('class') || '';
		var cur = ' '+this.stripAndCollapse(curValue)+' ';

		if(cur.indexOf(className) > -1){
			return true;
		}
		return false;
	},
	addClass:function(el, value){
		var classes = this.classesToArray(value),
		curValue,cur,j,clazz,finalValue;

		if(classes.length>0){
			curValue = el.getAttribute && el.getAttribute('class') || '';
			cur = ' '+this.stripAndCollapse(curValue)+' ';

			if(cur){
				var j=0;
				while( (clazz = classes[j++]) ){
					if ( cur.indexOf( ' ' + clazz + ' ' ) < 0 ) {
						cur += clazz + ' ';
					}
				}

				finalValue = this.stripAndCollapse(cur);
				if(curValue !== finalValue){
					el.setAttribute('class',finalValue);
				}
			}
		}
	},
	removeClass:function(el, value){
		var classes = this.classesToArray(value),
		curValue,cur,j,clazz,finalValue;

		if(classes.length>0){
			curValue = el.getAttribute && el.getAttribute('class') || '';
			cur = ' '+this.stripAndCollapse(curValue)+' ';

			if(cur){
				var j=0;
				while( (clazz = classes[j++]) ){
					if ( cur.indexOf( ' ' + clazz + ' ' ) > -1 ) {
						cur = cur.replace(' '+clazz+' ' ,' ');
					}
				}

				finalValue = this.stripAndCollapse(cur);
				if(curValue !== finalValue){
					el.setAttribute('class',finalValue);
				}
			}
		}
	},
	stripAndCollapse:function(value){
		var htmlwhite = ( /[^\s]+/g );
		var arr = value.match(htmlwhite)||[];
		return arr.join(' ');
	},
	classesToArray:function(value){
		if ( Array.isArray( value ) ) {
			return value;
		}
		if ( typeof value === "string" ) {
			var htmlwhite = ( /[^\s]+/g );
			return value.match( htmlwhite ) || [];
		}
		return [];
	},
	extend:function(){
		var target  = arguments[0],
			i = 1,
			length = arguments.length,
			obj,copy,name;

		for(;i<length;i++){
			obj = arguments[i];
			for(name in obj){
				copy = obj[name];
				target[name] = copy;
			}
		}

		return target;
	},
	addHandler : function(element, type, handler){
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		}
		else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		}else {
			element["on" + type] = handler;
		}
	},
	removeHandler : function(element, type, handler){
		if(element.removeEventListener){
			element.removeEventListener(type, handler, false);
		}else if(element.attachEvent){
			element.detachEvent("on"+type, handler);
		}else{
			element["on" + type] = null;
		}
	},
	one:function(el,type,fn){
		var origFn = fn;
		fn = function(){
			el.removeEventListener(type,fn,false);
			return origFn();
		};
		el.addEventListener(type,fn,false);
	},
	addcss:function(){
        var id = 'hc-layer-css';
        if(document.getElementById(id)) return;
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        var path = this.getPath();
        link.rel = 'stylesheet';
        link.href = path + '../css/hclayer.css';
        link.id = id;
        head.appendChild(link);
    },
    getScrollBarWidth: function() {
    	var scrollBarWidth;
		var outer = document.createElement('div');
		outer.className = 'h-scrollbar--wrap';
		outer.style.visibility = 'hidden';
		outer.style.width = '100px';
		outer.style.position = 'absolute';
		outer.style.top = '-9999px';
		document.body.appendChild(outer);

		var widthNoScroll = outer.offsetWidth;
		outer.style.overflow = 'scroll';

		var inner = document.createElement('div');
		inner.style.width = '100%';
		outer.appendChild(inner);

		var widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild(outer);
		scrollBarWidth = widthNoScroll - widthWithScroll;

		return scrollBarWidth;
    },
    getPath:function(){
        // IE9下，document.currentScript 为 null
        var jsPath = document.currentScript ? document.currentScript.src : function(){
            var js = document.scripts
            ,last = js.length - 1
            ,src;
            for(var i = last; i > 0; i--){
                if(js[i].readyState === 'interactive'){
                  src = js[i].src;
                  break;
                }
            }
            return src || js[last].src;
        }();
        return jsPath.substring(0,jsPath.lastIndexOf('/')+1);
    }
};

//-------------------------- tips -------------------
function getRelativeBoundingClientRect(reference, position) {
	var parentRect = getBoundingClientRect(document.documentElement);
	var referenceRect = getBoundingClientRect(reference);

	if(position === 'fixed') {
		return referenceRect;
	}

	return {
		top: referenceRect.top - parentRect.top,
		bottom: referenceRect.top - parentRect.top + referenceRect.height,
        left: referenceRect.left - parentRect.left,
        right: referenceRect.left - parentRect.left + referenceRect.width,
        width: referenceRect.width,
        height: referenceRect.height
    };
}
// TODO
function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect();

    var isIE = navigator.userAgent.indexOf("MSIE") != -1;

    var rectTop = isIE && element.tagName === 'HTML'
        ? -element.scrollTop
        : rect.top;

    return {
        left: rect.left,
        top: rectTop,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.right - rect.left,
        height: rect.bottom - rectTop
    };
}
function createPopper(content) {
	var popper = document.createElement('span');
	popper.innerHTML = content;
	utils.addClass(popper, 'hclayer-tips');
	document.body.appendChild(popper);
	return popper;
}
function addArrow(popper) {
	const arrow = document.createElement('div');
	arrow.className = 'hclayer-tips--arrow';
	popper.appendChild(arrow);
}
function handlerListener(reference, popper, type) {
	if(type === 'hover') {
		var timeId = null;
		popper.isEnterPopper = false;
		utils.addHandler(reference, 'mouseenter', function() {
			if(timeId !== null) clearTimeout(timeId);
			showTips(popper);
		});
		utils.addHandler(reference, 'mouseleave', function() {
			timeId = closeTips(popper);
		});
		utils.addHandler(popper, 'mouseenter', function() {
			popper.isEnterPopper = true;
		});
		utils.addHandler(popper, 'mouseleave', function() {
			popper.isEnterPopper = false;
			timeId = closeTips(popper);
		});
	}else if(type === 'click') {
		utils.addHandler(reference, 'click', function() {

		});
	}
}
function closeTips(popper, isEnterPopper) {
	return setTimeout(function() {
		if(popper.isEnterPopper) return;
		utils.removeClass(popper, 'hc-is-show');
		utils.addClass(popper, 'hc-is-hide');
	}, 200);
}
function showTips(popper) {
	utils.removeClass(popper, 'hc-is-hide');
	utils.addClass(popper, 'hc-is-show');
}
var DEFAULT = {
	placement: 'top',
	modifiers: [ 'applyStyle' ],
}
function Popper(reference, popper, options){
	this._reference = reference;
	this._popper = popper;
	this._options = utils.extend({}, DEFAULT, options);
	this._options.modifiers = this._options.modifiers.map(function(modifier){
		return this.modifiers[modifier] || modifier;
	}.bind(this));
	this._popper.setAttribute('x-placement', this._options.placement);
	this.position = this._getPosition(reference);
	this.update();
	return this;
}

Popper.prototype._getPosition = function(reference){
	var isFixed = this._isFixed(reference);
	return isFixed ? 'fixed' : 'absolute';
}
Popper.prototype._isFixed = function(el){
	if(el === document.body){
		return false;
	}
	if( utils.css(el,'position') === 'fixed' ){
		return true;
	}
	return el.parentNode ? this._isFixed(el.parentNode) : el;
}
Popper.prototype.update = function(){
	var data = { instance: this };
	data.placement = this._options.placement;
	data.offsets = this._getOffsets(this._popper, this._reference, data.placement);

	this.modifiers.applyStyle.call(this,data);
}
/*
	placement: 暂时只有 top/bottom/left/right,
	以后会增加为 top/top-start/top-end/
			   bottom/bottom-start/bottom-end/
			   left/left-start/left-end/
			   right/right-start/right-end
*/
Popper.prototype._getOffsets = function(popper, reference, placement){
	var referenceOffsets = getRelativeBoundingClientRect(reference, this.position);
	var popperOffsets = {};
	popperOffsets.width = utils.outWidth(popper, true);
	popperOffsets.height = utils.outHeight(popper, true);
	
	placement = placement.split('-')[0];
	if(placement === 'right' || placement === 'left') {
		popperOffsets.top = referenceOffsets.top + referenceOffsets.height/2 - popperOffsets.height/2;
		if(placement === 'right'){
			popperOffsets.left = referenceOffsets.right;
		}else {
			popperOffsets.left = referenceOffsets.left - popperOffsets.width;
		}
	}else {
		popperOffsets.left = referenceOffsets.left + referenceOffsets.width/2 - popperOffsets.width/2;
		if(placement === 'top'){
			popperOffsets.top = referenceOffsets.top - popperOffsets.height;
		}else {
			popperOffsets.top = referenceOffsets.bottom;
		}
	}

	return {
        popper: popperOffsets,
        reference: referenceOffsets
    };
}
Popper.prototype.destroy = function(){
	console.log('destroy');
}
Popper.prototype.modifiers = {
	applyStyle: function(data){
		var styles = {
            position: this.position
        };

        // round top and left to avoid blurry text
        var left = Math.round(data.offsets.popper.left);
        var top = Math.round(data.offsets.popper.top);
		styles.left =left;
		styles.top = top;
		utils.css(this._popper, styles);
	}
}
//------------------ tips end -----------------------------

/*
	TODO:
	开启自动载入 css 后，若 html 页面只有 loading 模块（页面长度比较短？），弹出 msg 无异常；
	HTML 页面新增了 alert、msg 模块后（页面变长了？），弹出 msg 样式会发生偏移
*/
//utils.addcss();

var msgList = []; //存储 msg 的实例
var noticeList = []; //存储 notice 的实例

var hclayer = window.hclayer = {
	index:0,

	msg:function(content){
		var opt = null;
		if(typeof content === 'string'){
			opt = {
				type: 'msg',
				content: content,
				time: 3000,
				maxWidth: 360
			}
		}else if(typeof content === 'object'){
			opt = utils.extend({},{
				type: 'msg',
				content:content,
				time:3000,
				maxWidth: 360
			},content);
		}
		var o = new Layer(opt);
		msgList.push(o);
		return o;
	},

	notice: function(content) {
		var opt = null;
		if(typeof content === 'string'){
			opt = {
				type: 'notice',
				title: '',
				close: true,
				time: 3000,
				content: content
			}
		}else if(typeof content === 'object'){
			opt = utils.extend({},{
				type: 'notice',
				title: '',
				close: true,
				time: 3000,
				content: content
			}, content);
		}
		var o = new Layer(opt);
		noticeList.push(o);
		return o;		
	},

	alert:function(content){
		var opt = null;
		if(typeof content === 'string'){
			opt = {
				type: 'alert',
				shade:true,
				title:'',
				close:true,
				content:content,
				btn:true,
				yes:'确定',
				move:false
			}
		}else if(typeof content === 'object'){
			opt = utils.extend({},{
				type: 'alert',
				shade:true,
				title:'',
				close:true,
				content:content,
				btn:true,
				yes:'确定',
				move:false
			},content);
		}
		var o = new Layer(opt);
		return o;
	},

	dialog: function(content) {
		var opt = null;
		if(typeof content === 'string' || content instanceof HTMLElement) {
			opt = utils.extend({}, {
				type: 'dialog',
				shade: true,
				title: '',
				close: true,
				content: content,
				btn: false
			})
		}
		var o = new Layer(opt);
		return o;
	},

	/*
		opt为数字时，表示加载类型（字段load）：1-菊花转动；2-圆形旋转
		opt为对象时，opt.parent 参数指明其父元素
	*/
	load:function(opt){
		var isHorizontal = opt && opt.loadText && opt.horizontal ? ' hc-is-inlineblock hc-is-middle ' : ''; //若是有加载文字，且为水平显示时，置为inline-block
		var content = '<div class="hclayer-load-spinner">';
		var parent = null,
			load = null,
			lock = opt ? opt.lock : false,
			background = null;
		if(typeof opt === 'object'){
			parent = opt.parent;
			load = opt.load ? opt.load : 1;
			background = opt.background;
		}else{
			load = opt ? opt : 1;
		}

		// load 动画的类型
		switch(load){
			case 1:
				content += '<svg class="loading-circle-wrapper '+ isHorizontal +'" width="45" height="45" viewBox="0 0 100 100" >\
								<circle class="loading-circle" cx="50" cy="50" r="46" fill="none" stroke-width="4"></circle>\
							</svg>';
				break;
			case 2: 
				content += '<div class="hcload1 '+ isHorizontal +'"><div class="hcload-lines">'+
							'<div></div><div></div><div></div><div></div><div></div><div></div>'+
						   '</div></div>';
				break;
			case 3:
				content += '<div class="hcload2 '+ isHorizontal +'"></div>';
				break;
			case 4:
				content += '<div class="h-loading-flower-sm '+ isHorizontal +'">'+
			    			'<div class="lines"><div></div><div></div><div></div><div></div></div>'+
			    		   '</div>';
				break;
		}

		if(opt && opt.loadText) {
			content += '<p class="hclayer-load-text '+ isHorizontal +'">'+ opt.loadText +'</p>';
		}

		content += '</div>';

		var option = {
			type: 'load',
			content: content,
			shade: false,
			parent: parent,
			lock: lock,
			background: background
		}
		var o = new Layer(option);
		return o;
	},

	tips: function(content, id) {
		var mId = null;
		var mContent = '';
		var placement = 'top';
		var type = 'hover';  // hover/click
		if(typeof content === 'string' && id) {
			mContent = content;
			mId = id;			
		}else if(typeof content === 'object') {
			if(!content.id) throw new Error('you must specify the "id"!');
			mContent = content.content;
			mId = content.id;
			placement = content.placement || 'top';
			type = content.type || 'hover';
		}
		
		var reference = document.getElementById(mId);
		var popper = createPopper(mContent);
		addArrow(popper);
		handlerListener(reference, popper, type);

		new Popper(reference, popper, { placement: placement });

		utils.addClass(popper, 'hc-is-hide');
	},

	//关闭所有弹窗
	closeAll: function(type){
		if(type === 'msg') {
			for(var i=msgList.length-1; i>=0; i--) {
				msgList[i].close();
			}
		}
		if(type === 'notice') {
			for(var i=noticeList.length-1; i>=0; i--) {
				noticeList[i].close();
			}
		}
	}
}

var config = {
	shade:false, //遮罩层
	title:false, //标题
	icon: false, // 开启图标: info/success/help/warn/error（todo: 暂时只有 notice、alert 用到）
	close:false, //关闭按钮
	//content: //内容
	btn:false, //底部按钮
	yes:false, //确定按钮 (btn:true时生效)
	no:false, //取消按钮 (btn:true时生效)
	move:false, //可否拖动
	zIndex:12345678,
	time:0,  //为0时不自动关闭
	type: 'msg',  // msg, alert, load
	maxWidth: 360,
	lock: false, //锁滚动条
	center: false, //内容居中
	//background: // 控制 alert、load 的背景颜色
	position: 'top-right', // notice 的位置，top-right\top-left\bottom-right\bottom-left
	skin: '', // 自定义 class
	closeOnClickShade: false, // 点击遮罩层是否关闭弹框（目前仅应用到 alert）
	//el: 'test',  // 用于 tips, 指定应用的元素
};
var iconType = {
	info: true,
	success: true,
	help: true,
	warn: true,
	error: true
}

function Layer(opt){
	this.config = utils.extend({}, config, opt);
	this.index = ++hclayer.index;
	this.create();
}

Layer.prototype.create = function(){
	var that = this,
		key,
		htmlContainer = [];

	var p = null, // 用于 load，其父元素
		loadMask = null; //用于 load，load 本体元素

	if(that.config.parent){
		p = document.getElementById(that.config.parent);
		loadMask = p.getElementsByClassName('hclayer-load-mask')[0];
	}

	if(loadMask) {  // 若父元素里已有了 load 元素，则无需重新渲染 html
		loadMask.setAttribute('hclayer-id',that.index);
		return;
	}

	var main = that.main = that._createMain();

	//点击遮罩层关闭
	if( (that.config.type === 'alert' || that.config.type === 'dialog') && that.config.closeOnClickShade) {
		main.onclick = function(e) {
			if(main === e.target) {
				that.close();
			}
		}
	}
	
	/*
		弹框的父元素默认为 body 元素。
		parent可指定父元素，一般用于 load() 函数
	*/
	if(p){
		//若 parent 为 static，则强制设为 relative（记得移除）
		var position = utils.css(p, 'position');
		if(position !== 'absolute' && position !== 'fixed' && position !== 'relative') {
			utils.addClass(p, 'hclayer-is-relative');
		}
		//utils.addClass(main,'hclayer-child');
		p.appendChild(main);
		main._parent = p;
	}else{
		if(that.config.lock) {
			utils.addClass(document.body, 'hclayer-is-lock');
			that.paddingRight = utils.css(document.body, 'paddingRight');
			utils.css(document.body, 'paddingRight', utils.getScrollBarWidth());
			/* 
				添加一个标识，表示对于这个弹窗，关闭时需要执行解除 lock 操作；
				若不这样做的话，所有的 close() 关闭弹框调用都会执行解除 lock 操作，造成不需要的影响
			*/
			that.shouldRmoveLock = true;
		}
		document.body.appendChild(main);
	}

	// dialog 的处理： content 为一个 DOM 元素的情况
	if(that.config.content instanceof HTMLElement) {
		var content = document.getElementById('hclayer--temp-content');
		content.appendChild(that.config.content);
		content.removeAttribute('id');
	}

	// notice 的处理: 当页面存在多个 notice 时，依次偏移
	if(that.config.type === 'notice') {
		var offsetTop = 16;
		for(var i=0,l=noticeList.length; i<l; i++) {
			var instance = noticeList[i];
			if(instance.config.position !== that.config.position) continue;
			offsetTop += instance.main.offsetHeight + 16;
		}
		var offsetName = that.config.position.indexOf('top-') > -1 ? 'top' : 'bottom';
		utils.css(main, offsetName, offsetTop);
	}

    /*
    	bug:chrome浏览器，alert,移动到确定按钮后，页面出现白色的“花版”;
    	移除掉 anim class 后正常。
    	TDO:'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
    */
    utils.one(that.main,'animationend',function(){
    	utils.removeClass(that.main,'hclayer-anim hclayer-anim-bounceIn hclayer-anim-fadeIn hclayer-anim-rightIn');
    })

	//点击事件绑定
	that.listener();

	// 自动关闭
	if(that.config.time !== 0){
		setTimeout(function(){
			that.close();
		}, this.config.time);	
	}
	
	// msg 时调整大小与位置
	if(that.config.type === 'msg'){
		//that.autoSize();
		that.setOffset();
		//TDO:多次点击生成msg，避免重复监听
		utils.addHandler(window,'resize',function(){
			that.setOffset();
		})
	}

	//开启拖拽
	if(that.config.move){
		that.move();
	}

}
Layer.prototype._createMain = function() {
	var that = this,
		key,
		htmlContainer = [];

	var views = {
		shade: function() {
			if(!that.config.shade) return '';
			if( document.getElementsByClassName('hclayer-shade')[0] ) return; //避免重复添加 shade
			var shade = that.shade = document.createElement('div');
			utils.addClass(shade,'hclayer-shade hclayer-anim hclayer-anim-fadeIn');
			var op = (typeof that.config.shade === 'number')?that.config.shade:0.3;
			utils.css(shade,{'zIndex':that.config.zIndex-1, 'opacity':op, background: that.config.background});
			shade.setAttribute('id','hclayer-shade'+that.index);
			document.body.appendChild(shade);
			return '';
		},
		icon: function() {
			if(!that.config.icon) return '';
			if(that.config.type !== 'notice') return '';  //todo：暂时只有 notice、alert 有这功能
			if(iconType[that.config.icon]) {
				return '<div class="hclayer-icon hclayer-icon--'+that.config.icon+'"></div>';	
			}
			return '<div class="hclayer-icon '+that.config.icon+'"></div>'
		},
		title: function() {
			if(!that.config.title) {
				if(that.config.type === 'alert'){ // alert: 当没有 title 时，也应该返回一个空白的填充元素，否则不美观。
					return '<div class="hclayer-title" style="height:20px;padding:0"></div>';
				}else{
					return '';
				}
			}

			// 居中的时候，alert 的 icon 是设置在 title 上的。
			if(that.config.type === 'alert' && that.config.icon && that.config.center) {
				if(iconType[that.config.icon]) {
					return '<div class="hclayer-title"><div class="hclayer-icon hclayer-icon--'+that.config.icon+'"></div><div class="hclayer-title--inner">'+that.config.title+'</div></div>';
				}
				return '<div class="hclayer-title"><div class="hclayer-icon '+that.config.icon+'"></div><div class="hclayer-title--inner">'+that.config.title+'</div></div>';
			}
			
			return '<div class="hclayer-title">'+that.config.title+'</div>';
		},
		close: function() {
			if(!that.config.close) return '';
			var html = '';
			if(that.config.title){
				html = '<div class="hclayer-close"></div>';
			}else{
				html = '<div class="hclayer-close hclayer-close-2"></div>';
			}
			return html;
		},
		content: function() {
			if(that.config.type === 'load') {  // 类型为 load 时
				return that.config.content;
			}
			if(that.config.content instanceof HTMLElement) {
				var display = utils.css(that.config.content, 'display');
				that.config.content = that.config.content.cloneNode(true);
				if(display === 'none') {
					utils.css(that.config.content, 'display', 'block');	
				}				
				return '<div class="hclayer-content" id="hclayer--temp-content"></div>';	
			}
			// alert 的 icon 在 content 中设置
			// 注意，alert 居中的时候，icon 是设置在 title 上的
			if(that.config.type === 'alert' && that.config.icon && !that.config.center) {
				if(iconType[that.config.icon]) {
					return '<div class="hclayer-content"><div class="hclayer-icon hclayer-icon--'+that.config.icon+'"></div><div class="hclayer-content--inner">'+that.config.content+'</div></div>';	
				}
				return '<div class="hclayer-content"><div class="'+that.config.icon+'"></div><div class="hclayer-content--inner">'+that.config.content+'</div></div>';
			}
			return '<div class="hclayer-content">'+that.config.content+'</div>';
		},
		btn: function() {
			if(!that.config.btn) return '';
			var html = '<div class="hclayer-btn">';
			if(that.config.no){
				html += '<a class="hclayer-btn-no">'+that.config.no+'</a>';
			}
			if(that.config.yes){
				html += '<a class="hclayer-btn-yes">'+that.config.yes+'</a>';
			}
			html += '</div>'
			return html;
		}
	};

	for(key in views){
		htmlContainer.push( views[key]() );
	}

	//主体
	var main = document.createElement('div');

	//设置对应的 class
	var style = that.config.skin + ' ';
	switch(that.config.type){
		case 'msg': // msg
			style += 'hclayer hclayer-dialog hclayer-msg hclayer-style-black';
			break;
		case 'notice':
			style += 'hclayer hclayer-dialog hclayer-notice';
			break;
		case 'alert': 
			style += 'hclayer hclayer-dialog hclayer-alert';
			break;
		case 'dialog': 
			style += 'hclayer hclayer-dialog hclayer-alert hclayer-dialog-custom';
			break;
		case 'load': // load
			style += that.config.parent ? 'hclayer-load-mask' : 'hclayer-load-mask hclayer-is-full';
			break;
	}

	// 是否有 icon
	if(that.config.icon) {
		style += ' hclayer-dialog-icon '
	}

	//文字居中
	if(that.config.center) {
		style += ' hc-is-center ';
	}

	// load 的背景色。 而 alert 的背景色是应用在 shade 上的。
	if(that.config.type === 'load') {
		utils.css(main, 'background', that.config.background);
	}

	// notice 的动画
	if(that.config.type === 'notice') {
		if(that.config.position.indexOf('right') > -1) {
			style += ' right hclayer-anim hclayer-anim-rightIn';
		}else {
			style += ' left hclayer-anim hclayer-anim-leftIn';
		}
	}

	utils.addClass(main, style);

	// 动画
	if(that.config.type === 'load') {
		utils.addClass(main, 'hclayer-anim hclayer-anim-fadeIn');
	} else if(that.config.type === 'msg' || that.config.type === 'alert' || that.config.type === 'dialog'){
		utils.addClass(main, 'hclayer-anim hclayer-anim-bounceIn');	
	}

	// 关闭所有
	if(that.config.type === 'msg'){
		//hclayer.closeAll('dialog');
		hclayer.closeAll('msg');	
	}
	
	main.innerHTML = htmlContainer.join('');

	// alert 需要加一个全屏的 wrapper，用于居中
	if(that.config.type === 'alert' || that.config.type === 'dialog') {
		var _main = main;
		main = document.createElement('div');
		main.className = "hclayer-alert-wrapper";
		main.appendChild(_main);
	}

	utils.css(main,'zIndex',that.config.zIndex);
	main.setAttribute('hclayer-id',that.index);
	main.setAttribute('id','hclayer'+that.index);

	return main;
}

/*自适应高宽*/
Layer.prototype.autoSize = function(){
	var that = this,
		main = that.main,
		wh = utils.height(window),//窗口可视高度
		ww = utils.width(window),//窗口可视宽度
		h = utils.outHeight(main),
		w = utils.outWidth(main);

	/*
		使用自动加载css时，第一次打开浏览器窗口，若是就调用了hclayer，那么会出现问题：
		1、此时css还没有加载进来，但main元素已渲染出来了，因此它的默认宽度为100%窗口宽度，
		因此计算出的 left 会非常小。
		2、紧接着css被加载进来了，然后main元素的宽度恢复到设定的值。而left依旧很小，
		所以造成的视觉效果就是弹出的框贴着窗口左边。

		因此应该在这里限制弹框的宽度
	*/
	if( w > that.config.maxWidth){
		utils.css(main,'width',that.config.maxWidth);
	}

	//如果弹出框高度比窗口还高时，设置高度
	if( wh <= h ){
		utils.css(main,'height',wh-10);
	}
}

/*设置位置*/
Layer.prototype.setOffset = function(){
	var that = this,
		main = that.main,
		area = [utils.outWidth(main),utils.outHeight(main)];
	var offset = null;

	// 当指定 parent 父元素时，根据指定元素确定弹框位置
	if(that.config.parent){
		var p = document.getElementById(that.config.parent);
		if(p){
			var _left = (utils.inWidth(p) - area[0])/2;
			var _right = (utils.inHeight(p) - area[1])/2;
			offset = that.offset = {
				left: _left>0?_left:0,
				top: _right>0?_right:0
			}
		}
	}
	// 默认以可视窗口为父元素
	else{
		offset = that.offset = {
			left: (utils.width(window) - area[0])/2,
			top: (utils.height(window) - area[1])/2
		}
	}

	utils.css(main,{left:offset.left, top:offset.top});
}

/*按钮的点击事件*/
Layer.prototype.listener = function(){
	var that = this;

	//关闭后的回调
	var close = that.main.getElementsByClassName('hclayer-close')[0];
	if(close){
		utils.addHandler(close,'click',function(){
			that.close();
			if(typeof close === 'function') that.config.close();
		})
	};

	//确定按钮的回调
	var yes = that.main.getElementsByClassName('hclayer-btn-yes')[0];
	if(yes){
		utils.addHandler(yes,'click',function(){
			if(typeof that.config.yesCallback === 'function'){
				that.config.yesCallback(function(){
					that.close();	
				});
			}else{
				that.close();
			}
		})
	};

	var no = that.main.getElementsByClassName('hclayer-btn-no')[0];
	if(no){
		utils.addHandler(no,'click',function(){
			if(typeof that.config.noCallback === 'function'){
				that.config.noCallback(function(){
					that.close();
				});
			}else{
				that.close();
			}
		})
	}

}

/*拖拽*/
Layer.prototype.move = function(){
	var that = this,
		title = that.main.getElementsByClassName('hclayer-title')[0],
		innerMain = that.main.getElementsByClassName('hclayer-dialog')[0], //考虑到如alert的情况，它的main是hclayer-alert-wrapper，而我们想要的是里面的hclayer-dialog
		startMove = false,
		offset;

	if(title) {
		utils.css(title,'cursor','move');

		utils.addHandler(title,'mousedown',function(e){
			e.preventDefault(); // 附赠功能：title的文字不会被选中

			//------------设置 main 为 fixed 且居中位置------------
			if( utils.css(innerMain, 'position') !== 'fixed' ){
				var area = [utils.outWidth(innerMain),utils.outHeight(innerMain)];
				var left = (utils.width(window) - area[0])/2,
					top = (utils.height(window) - area[1])/2;

				utils.css(innerMain, {position:'fixed', left:left, top:top});
			}
			//------------设置 END------------------

			offset = [
				e.clientX - parseFloat( utils.css(innerMain, 'left') ),
				e.clientY - parseFloat( utils.css(innerMain, 'top') ),
			]
			startMove = true;
		});
	}

	utils.addHandler(document,'mousemove',function(e){
		if(startMove){
			var x = e.clientX - offset[0],
				y = e.clientY - offset[1];

			// 限制移动范围，不超过可视区域
			var wh = utils.height(window)-utils.height(innerMain);
			var ww = utils.width(window)-utils.width(innerMain);
			x = x<0?0:x;
			y = y<0?0:y;
			x= x>ww?ww:x;
			y= y>wh?wh:y;

			utils.css(innerMain, 'left', x);
			utils.css(innerMain, 'top', y);
		}		
	});

	utils.addHandler(document,'mouseup',function(e){
		startMove = false;
	});
}

Layer.prototype.close = function() {
	var that = this;
	var main = that.main;
	if(main){
		//因为 load 和 alert/msg 的关闭动画不一样，所以要区分
		if(that.config.type === 'load' || that.config.type === 'notice') { 
			utils.addClass(main,'hclayer-anim-closeFade');
		} else if(that.config.type === 'msg' || that.config.type === 'alert' || that.config.type === 'dialog') {
			utils.addClass(main,'hclayer-anim-closeBounce');
		}
		setTimeout(function(){
			utils.remove(main);

			// load()：移除父类添加的 is-relative 类
			if(main._parent) {
				utils.removeClass(main._parent, 'hclayer-is-relative');
				main._parent = null;
			}
			if(that.shouldRmoveLock) { //表明该弹框弹出时做了 lock 操作，因此此时需要解除 lock
				/*setTimeout(() => {
					
				}, 300)*/
				utils.css(document.body, {'paddingRight': that.paddingRight});
				utils.removeClass(document.body, 'hclayer-is-lock');
			}

		},200);	
	}

	/*遮罩层*/
	var shade = this.shade;
	if(shade){
		utils.addClass(shade, 'hclayer-anim-closeFade');
		setTimeout(function(){
			utils.remove(shade);
		},200);	
	}

	//从 List 中移除
	if(this.config.type === 'msg') {
		for(var i=msgList.length-1; i>=0; i--) {
			if(msgList[i].index === this.index) {
				msgList.splice(i, 1);
				break;
			}
		}
	} 
	else if(this.config.type === 'notice') {
		var index = -1;
		var instance = null;
		for(var i=noticeList.length-1; i>=0; i--) {
			if(noticeList[i].index === this.index) {
				index = i;
				instance = noticeList[i];
				noticeList.splice(i, 1);
				break;
			}
		}
		if(!instance) return;
		//设置 notice 的偏移
		var offset = instance.main.offsetHeight + 16;
		var offsetName = this.config.position.indexOf('top-') > -1 ? 'top' : 'bottom';
		for(var i=index,l=noticeList.length; i<l; i++) {
			if(instance.config.position !== noticeList[i].config.position) continue;
			//var main = noticeList[i].main;  //注意，上面 setTimeout 中调用了 main，因此这个变量名不能写作 main，否则会冲突
			var noticeMain = noticeList[i].main;

			var originalOffset = parseInt( utils.css(noticeMain, offsetName) );
			utils.css(noticeMain, offsetName, originalOffset - offset);
		}

	}

}


})()