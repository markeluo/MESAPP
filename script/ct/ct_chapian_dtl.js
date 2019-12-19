var pagekey=null;
apiready = function(){
    //$api.fixStatusBar( $api.dom('header') );
    $api.dom('.title').innerHTML = api.pageParam.title;
    HideParentProgress(api.pageParam.pageName);
    pagekey=api.pageParam.Keys.LBNo+"##"+api.pageParam.Keys.CPO+"##"+api.pageParam.Keys.BedNo
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
  });
  //点击触发事件，监听按钮状态
  $('#replacepars').on('switchChange.bootstrapSwitch',function(event,state){
     //获取状态
     if(state){
       $("#replacepars").attr("ckstate","1");
     }else{
       $('#replacepars').attr("ckstate","0");
     }
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

  if (e && e.stopPropagation ){
    e.stopPropagation();
  }
  else{
    window.event.cancelBubble = true;
  }
}

function calcTotal(){
  var jsnum=COM.StringToInt($("#txtJS").val(),0);
  var psnum=COM.StringToInt($("#txtPS").val(),0);
  $("#txtTotalPS").val(jsnum*psnum);
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
    okNum:COM.StringToInt($("#okNum").html(),0),
    jsnum:COM.StringToInt($("#txtJS").val(),null),
    psnum:COM.StringToInt($("#txtPS").val(),null),
    ckstate:$('#replacepars').attr("ckstate")=="1"?true:false,
    remark:$("#txtremark").val(),
    defects:checkdefs
  }
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
  if(_data.okNum<=0){
    api.alert({title:'错误',msg:'没有设置合格数!'});
    _callfun(false);
    return;
  }else{
    if(_data.defects && _data.defects.length>0){
      _callfun(true);
    }else{
      api.confirm({
          title: '确认提示',
          msg: '当前查片无任何疵品，您确定提交？',
          buttons: ['确定', '取消']
      }, function(ret, err) {
          if(ret.buttonIndex==0){
            _callfun(false);
            return;
          }else{
            _callfun(true);
          }
      });
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

function okNumcalc(_type){
  var knobNum=$(".knob").val();
  if(knobNum && knobNum!=""){}else{
    knobNum=0;
  }
  knobNum=parseInt(knobNum);
  if(_type && _type=='1'){
    knobNum++;
  }else{
    knobNum--;
  }
  $(".knob").val(knobNum);
  refreshTotalInfo();
}

function refreshTotalInfo() {
  var okNum=parseInt($(".knob").val());
  var defectNum=$("#defectNum").html();
  if(defectNum && defectNum!=""){}else{
    defectNum=0;
  }
  defectNum=parseInt(defectNum);
  $("#okNum").html(okNum);
  $("#totalNum").html((okNum+defectNum));
}

function InitData() {
    if (!jQuery().knob || Metronic.isIE8()) {
        return;
    }
    // general knob
    $(".knob").knob({
        'dynamicDraw': true,
        'thickness': 0.2,
        'tickColorizeValues': true,
        'skin': 'tron',
        'width':'140%',
         'release':function(e){
           refreshTotalInfo();
         }
    });
    initDefects();
}

function initDefects(){
  if(sys_defects && sys_defects.length>0){
    var defecthtml="";
    var groupdata=defectsGroupFilter("裁床查片");
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
      name:"ct_chapian_report",
      url: './ct_chapian_report.html',
      pageParam: {},
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
    CacheDatas=LocalStore.getData("ct_chapian_dtl");
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
    var _ThisCache=null;
    var ccindex=-1;
    if(CacheDatas!=null && CacheDatas.length>0){
      for(var i=0;i<CacheDatas.lenth;i++){
        if(CacheDatas[i].key==data.key){
          ccindex=i;
          break;
        }
      }
    }
    if(ccindex>-1){
      _ThisCache=CacheDatas[ccindex].data;
      _ThisCache.okNum=data.okNum;
      _ThisCache.jsnum=data.jsnum;
      _ThisCache.psnum=data.psnum;
      _ThisCache.ckstate=data.ckstate;
      _ThisCache.remark=data.remark;
      _ThisCache.defects=_ThisCache.data.concat(data.defects);
      CacheDatas[ccindex].data=_ThisCache;
    }else{
      CacheDatas.push({key:data.key,data:data});
    }
    LocalStore.setData("ct_chapian_dtl",CacheDatas);
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
                  LocalStore.setData("ct_chapian_dtl",CacheDatas);
                  LocalStore.removeStaleData("ct_chapian_dtl");
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
