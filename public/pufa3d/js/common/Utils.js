var utils={};
var windowHeight = document.documentElement.clientHeight;
window.onresize=function(){
    windowHeight = document.documentElement.clientHeight;
}

function scrollHandler(elm,offsetElm,h,offsetH,cb){
    var top=$(offsetElm).offset().top;
    if(top+h+offsetH<=windowHeight-20) {
        cb(true);
    }else{
        cb(false);
    }
}
utils.getSmallAvatar = function(url) {
    if(url) {
        if(url.slice(-2) == '/0') {
            return url.slice(0, -2) + '/132';
        } else {
            return url;
        }
    } else {
        return 'http://r.intonead.com/front-dev/html/images/avatar.jpg';
    }
};
//滚动，监测底部元素，检测元素高，偏移量
utils.addScrollListener=function(elm,offsetElm,h,offsetH,cb){
    utils.removeScrollListener(elm);
    $(elm).on('scroll',()=>scrollHandler(elm,offsetElm,h,offsetH,cb))
}
utils.removeScrollListener=function(elm){
    $(elm).off('scroll');
}
utils.windowHeight=windowHeight;

/**
 * 深度拷贝对象
 */
utils.copyObject=function(obj){
    return JSON.parse(JSON.stringify(obj));
}
/**
 * 过滤html代码
 */
utils.delHtmlTag=function(str=""){
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    //str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return str;
}
export default utils;