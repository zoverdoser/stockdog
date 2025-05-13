var tracking={}
tracking.trackEvent=function(text = '', event = 'click') {
	if(window['_hmt']){
		_hmt.push(['_trackEvent', text, event, text]);
	}
    
}

tracking.trackPageview=function(value) {
	if(window['_hmt']){
    	_hmt.push(['_trackPageview', value]);
    }
}

$(document).on('click', "[data-tracking='baidu']", function(e){
    tracking.trackEvent($(this).data('text'),$(this).data('event'));
}).on('touchstart', "[data-tracking-touch='baidu']", function(e){
    tracking.trackEvent($(this).data('text'),$(this).data('event'));
});

function _track(e) {
    let [text, event] = $(e.target).data('baidu').split('|', 2);
    tracking.trackEvent(text, event);
}

export default tracking;