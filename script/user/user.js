/*
用户管理JS
*/
(function(window){
  var u={}
  u.userInfo=null;
  //1.获取当前用户信息
  u.ThisUser=function(){
    if(u.userInfo && u.userInfo!=""){}else{
      u.userInfo=LocalStore.getUserInfo();
    }
    return u.userInfo;
  }
  //2.登录
  u.Login=function(username,pwd,callfun){
    var result={code:500,data:null,msg:"登录失败!"};
    //ajax 请求后台处理登录验证

    u.userInfo={EmpNo:username,EmpName:"罗万里",EmpDept:"品管部",EmpGroup:"FQC",DutyName:"查片员"}
    LocalStore.saveUserInfo(u.userInfo);
    result.code=200;
    result.msg="登录成功";
    callfun(result);
  }
  window.User= u;
})(window);
