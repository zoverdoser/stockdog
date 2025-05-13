var Utils = {
	start: function (){
		$('.start-page').fadeIn('fast', function(){
			$('.start-page').addClass('animate-1');
			$('.start-page').on('webkitAnimationEnd animationend', function(){
				$('.start-page').removeClass('animate-1').addClass('animate-2');
			});
		});
	},
	showFailPop: function (){
		this._show('.pop-fail');
	},
	showTopList: function(){
		this._show('.pop-topList');
	},
	showSuccessPop: function(){
		this._show('.pop-success');
	},
	showShuomingPop: function(){
		this._show('.pop-shuoming');
	},
	_show: function(selector){
		$(selector).fadeIn('fast', function(){
			$(this).addClass('animate');
		});
	}
}

// Utils.start();
Utils.showShuomingPop();

$('#mobile').on('keyup', function(){
	var val = $('#mobile').val();
	if(val.length > 11){
		$('#mobile').val(val.substr(0,11)).addClass('warn');
	}
});
