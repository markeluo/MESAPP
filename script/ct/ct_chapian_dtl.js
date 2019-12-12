var uowrkId=null;
apiready = function(){
    //$api.fixStatusBar( $api.dom('header') );
    uowrkId=api.pageParam.uworkId;
    $api.dom('.title').innerHTML = api.pageParam.title;

    Metronic.init(); // init metronic core components
    InitData();
    InitEvents();
    initDetail();
};
if(!apiLoaded){
  Metronic.init(); // init metronic core components
  InitData();
  InitEvents();
  initDetail();
}
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
        $(this).find("i.denum").html("0");
      }
      $(this).find("i.fa").addClass("fa-check");
  });
}
function saveDefects(){

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
}
function initDetail(){
  getDetailData(null,function(result){
    if(result.state==200){

    }
  });
}
function getDetailData(uworkId,callFun){
  var result={state:200,data:[]};
  return result;
}
