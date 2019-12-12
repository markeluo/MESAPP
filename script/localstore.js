/*
本地缓存处理JS
*/
(function(window){
  var ls={}
  ls.ModuleNames=[
    {Name:"ct_chapian_dtl",Title:"裁床查片",img:"01.png"},
    {Name:"ct_peipian_dtl",Title:"配片",img:"02.png"},
    {Name:"ct_pechapian_dtl",Title:"印绣花查片",img:"03.png"},
    {Name:"ct_ctreport_dtl",Title:"裁床报告",img:"04.png"},
];
  //1.获取当前平板用户信息
  ls.getUserInfo=function(){
    var userInfo = api.getPrefs({
      sync: true,
      key: 'userInfo'
    });
    if(userInfo && userInfo!=""){
      return JSON.parse(userInfo);
    }
    return null;
  }
  //2.记录用户信息
  ls.saveUserInfo=function(_userInfo){
    api.setPrefs({
      key: 'userInfo',
      value:JSON.stringify(_userInfo)
    });
  }

  //3.缓存用户操作数据
  ls.setData=function(_moduleName,_data){
    var _key=window.User.ThisUser().EmpNo+"##"+_moduleName;
    api.setPrefs({
      key:_key,
      value:JSON.stringify(_data)
    });
  }
  //4.获取用户操作缓存数据
  ls.getData=function(_moduleName){
    var _key=window.User.ThisUser().EmpNo+"##"+_moduleName;
    var _data = api.getPrefs({
      sync: true,
      key:_key
    });
    return _data;
  }
  //5.获取用户所有操作缓存
  ls.getAllData=function(){
    var _key="";
    var _alldata=[];
    for(var i=0;i<ls.ModuleNames.length;i++){
      _key=window.User.ThisUser().EmpNo+"##"+ls.ModuleNames[i].Name;
      var _data = api.getPrefs({
        sync: true,
        key:_key
      });
      if(_data && _data!=""){
        _alldata.push({Title:ls.ModuleNames[i].Title,Data:JSON.parse(_data)});
      }
    }
    return _alldata;
  }
  //6.移除缓存数据
  ls.removeData=function(_moduleName){
    var _key=window.User.ThisUser().EmpNo+"##"+_moduleName;
    api.removePrefs({
        key:_key
    });
  }
  window.LocalStore = ls;
})(window);
