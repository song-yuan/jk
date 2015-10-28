// 
//  common.js
//  skywalk-er.com
//  
//  Created by silva on 2015-02-12.
//  Copyright 2015 silva. All rights reserved.
// 
// var URL = 'http://wx.localhost.com';
var URL = 'http://'+window.location.host;

var ua = navigator.userAgent.toLowerCase();
var sys = ua.match(/html5plus/);

if (sys != 'html5plus') {
	mui.openWindow = function openWindow(param,target,options) {
		if(param.target == '_blank'){
			window.open(param.url);
		}else{
			window.location.href = param.url;
		}
	}
}

mui.ready(function() {
	// 失去焦点补救
	mui('.mui-inner-wrap').on('tap','input,textarea',function(){
		this.focus();
	});

	mui('#pullrefresh').scroll();
	mui('#slider').slider({
		interval: 3000
	});
	//侧滑容器父节点
	var offCanvasWrapper = mui('#offCanvasWrapper');
	//主界面容器
	var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
	//菜单容器
	var offCanvasSide = document.getElementById("offCanvasSide");
	// var mask = mui.createMask();//callback为用户点击蒙版时自动执行的回调；
	// mask.show();//显示遮罩
	// mask.close();//关闭遮罩
	document.getElementById('offCanvasShow').addEventListener('tap', function() {
		offCanvasWrapper.offCanvas('show');
		Zepto('.mui-backdrop').show();
	});

	Zepto('.mui-backdrop').on('tap',function(){
		Zepto('.mui-backdrop').hide();
		offCanvasWrapper.offCanvas('close');
	})

	mui('.mui-table-view,.user-info,.tap-a').on('tap', 'a', function(e) {
		mui.openWindow({
			url: this.getAttribute('href'),
			id: 'info'
		});
	});
	mui('.mui-bar').on('tap','a',function(e){
		mui.openWindow({
			url: this.getAttribute('href'),
			id: 'info'
		});
	})
	/*弹出订单*/
	mui('.mui-content-padded').on('tap','#post-my-order',function(){
		mui('.mui-popover').popover('toggle');
	});
	mui('.mui-content-padded').on('tap','#order',function(){
		mui.openWindow({
			url: this.getAttribute('data-href'),
			id: 'order'
		});
	});
	/*关闭弹出层*/
	mui('#popover').on('tap','.close-popover',function(){
		mui('.mui-popover').popover('toggle');
	});
	/*提交订单*/
	mui('#popover').on('tap','.btn-submit-order',function(){
		var name = Zepto('input[name="name"]').val(),
			phone = Zepto('input[name="phone"]').val(),
			person = Zepto('input[name="person"]').val(),
			child = Zepto('input[name="child"]').val(),
			message = Zepto('textarea[name="message"]').val(),
			product_id = Zepto('input[name="product_id"]').val();

		/*空判断*/
		if(name.length==0){
			alert('请先输入您的尊称.');
			return false;
		}
		if(person.length==0){
			alert('您大约有多少人参加?');
			return false;
		}
		/*检查手机号码*/
		if(phone.length==0)
		{
		   alert('请输入手机号码！');
		   phone.focus();
		   return false;
		}    
		if(phone.length!=11)
		{
		    alert('请输入有效的手机号码！');
		    phone.focus();
		    return false;
		}
		
		// var myreg = /^(((13[0-9]{1})|159|153)+\d{8})$/;
		var myreg = /1[3458]{1}\d{9}$/;
		if(!myreg.test(phone))
		{
		    alert('请输入有效的手机号码！');
		    phone.focus();
		    return false;
		}
			
		mui.ajax({
			type:'POST',
			url:URL+'/order/add_order',
			data:'product_id='+product_id+'&name='+name+'&phone='+phone+'&person='+person+'&child='+child+'&message='+message,
			success:function(json){
				alert(json.data);
				mui('.mui-popover').popover('toggle');
//				if(json.code == '200'){
//					mui('.mui-popover').popover('toggle');
//				}else{
//					mui('.mui-popover').popover('toggle');
//				}
			},
			error:function(json){
				alert(json.data);
				mui('.mui-popover').popover('toggle');
			}
		});
	});



	mui('a').on('tap','.reply',function(){
		mui('.reply-content')[0].style.display = 'block';
		document.getElementById('content').focus();
	})

	// mui('p').on('tap','.reply',tap_reply);
	// var tap_reply = function(){
	// 	mui('.reply-content')[0].style.display = 'block';
	// 	document.getElementById('content').focus();

	// 	var _num_flow = this.getAttribute('data-value');
	// 	if(_num_flow > 0){
	// 		Zepto('#reply_id').val(_num_flow);
	// 		Zepto('.reply-content-tit').html('回复'+_num_flow+'楼');
	// 	}else{
	// 		Zepto('.reply-content-tit').html('回复');

	// 	}
	// };

	mui('p').on('tap','.reply-close',function(){
		mui('.reply-content')[0].style.display = 'none';
		Zepto('.reply-content-tit').html('回复');
		Zepto('#content').val('')
	})
	mui('p').on('tap','.reply-submit',function(){
		var _uid = Zepto('#uid').val(),
			_community_id = Zepto('#community_id').val(),
			_cid = Zepto('#cid').val(),
			_reply_id = Zepto('#reply_id').val(),
			_unsign = Zepto('#unsign').attr("checked"); //Zepto('#unsign').val(),
			_content = Zepto('#content').val(),
			_username = Zepto('#username').val();

		if(_content == undefined || _content == ''){
			alert('说点什么再提交吧^-^');
			return false;
		}
		mui.ajax({
			type:'POST',
			url:URL+'/community/post_reply',
			data:'user_id='+_uid+'&username='+_username+'&cid='+_cid+'&content='+_content+'&community_id='+_community_id+'&reply_id='+_reply_id+'&unsign='+_unsign,
			success:function(json){
				// alert(json.data);
				// mui('.mui-popover').popover('toggle');
				if(json.code == '200'){
					alert(json.data);
					mui('.mui-popover').popover('toggle');
				}else{
					alert(json.data);
					mui('.mui-popover').popover('toggle');
				}
			},
			error:function(json){
				alert(json.data);
			}
		});

		mui('.reply-content')[0].style.display = 'none';
		Zepto('.reply-content-tit').html('回复');
	});
	mui('.font-face').on('tap','span',function(){
		Zepto('#content').val(Zepto('#content').val()+Zepto(this).html());
		console.log(Zepto('#content').val());
	});

	mui('.mui-content-padded').on('tap','h5.show-content',function(){
		var cdt = Zepto('.content-detail');
		cdt.find('img').attr({
			width: '',
			height: ''
		}).css({
			width: '',
			height: ''
		});;
		if(cdt.height() != 200){
			Zepto('.content-detail').css({
				height: '200px'
			});
			Zepto('h5.show-content').html('展开线路详细介绍');
		}else{
			Zepto('.content-detail').css({
				height: 'auto'
			});
			Zepto('h5.show-content').html('收起线路详细介绍');
		}
		
	});

	// 微信支付
	Zepto('.weixin-pay').on('tap', function() {
		var trust = Zepto('input[name="trust"]').val();
		var phone = Zepto('input[name="phone2"]').val();
		var name = Zepto('input[name="nickname2"]').val();

		var person = Zepto('input[name="person2"]').val(),
			child = Zepto('input[name="child2"]').val(),
			message = Zepto('textarea[name="message2"]').val(),
			product_id = Zepto('input[name="product_id"]').val();

		if(trust == 0){
			/*检查手机号码*/
			if(phone.length==0)
			{
			   alert('请输入手机号码！');
			   phone.focus();
			   return false;
			}
			if(phone.length!=11)
			{
			    alert('请输入有效的手机号码！');
			    phone.focus();
			    return false;
			}
			/*空判断*/
			if(name.length==0){
				alert('请输入昵称');
				return false;
			}
			if(person.length==0){
				alert('您大约有多少人参加?');
				return false;
			}
			
			
			// var myreg = /^(((13[0-9]{1})|159|153)+\d{8})$/;
			var myreg = /1[3458]{1}\d{9}$/;
			if(!myreg.test(phone))
			{
			    alert('请输入有效的手机号码！');
			    phone.focus();
			    return false;
			}
			
		}

		mui.ajax({
			type:'POST',
			url:URL+'/order/add_order',
			data:'product_id='+product_id+'&name='+name+'&phone='+phone+'&person='+person+'&child='+child+'&message='+message+'&trust='+trust,
			success:function(json){
				alert(json.data);
				// mui('.mui-popover').popover('toggle');
				if(json.code == '200'){
					//mui('.mui-popover').popover('toggle');
					window.location.href="http://m.skywalk-er.com/payment/weixin/order_id/"+json.order_id;
				}else{
					mui('.mui-popover').popover('toggle');
				}
			},
			error:function(json){
				alert(json.data);
				mui('.mui-popover').popover('toggle');
			}
		});

	});

	/* 退出登录 */
	mui('.mui-content-padded').on('tap','.btn-logout',function(){
		window.location.href="/member/public/logout";
	});

	

});