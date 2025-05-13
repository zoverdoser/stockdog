;define(function(require,exports,module){
    var $=require("jquery");
	return diyAlert;
	//自定义alert
	function diyAlert(_html, callback){
		$("body").append('<div class="diyAlertBg absolute" style=height:'+$(document).height()+'px></div><div class="diyAlaertText fixed" style=top:'+($(window).height()/2-35)+'px><div class="htmlAlert">'+_html+'</div><a href="javascript:;" class="block diyAlertClose">好</a></div>');
		diyAlertClose(callback);
	}	
	function diyAlertClose(callback){
		$(".diyAlertClose").on("click",function(){
			$(".diyAlertBg, .diyAlaertText").remove();
			if(typeof callback == 'function') {
				callback();
			}
		});
	}
})
