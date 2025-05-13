;define(function(require,exports,module){
    var $=require("jquery");
    //自定义loading
    return diyLoading = {
        create: function() {
            $("body").append('<div class="diyLoading fixed"></div>');
        },
        end: function(callback) {
            $(".diyLoading").remove();
            if(typeof callback == 'function') {
                callback();
            }
        }
    }
})
