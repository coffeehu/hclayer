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
		//可见
		if(true){
			return this.getWidthOrHeight(el,'width','content');
		}
		//不可见
		else{

		}
	},
	inWidth:function(el){
		//可见
		if(true){
			return this.getWidthOrHeight(el,'width','padding');
		}
		//不可见
		else{

		}
	},
	outWidth:function(el,margin){
		var extra = margin?'margin':'border';
		//可见
		if(true){
			return this.getWidthOrHeight(el,'width',extra);
		}
		//不可见
		else{

		}
	},
	height:function(el){
		if(this.isWindow(el)){
			return window.document.documentElement.clientHeight;
		}
		//可见
		if(true){
			return this.getWidthOrHeight(el,'height','content');
		}
		//不可见
		else{

		}
	},
	inHeight:function(el){
		//可见
		if(true){
			return this.getWidthOrHeight(el,'height','padding');
		}
		//不可见
		else{

		}
	},
	outHeight:function(el,margin){
		var extra = margin?'margin':'border';
		//可见
		if(true){
			return this.getWidthOrHeight(el,'height',extra);
		}
		//不可见
		else{

		}
	},
	getWidthOrHeight:function(el,type,extra){
		var styles = this.getStyle(el),
			val = this.curCSS(el,type,styles),
			isBorderBox = this.curCSS(el,'boxSizing',styles) === 'border-box';

		if(val === 'auto'){
			val = el['offset'+type[0].toUpperCase()+type.slice(1)];
		}

		val = parseFloat(val)||0;
		
		return ( val + this.argumentWidthOrHeight(el,type,extra,isBorderBox,styles) );
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

/*
	TODO:
	开启自动载入 css 后，若 html 页面只有 loading 模块（页面长度比较短？），弹出 msg 无异常；
	HTML 页面新增了 alert、msg 模块后（页面变长了？），弹出 msg 样式会发生偏移
*/
//utils.addcss();


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
		return o.index;
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
		return o.index;
	},

	/*
		opt为数字时，表示加载类型（字段load）：1-菊花转动；2-圆形旋转
		opt为对象时，parent 参数指明其父元素
	*/
	load:function(opt){
		var isHorizontal = opt && opt.loadText && opt.horizontal ? ' hc-is-inlineblock hc-is-middle ' : ''; //若是有加载文字，且为水平显示时，置为inline-block
		var content = '<div class="hclayer-load-spinner">';
		var parent = null,
			load = null,
			lock = opt ? opt.lock : false;
		if(typeof opt === 'object'){
			parent = opt.parent;
			load = opt.load ? opt.load : 1;
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
			lock: lock
		}
		var o = new Layer(option);
		return o.index;
	},

	//根据index关闭弹窗
	close:function(index){
		var id = 'hclayer'+index;
		var main = document.getElementById(id);
		if(main){
			utils.addClass(main,'hclayer-anim-close');
			setTimeout(function(){
				utils.remove(main);

				// load()：移除父类添加的 is-relative 类
				if(main._parent) {
					utils.removeClass(main._parent, 'hclayer-is-relative');
					main._parent = null;
				}
				if(main.shouldRmoveLock) { //表明该弹框弹出时做了 lock 操作，因此此时需要解除 lock
					utils.removeClass(document.body, 'hclayer-is-lock');
				}

			},200);	
		}

		/*遮罩层*/
		var sId = 'hclayer-shade'+index;
		var shade = document.getElementById(sId);
		if(shade){
			setTimeout(function(){
				utils.remove(shade);
			},200);	
		}
	},
	//关闭所有弹窗
	closeAll:function(type){
		var that = this;
		var list = document.getElementsByClassName('hclayer-'+type);
		for(var i=0,l=list.length;i<l;i++){
			var index = list[i].getAttribute('hclayer-id');
			that.close(index);
		}
	}
}


var config = {
	shade:false, //遮罩层
	title:false, //标题
	//titleBackground: '#fff', //标题背景颜色
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
};

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

	var main = that._createMain();
	
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
			/* 
				添加一个标识，表示对于这个弹窗，关闭时需要执行解除 lock 操作；
				若不这样做的话，所有的 close() 关闭弹框调用都会执行解除 lock 操作，造成不需要的影响
			*/
			main.shouldRmoveLock = true;
		}
		document.body.appendChild(main);
	}

    /*
    	bug:chrome浏览器，alert,移动到确定按钮后，页面出现白色的“花版”;
    	移除掉 anim class 后正常。
    	TDO:'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
    */
    utils.one(that.main,'animationend',function(){
    	utils.removeClass(that.main,'hclayer-anim hclayer-anim-bounceIn');
    })

	//点击事件绑定
	that.listener();

	// 自动关闭
	if(that.config.time !== 0){
		setTimeout(function(){
			hclayer.close(that.index);
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
		shade:function(){
			if(!that.config.shade) return '';
			if( document.getElementsByClassName('hclayer-shade')[0] ) return; //避免重复添加 shade
			var shade = document.createElement('div');
			utils.addClass(shade,'hclayer-shade');
			var op = (typeof that.config.shade === 'number')?that.config.shade:0.3;
			utils.css(shade,{'zIndex':that.config.zIndex-1, 'opacity':op});
			shade.setAttribute('id','hclayer-shade'+that.index);
			document.body.appendChild(shade);
			return '';
		},
		title:function(){
			if(!that.config.title) {
				if(that.config.type === 'alert'){ // alert: 当没有 title 时，也应该返回一个空白的填充元素，否则不美观。
					return '<div style="height:20px"></div>';
				}else{
					return '';
				}
			}
			if(that.config.titleBackground) {
				return '<div class="hclayer-title" style="background:'+that.config.titleBackground+'">'+that.config.title+'</div>';
			}
			
			return '<div class="hclayer-title">'+that.config.title+'</div>';
		},
		close:function(){
			if(!that.config.close) return '';
			var html = '';
			if(that.config.title){
				html = '<div class="hclayer-close"></div>';
			}else{
				html = '<div class="hclayer-close hclayer-close-2"></div>';
			}
			return html;
		},
		content:function(){
			if(that.config.type === 'load') {  // 类型为 load 时
				return that.config.content;
			}
			return '<div class="hclayer-content">'+that.config.content+'</div>';
		},
		btn:function(){
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
	var main = this.main = document.createElement('div');

	//设置对应的 class
	var style = '';
	switch(that.config.type){
		case 'msg': // msg
			style = 'hclayer hclayer-dialog hclayer-msg hclayer-style-black';
			break;
		case 'alert': // alert
			style = 'hclayer hclayer-dialog hclayer-alert';
			break;
		case 'load': // load
			style = that.config.parent ? 'hclayer-load-mask' : 'hclayer-load-mask hclayer-is-full';
	}
	if(that.config.center) {
		style += ' hc-is-center ';
	}
	utils.addClass(main, style);

	// 动画
	if(that.config.type === 'load') {
		utils.addClass(main, 'hclayer-anim hclayer-anim-fadeIn');
	}else {
		utils.addClass(main, 'hclayer-anim hclayer-anim-bounceIn');	
	}

	// 关闭所有
	if(that.config.type === 'msg'){
		//hclayer.closeAll('dialog');
		hclayer.closeAll('msg');	
	}
	
	main.innerHTML = htmlContainer.join('');

	// alert 需要加一个全屏的 wrapper，用于居中
	if(that.config.type === 'alert') {
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
			hclayer.close(that.index);
			if(typeof close === 'function') that.config.close();
		})
	};

	//确定按钮的回调
	var yes = that.main.getElementsByClassName('hclayer-btn-yes')[0];
	if(yes){
		utils.addHandler(yes,'click',function(){
			if(typeof that.config.yesCallback === 'function'){
				that.config.yesCallback(that.index);
			}else{
				hclayer.close(that.index);
			}
		})
	};

	var no = that.main.getElementsByClassName('hclayer-btn-no')[0];
	if(no){
		utils.addHandler(no,'click',function(){
			if(typeof that.config.noCallback === 'function'){
				that.config.noCallback(that.index);
			}else{
				hclayer.close(that.index);
			}
		})
	}

}

/*拖拽*/
Layer.prototype.move = function(){
	var that = this,
		title = that.main.getElementsByClassName('hclayer-title')[0],
		startMove = false,
		offset;

	if(title) {
		utils.css(title,'cursor','move');

		utils.addHandler(title,'mousedown',function(e){
			e.preventDefault(); // 附赠功能：title的文字不会被选中

			//------------设置 main 为 fixed 且居中位置------------
			if( utils.css(that.main, 'position') !== 'fixed' ){
				var area = [utils.outWidth(that.main),utils.outHeight(that.main)];
				var left = (utils.width(window) - area[0])/2,
					top = (utils.height(window) - area[1])/2;

				utils.css(that.main,{position:'fixed', left:left, top:top});
			}
			//------------设置 END------------------

			offset = [
				e.clientX - parseFloat( utils.css(that.main,'left') ),
				e.clientY - parseFloat( utils.css(that.main,'top') ),
			]
			startMove = true;
		});
	}

	utils.addHandler(document,'mousemove',function(e){
		if(startMove){
			var x = e.clientX - offset[0],
				y = e.clientY - offset[1];

			// 限制移动范围，不超过可视区域
			var wh = utils.height(window)-utils.height(that.main);
			var ww = utils.width(window)-utils.width(that.main);
			x = x<0?0:x;
			y = y<0?0:y;
			x= x>ww?ww:x;
			y= y>wh?wh:y;

			utils.css(that.main, 'left', x);
			utils.css(that.main, 'top', y);
		}		
	});

	utils.addHandler(document,'mouseup',function(e){
		startMove = false;
	});
}


})()