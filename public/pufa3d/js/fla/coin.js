var _self;
var libs=this;
function construct(display) {
	_self = display;

	_self.btn.on("click", function() {
		$(document).trigger("CLOSE_INSIDEPOP");
	});
}


module.exports.construct=construct;