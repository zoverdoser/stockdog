//截取字符
var StringUtil = StringUtil || {};
StringUtil.cutstr = function(str, len, ellipsis = "...") {
   var temp;
   var icount = 0;
   var patrn = /[^\x00-\xff]/;
   var strre = "";
   for (var i = 0; i < str.length; i++) {
      if (icount < len - 1) {
         temp = str.substr(i, 1);
         if (patrn.exec(temp) == null) {
            icount = icount + 1;
         } else {
            icount = icount + 2;
         }
         strre += temp;
      } else {
         break;
      }
   }
   return strre + ellipsis;
}
export default StringUtil;