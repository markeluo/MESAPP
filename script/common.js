/*
*通用处理JS
*/
(function(window){
  var utl={}

  /**
   *@method 字符串转整型
   *@for COM
   *@param string _obj 需要转换的字符串
   *@param string _default 默认值
   *@return INT 转换后整型
  */
  utl.StringToInt=function(_obj,_default){
    if(_obj && _obj!=""){
      try{
        return parseInt(_obj);
      }catch(e){}
    }
    if(_default){
      return _default;
    }
    return 0;
  }

  /**
   *@method 获取URL参数
   *@for COM
   *@param name 参数名称
   *@return STRING 参数值
  */
  utl.getUrlParaString=function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  /**
   *@method 筛选数组对象
   *@for COM
   *@param array 需要筛选的大数据集
   *@param condition 用于匹配的对象
   *@return array 筛选后符合条件的集合
  */
  utl.FilterObjectArray=function(array,condition){
    var retData=[];
    var pstate=true;
    for(var i=0;i<array.length;i++){
      pstate=true;
      for (var obj in condition) {
        if(array[i][obj] && condition[obj]==array[i][obj]){}else{
          pstate=false;
          break;
        }
      }
      if(pstate){retData.push(array[i]);}
    }
    return retData;
  }

  window.COM = utl;
})(window);

/**
 * 日期格式化
 */
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
  }
  return fmt;
}

/**
 * 判断是否为空
 * @param  value 判断值
 */
function isBlank(value) {
  return !value || !/\S/.test(value)
}
