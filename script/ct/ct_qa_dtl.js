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
       }
  });

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
      //刷新统计
      refreshTotalInfo();
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
//抽样标准
function selCYBZ(dom) {
  var UIActionSelector = api.require('UIActionSelector');
  UIActionSelector.open({
      datas:[{name:"AQL 1.0"},{name:"AQL 1.5"},{name:"AQL 2.5"},{name:"AQL 4.0"},{name:"AQL 6.5"},{name:"全检"}],
      layout: {
          row: 5,
          col: 1,
          height:50,
          size: 16,
          sizeActive: 20,
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
          $(dom).val(ret.selectedInfo[0].name);
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
  //刷新统计
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

var newRecordInfo=null;
function open_add(){
  var UIActionSelector = api.require('UIActionSelector');
  var stepnums=[];
  var steps=["首床","巡检","配套"];
  var cslist=["/","第一次","第二次","第三次","第四次","第五次","第六次","第七次","第八次","第九次","第十次"];
  steps.forEach(el=>{
    stepnums.push({"name":el,"sub":[]});
    cslist.forEach(el2=>{
      stepnums[stepnums.length-1].sub.push({"name":el2});
    })
  });

  UIActionSelector.open({
      datas:stepnums,
      layout: {
          row: 5,
          col: 2,
          height:50,
          size: 16,
          sizeActive: 20,
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
        newRecordInfo={
          Step:ret.selectedInfo[0].name,
          SortName:ret.selectedInfo[1].name,
        }
        addRecords(newRecordInfo);
      }
  });
}
//新增新检验报告记录
function addRecords(_recordInfo){
  panel_switch(true);
}

//显示面板切换
function panel_switch(_isAdd){
  $("#relist").hide();
  $("#newAddPanel").hide();
  if(_isAdd){
    $("#newAddPanel").show();
  }else{
    $("#relist").show();
  }
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

function okNumcalc(_group,_type){
  var knobid="okNum_peitao";
  var okTotalid="totalokNum_peitao";
  if(_group && _group=="尺寸"){
    knobid="okNum_chicun";
    okTotalid="totalokNum_chicun";
  }
  var knobNum=$("#"+knobid).val();
  if(knobNum && knobNum!=""){}else{knobNum=0;}
  knobNum=parseInt(knobNum);

  var okTotalNum=$("#"+okTotalid).html();
  if(okTotalNum && okTotalNum!=""){}else{okTotalNum=0;}
  okTotalNum=parseInt(okTotalNum);
  if(_type && _type=='1'){
    okTotalNum+=knobNum;
  }else{
    okTotalNum-=knobNum;
  }
  if(okTotalNum<0){okTotalNum=0;}
  $("#"+okTotalid).html(okTotalNum);
  refreshTotalInfo();
}
function cleardefects(_group){
  var totalNumid="totalNum_peitao";
  var okTotalid="totalokNum_peitao";
  var defectsTotalid="totaldefectNum_peitao";
  if(_group && _group=="尺寸"){
    totalNumid="totalNum_chicun";
    okTotalid="totalokNum_chicun";
    defectsTotalid="totaldefectNum_chicun";
  }
  //清空疵点列表
  $(".dict_panel[grouptype='"+_group+"']").find(".group_items>a[item-check='1']").each(function(i,item){
    var dfdom=$(item);
    dfdom.find("span.jian1").remove();
    dfdom.find("i.fa").removeClass("fa-check");
    dfdom.removeClass("red").addClass("green");
    dfdom.find("i.denum").html("");
    dfdom.attr("item-check",0);
  });
  $("#"+okTotalid).html(0);
  $("#"+totalNumid).html(0);
  $("#"+defectsTotalid).html(0);
}

function refreshTotalInfo() {
  var groups=["peitao","chicun"];
  var defectGroupType="配套";
  groups.forEach(el=>{
    var oktotal=parseInt($("#totalokNum_"+el).html());
    var deftotal=0;
    if(el=="chicun"){
      defectGroupType="尺寸";
    }
    deftotal=getGroupDefectNum(defectGroupType);
    $("#totaldefectNum_"+el).html(deftotal);
    $("#totalNum_"+el).html((oktotal+deftotal));
  });
}

function getGroupDefectNum(_grouptype){
  var defectsNum=0;
  $(".dict_panel[grouptype='"+_grouptype+"']").find(".group_items>a[item-check='1']").each(function(i,item){
    defectsNum+=parseInt($(item).find("i.denum").html());
  });
  return defectsNum;
}

function InitData() {
    initDefects();
}

function initDefects(){
  if(sys_defects && sys_defects.length>0){

    var groupdata=defectsGroupFilter("裁床检验报告");
    if(groupdata && groupdata.length>0){
      var groupName="";
      for(var i=0;i<groupdata.length;i++){
        groupName=groupdata[i].group;
        var defecthtml='';
        if(groupName=="配套"){
          defecthtml='<div class="clearfix dict_group"><div class="group_items">';
          for(var j=0;j<groupdata[i].items.length;j++){
            defecthtml+='<a href="#" class="btn green" dfno="'+groupdata[i].items[j].DefectNo+'"><i class="fa"></i>'+groupdata[i].items[j].DefectText+'<i class="denum"></i></a>';
          }
          defecthtml+='</div></div>';
          $("#peitao_defects").html(defecthtml);
        }
        if(groupName=="尺寸"){
          defecthtml='<div class="clearfix dict_group"><div class="group_items">';
          for(var j=0;j<groupdata[i].items.length;j++){
            defecthtml+='<a href="#" class="btn green" dfno="'+groupdata[i].items[j].DefectNo+'"><i class="fa"></i>'+groupdata[i].items[j].DefectText+'<i class="denum"></i></a>';
          }
          defecthtml+='</div></div>';
          $("#chicun_defects").html(defecthtml);
        }
      }
    }
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
