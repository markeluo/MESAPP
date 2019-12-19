var pagekey=null;
var pageInfo=null;
var moduleName="ct_peipian_dtl";
apiready = function(){
    //$api.fixStatusBar( $api.dom('header') );
    $api.dom('.title').innerHTML = api.pageParam.title;
    HideParentProgress(api.pageParam.pageName);
    pageInfo=api.pageParam.Keys;
    //StyleNo,BUY,ColorCode,CPO,LineCode,LineName
    pagekey=api.pageParam.Keys.CPO+"##"+api.pageParam.Keys.LineCode+"##"+api.pageParam.Keys.ColorCode
    Metronic.init(); // init metronic core components
    InitData();
    InitEvents();
};
$(document.body).ready(function(){
  if(!apiLoaded){
    Metronic.init(); // init metronic core components
    InitData();
    InitEvents();
  }
});

function InitEvents(){
  $(".dict_panel div.group_items>a").unbind().bind("click",function(){
      var checked=$(this).attr("item-check");
      var actived=$(this).find("i.fa.fa-check").length>0?true:false;
      var checkitems=$(".dict_group").find(".group_items>a[item-check='1']");
      checkitems.find("span.jian1").remove();
      checkitems.find("i.fa").removeClass("fa-check");
      if(checked && checked==="1"){
        var defnum=$(this).find("i.denum").html();
        if(defnum && defnum!="" && actived){
          defnum=parseInt(defnum)+1;
          $(this).find("i.denum").html(defnum);
        }
      }else{
        // var dictitems=$(".dict_group").find(".group_items>a").attr("item-check","0").removeClass("red").addClass("green");
        // dictitems.find("i.fa").removeClass("fa-check").addClass("fa-circle-o")
        // dictitems.find("i.denum").html("");
        $(this).attr("item-check","1").removeClass("green").addClass("red");
        $(this).find("i.denum").html("1");
      }
      $(this).append('<span class="jian1" onclick="DefectMinus(this)"><i class="fa fa-minus"></i></span>').find("i.fa").addClass("fa-check");

      refreshTotalInfo();
  });
}

function DefectMinus(e){
  var defectdom=$(e).parent();
  var defnum=defectdom.find("i.denum").html();
  if(defnum && defnum!=""){
    defnum=parseInt(defnum)-1;
    if(defnum<=0){
      defnum=0
      defectdom.find("span.jian1").remove();
      defectdom.find("i.fa").removeClass("fa-check");
      defectdom.removeClass("red").addClass("green");
      defectdom.find("i.denum").html("");
      defectdom.attr("item-check",0);
    }else{
        defectdom.find("i.denum").html(defnum);
    }
  }

  refreshTotalInfo();

  if (e && e.stopPropagation ){
    e.stopPropagation();
  }
  else{
    window.event.cancelBubble = true;
  }
}

function saveDefects(){
  var checkdefs=[];
  $(".dict_group").find(".group_items>a[item-check='1']").each(function(i,item){
    checkdefs.push({dfNo:$(item).attr("dfno"),dfNum:parseInt($(item).find("i.denum").html())})
  });
  var tmpdata={
    key:pagekey,
    cktime:new Date().Format("yyyy-MM-dd hh:mm:ss"),
    syn:false,
    PositionNo:_position.no,
    remark:$("#txtremark").val(),
    defects:checkdefs
  }
  $.extend(tmpdata,pageInfo);

  checkData(tmpdata,function(_state){
    if(_state){
      AddCache(tmpdata,function(_result){
        if(_result.code==200){
          clearCheckDefectsNum();
        }
        api.toast({msg:_result.msg,duration:parseInt(_result.code)*10,location:'middle'});
      });
      //缓存数据同步上传
      SysnCache();
    }
  })
}

/**
 * 检查保存数据
 * @param {Object} _data 数据
 * @param {function} _callfun 回调
 */
function checkData(_data,_callfun){
  if(isBlank(_data.PositionNo)){
    api.alert({title:'错误',msg:'没有设置配片幅位!'});
    _callfun(false);
    return;
  }else{
    if(_data.defects && _data.defects.length>0){
      _callfun(true);
    }else{
      api.alert({title:'错误',msg:'没有选择配片问题!'});
      _callfun(false);
    }
  }
}

/**
 * 清空疵点
 */
function clearCheckDefectsNum(){
    $(".dict_group").find(".group_items>a[item-check='1']").each(function(i,item){
      $(item).attr("item-check","0").removeClass("red").addClass("green")
      $(item).find("i.fa").removeClass("fa-check");
      $(item).find("span.jian1").remove();
      $(item).find("i.denum").html("");
    });
    $("#defectNum").html("0");
    refreshTotalInfo();
}

var _position=null;
function changeFW(){
  var UIActionSelector = api.require('UIActionSelector');
  var positions=[];
  var tmps=COM.FilterObjectArray(sys_positions,{GroupName:"配片",ModuleName:"配片"})
  tmps.forEach(item=>{
    positions.push({no:item.PositionNo,name:item.PositionName});
  })
  UIActionSelector.open({
      datas:positions,
      layout: {
          row: 5,
          col: 1,
          height:50,
          size: 16,
          sizeActive: 18,
          rowSpacing: 5,
          colSpacing: 10,
          maskBg: 'rgba(0,0,0,0.2)',
          bg: '#fff',
          color: '#888',
          colorActive: '#26a69a',
          colorSelected: '#26a69a'
      },
      animation: true,
      cancel: {
          text: '取消',
          size: 16,
          w: 90,
          h: 35,
          bg: '#fff',
          bgActive: '#ccc',
          color: '#888',
          colorActive: '#fff'
      },
      ok: {
          text: '确定',
          size: 16,
          w: 90,
          h: 35,
          bg: '#26a69a',
          bgActive:'#1BBC9B',
          color: '#fff',
          colorActive: '#888'
      },
      title: {
          text: '请选择',
          size: 16,
          h: 44,
          bg: '#eee',
          color: '#888'
      },
      fixedOn: api.frameName
  }, function(ret, err) {
      if (ret && ret.eventType=="ok" && ret.selectedInfo && ret.selectedInfo.length>0) {
          _position=ret.selectedInfo[0];
          positionChangeRefresh();
      }
  });
}

function positionChangeRefresh(){
  $("#positionName").html(_position.name);
  clearCheckDefectsNum();
}

function refreshTotalInfo() {
  var gTotals={
    fabNum:0,
    cutNum:0,
    smNum:0
  };
  $(".dict_group").find(".group_items>a[item-check='1']").each(function(i,item){
      var groupName=$(item).parent().prev().html();
      if(groupName=="面料问题"){gTotals.fabNum+=parseInt($(item).find("i.denum").html());}
      if(groupName=="裁剪问题"){gTotals.cutNum+=parseInt($(item).find("i.denum").html());}
      if(groupName=="车缝问题"){gTotals.smNum+=parseInt($(item).find("i.denum").html());}
  });
  $("#fabNum").html(gTotals.fabNum);
  $("#cutNum").html(gTotals.cutNum);
  $("#smNum").html(gTotals.smNum);
}

function InitData() {
    //幅位初始化
    _position={no:sys_positions[0].PositionNo,name:sys_positions[0].PositionName};
    initDefects();
}

function initDefects(){
  if(sys_defects && sys_defects.length>0){
    var defecthtml="";
    var groupdata=defectsGroupFilter("配片");
    if(groupdata && groupdata.length>0){
      for(var i=0;i<groupdata.length;i++){
        defecthtml+='<div class="clearfix dict_group">';
        defecthtml+='<h4>'+groupdata[i].group+'</h4>';
        defecthtml+='<div class="group_items">';
        for(var j=0;j<groupdata[i].items.length;j++){
          defecthtml+='<a href="#" class="btn green" dfno="'+groupdata[i].items[j].DefectNo+'"><i class="fa"></i>'+groupdata[i].items[j].DefectText+'<i class="denum"></i></a>';
        }
        defecthtml+='</div>';
        defecthtml+='</div>';
      }
    }
    defecthtml+='<div class="clearfix"></div>';
    $(".dict_panel").html(defecthtml);
  }
}

function defectsGroupFilter(module){
  var groupdata=[];//{group:"",items:[]}
  var groupkeys=[];
  var _tempi=-1;
  for(var i=0;i<sys_defects.length;i++){
    if(sys_defects[i].ModuleName==module){
      _tempi=groupkeys.indexOf(sys_defects[i].GroupName);
      if(_tempi>-1){
        groupdata[_tempi].items.push(sys_defects[i]);
      }else{
        groupdata.push({group:sys_defects[i].GroupName,items:[sys_defects[i]]});
        groupkeys.push(sys_defects[i].GroupName);
      }
    }
  }
  return groupdata;
}

function openReport(){
  api.openWin({
      name:"ct_peipian_report",
      url: './ct_peipian_report.html',
      pageParam: {
        keys:pageInfo
      },
     animation:{
        type:"fade",                //动画类型（详见动画类型常量）
        subType:"from_right",       //动画子类型（详见动画子类型常量）
        duration:200                //动画过渡时间，默认300毫秒
    }
  });
}

/*缓存数据处理 start---------------*/
var CacheDatas=null;
function GetCache(){
  if(CacheDatas==null){
    CacheDatas=LocalStore.getData(moduleName);
  }
  if(isBlank(CacheDatas)){
    CacheDatas=[];
  }
  return CacheDatas;
}

//添加缓存
function AddCache(data,callfun){
  try{
    GetCache();
    CacheDatas.push({key:data.key,data:data});
    LocalStore.setData(moduleName,CacheDatas);
    SysnCache();
    callfun({code:200,msg:"保存成功!",data:null});
  }catch(e){
    callfun({code:500,msg:"保存失败:"+e,data:null});
  }
}

//同步缓存数据到服务器--后台处理，不影响界面操作
function SysnCache(){
  GetCache();
  var NoSynItems=[];
  CacheDatas.forEach(element => {
      if(!element.data.syn){NoSynItems.push(element);}
  });
  if(NoSynItems!=null && NoSynItems.length>0){
      var thisindex=0;
      NoSynItems.forEach(element => {
          dataUpload(element,function(_result){
              if(_result.code==200){
                  element.data.syn=true;
              }
              thisindex++;
              if(thisindex>=NoSynItems.length){
                  LocalStore.setData(moduleName,CacheDatas);
                  LocalStore.removeStaleData(moduleName);
              }
          });
      });
  }
}

function dataUpload(data,callfun){
  //请求服务器进行数据保存
  callfun({code:200,data:data,msg:"上传成功"});
}
/*缓存数据处理 end*/
