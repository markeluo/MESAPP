var uowrkId=null;
apiready = function(){
    //$api.fixStatusBar( $api.dom('header') );
    uowrkId=api.pageParam.uworkId;
    $api.dom('.title').innerHTML = api.pageParam.title;
    alert(JSON.stringify(api.pageParam.Keys));
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
      $(".dict_group").find(".group_items>a[item-check='1']").find("i.fa").removeClass("fa-check");
      if(checked && checked==="1"){
        var defnum=$(this).find("i.denum").html();
        if(defnum && defnum!=""){
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
      $(this).find("i.fa").addClass("fa-check");
  });
}
function saveDefects(){
  var checkdefs=[];
  $(".dict_group").find(".group_items>a[item-check='1']").each(function(i,item){
    checkdefs.push({dfNo:$(item).attr("dfno"),dfNum:parseInt($(item).find("i.denum").html())})
  });

}
function clearCheckDefectsNum(){
    var item=$(".dict_group").find(".group_items>a[item-check='1']").find("i.fa.fa-check").parent();
    if(item && item.find("i.denum").length>0){
      $(item).attr("item-check","0").removeClass("red").addClass("green")
      item.find("i.fa").removeClass("fa-check");
      item.find("i.denum").html("");
    }
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
        'width':'80%',
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
