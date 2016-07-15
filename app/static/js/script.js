$(document).ready(function(){
//比较日期大小
function dateCompare(startdate,enddate)
{
var arr=startdate.split("-");
var starttime=new Date(arr[0],arr[1],arr[2]);
var starttimes=starttime.getTime();

var arrs=enddate.split("-");
var lktime=new Date(arrs[0],arrs[1],arrs[2]);
var lktimes=lktime.getTime();

if(starttimes>=lktimes)
{
return false;
}
else
return true;

}

//还原输入框
function ClearInput(id,form_id)
{
    $('#'+id).val("");
    $(this).popover('destroy');
    $('#'+form_id).attr("class","form-group");
}
//检查是否为空
function CheckIsEmpty(id,form_id,words)
{
  var Length=$('#'+id).val().length;
  if(Length==0 )
  {
    $('#'+form_id).attr("class","form-group has-error");
    $('#'+id).attr("data-content",words);
    $('#'+id).popover({placement:'bottom'});
    $('#'+id).popover({trigger:'manual'});
    $('#'+id).popover('show');
    return true;
  }
  else
  {
    $('#'+id).popover('hide');
    $('#'+form_id).attr("class","form-group");
    return false;
  }
};
  $("input").on('click',function(e){
  $(this).popover('hide');
  $(this).popover('destroy');
  $(this).parent().attr("class","form-group");
  })
//登录submit
  $("#login_btn").click(function(e){
  e.preventDefault();
  var remember='off';
  if($('#remember').is(':checked')){
  remember='on'}
    $.post('/users/login/',
    {
    UserName:$('#LoginUserName').val(),
    Password:$('#LoginPassword').val(),
    Remember:remember,
    LoginRadio:$('input[name="LoginRadios"]:checked').val()
    },
    function(data,status){
      parent.location.href=data;
    });
  });
  //登录用户名检查
  $("#LoginUserName").blur(function(e){
  e.preventDefault();
  var NameLength=$('#LoginUserName').val().length;
  if(NameLength<5 |NameLength>20)
  {
    $("#LoginUserName").attr("data-content",'用户名必须为6到20个字符');
    $("#LoginUserName").popover({placement:'bottom'});
    $("#LoginUserName").popover('show');
    $("#NameForm").attr("class","form-group has-error");
  }
  else
  {
    $("#LoginUserName").popover('hide');
    $("#NameForm").attr("class","form-group");
  }
  })
  //登录密码检查
  $("#LoginPassword").blur(function(e){
  e.preventDefault();
  var NameLength=$('#LoginPassword').val().length;
  if(NameLength==0 )
  {
    $("#PassForm").attr("class","form-group has-error");
    $("#PassForm").attr("data-content",'请填写密码');
    $("#PassForm").popover({placement:'bottom'});
    $("#PassForm").popover('show');
  }
  else
  {
    $("#PassForm").popover('destroy');
    $("#PassForm").attr("class","form-group");
  }
  })
  //加载评审领域选择
  $("#SeleteReviewArea").click(function(e){
    var body=$("#SeleteReviewAreaModal").find(".modal-body")
    var a=0;
    var one=$("#Area1").text();
    if($("#Area1").length != 0)
    {
    a=a+1;
    }
    var two=$("#Area2").text();
    if($("#Area2").length != 0)
    {
    a=a+1;
    }
    var three=$("#Area3").text();
    body.find("[value="+one+"]").prop('checked',true);
    body.find("[value="+two+"]").prop('checked',true);
    $("#AreaNum").text(a);
    if(a==2)
    {
    body.find("input").prop('disabled',true);
    body.find(":checked").prop('disabled',false);
    }
  });
  //
  $("#AreaNum").change(function(e)
  {alert(1);
    if($("#AreaNum").text()!='2')
    {
    $("#SeleteReviewAreaModal").find(".modal-body").find("input").prop('disabled',false);
    }
    else
    {
    body.find("input").prop('disabled',true);
    body.find(":checked").prop('disabled',false);
    }
  });
  //选择领域checkbox改变
  $("#SeleteReviewAreaModal").find(".modal-body").find('input').change(function(e){
  $("#AreaFrom").attr("class","form-group");
  $("#AreaFrom").popover('hide');
  if($(this).prop("checked"))
  {
  $("#AreaNum").text(parseInt($("#AreaNum").text())+1);
  }
  else
  {
  $("#AreaNum").text(parseInt($("#AreaNum").text())-1);
  }
  if($("#AreaNum").text()!='2')
  {
  $("#SeleteReviewAreaModal").find(".modal-body").find("input").prop('disabled',false);
  }
  else
  {
  $("#SeleteReviewAreaModal").find(".modal-body").find("input").prop('disabled',true);
  $("#SeleteReviewAreaModal").find(".modal-body").find(":checked").prop('disabled',false);
  }
  });
  //选择领域提交
  $("#SelectAreaSubmit").click(function(e){
  var one=$("#SeleteReviewAreaModal").find(".modal-body").find(":checked").first().attr("value");
  var two=$("#SeleteReviewAreaModal").find(".modal-body").find(":checked").last().attr("value");
  if(one==undefined)
  {
  $("#AreaFrom").attr("class","form-group has-error");
    $("#AreaFrom").attr("data-content",'最少选择一个');
    $("#AreaFrom").popover({placement:'left'});
    $("#AreaFrom").popover('show');
  }
  else
  {
  $("#AreaFrom").attr("class","form-group");
  $.get('/users/expert/profile/ChangeArea/?one='+one+'&two='+two,
  function(data,status){
  var d = $.parseJSON(data);
  $("#AreaNum").text(d['AreaNum'])
  $("#Area1").text(d['Area1'])
  $("#Area2").text(d['Area2'])
  $("#SeleteReviewAreaModal").modal('toggle');
  $("#SeleteReviewAreaModal").modal('hide');
  });
  }
  });
    $("input[type='text']").focus(function(e)
  {
    $(this).popover('destroy');
    if($(this).parent().attr("class")=="form-group has-error")
    {
        $(this).parent().attr("class","form-group");
    }
  });
  //增加资格证书
    $("#table_1").on('click',function(e){
    if(e.target.id=="deleteQualification")
    {
      var ID=$('[value='+e.target.value+']').parent().prev().text();
      var row=$('[value='+e.target.value+']').parents('tr')
    $.get('/users/expert/profile/DeleteQualification/?QID='+ID,function(data,status){
    $("#QualificationNum").text(parseInt($("#QualificationNum").text())-1)
    $("#QualificationHead").attr('rowspan',parseInt($("#QualificationNum").text()))
    row.remove()
    })
    }
    if(e.target.id=="AddQualificationSubmit")
    {
    if(!CheckIsEmpty("NewQualificationNum", "NewQualificationNumForm","请输入证书名称")&
    !CheckIsEmpty("NewQualificationID", "NewQualificationIDForm","请输入证书号"))
    {
        //提交
        var Name=$("#NewQualificationNum").val();
        var ID=$("#NewQualificationID").val();
        $.get('/users/expert/profile/AddQualification/?QName='+Name+'&QID='+ID,
        function(data,status)
        {
            if(data=='exist')
            {
            alert("证书已存在！")
            $('#NewQualificationIDForm').attr("class","form-group has-error");
            return;
            }
            else
            {
            var d = $.parseJSON(data);
            $("#QualificationNum").text(parseInt($("#QualificationNum").text())+1)
            $("#QualificationHead").attr('rowspan',parseInt($("#QualificationNum").text()))
            $("#QualificationHeadRow").after
            ("<tr><td>"+d['qname']+"</td><td>"+d['qno'] +"</td><td><button type='submit' id='deleteQualification' value=Q"+ID+" name='deleteQualification' class='btn btn-default'>删除</button></td></tr>")

            }
            ClearInput("NewQualificationNum","NewQualificationNumForm");
            ClearInput("NewQualificationID","NewQualificationIDForm");
            $("#QualificationModal").modal('toggle');
            $("#QualificationModal").modal('hide');
        }
        )
    }
    else
    {
        //do nothing
    }
    }
    })
    $("#table_2").on('click',"#AddAppraiseSubmit",function(e){
    if(!CheckIsEmpty("AppraiseTime","AppraiseTimeForm","请选择时间")&!CheckIsEmpty("AppraiseTaskName","AppraiseTaskNameForm","请输入任务名称")&!CheckIsEmpty("AppraiseDes","AppraiseDesForm","请输入任务描述")){
    var t=$("#AppraiseTime").val()
    var Name=$("#AppraiseTaskName").val()
    var type=$("#AppraiseType").val()
    var des=$("#AppraiseDes").val()
    $.get('/users/expert/profile/AddAppraise/?AName='+Name+'&ATime='+t+'&AType='+type+'&ADes='+des,
    function(data,status)
    {
            if(data=='exist')
            {
            alert("您已有相同的经历！")
            return
            }
            $("#Ahead").after('<tr><td>'+t+'</td><td>'+Name+'</td><td>'+des+'</td><td>'+type+'</td><td><button id="deleteAppraise" type="button" class="btn btn-default" >删除</button></td></tr>')
            ClearInput("AppraiseTime","AppraiseTimeForm");
            ClearInput("AppraiseTaskName","AppraiseTaskNameForm");
            ClearInput("AppraiseDes","AppraiseDesForm");
            $("#AddAppraiseModal").modal('toggle');
            $("#AddAppraiseModal").modal('hide');
    }
    )
    }
    else
    {
    //do nothing
    }
    });
    $("#table_2").on('click',"#deleteAppraise",function(e)
    {
    var row=$(this).parent().parent()
    var t=$(this).parent().prev().prev().prev().prev().text()
    var Name=$(this).parent().prev().prev().prev().text()
    var type=$(this).parent().prev().text()
    var des=$(this).parent().prev().prev().text()
    $.get('/users/expert/profile/DeleteAppraise/?AName='+Name+'&ATime='+t+'&AType='+type+'&ADes='+des,
    function(data,status)
    {
        row.remove()
    }
    )
    })
    $("#table_3").on('click',"#Addworking_experienceSubmit",function(e){
    if(!CheckIsEmpty("StartTime","StartTimeForm","请选择起始时间")&!CheckIsEmpty("EndTime","EndTimeForm","请选择终止时间")&!CheckIsEmpty("WorkingUnit","WorkingUnitForm","请输入工作单位名称")&!CheckIsEmpty("Duty","DutyForm","请输入职务")&!CheckIsEmpty("Witness","WitnessForm","请输入证明人")){
    var st=$("#StartTime").val()
    var et=$("#EndTime").val()
    var WorkingUnit=$("#WorkingUnit").val()
    var Duty=$("#Duty").val()
    var Witness=$("#Witness").val()
    if(!dateCompare(st,et))
    {
    $('#EndTimeForm').attr("class","form-group has-error");
    $('#EndTime').attr("data-content","终止时间不能小于起始时间");
    $('#EndTime').popover({placement:'bottom'});
    $('#EndTime').popover({trigger:'manual'});
    $('#EndTime').popover('show');
    return;
    }
    $.get('/users/expert/profile/Addworking_experience/?st='+st+'&et='+et+'&WorkingUnit='+WorkingUnit+'&Duty='+Duty+'&Witness='+Witness,
    function(data,status)
    {
            if(data=='exist')
            {
            alert("您已有相同的经历！")
            return
            }
            $("#Whead").after('<tr><td>'+st+'</td><td>'+et+'</td><td>'+WorkingUnit+'</td><td>'+Duty+'</td><td>'+Witness+'</td><td><button id="deleteworking_experience" type="button" class="btn btn-default" >删除</button></td></tr>')
            ClearInput("StartTime","StartTimeForm");
            ClearInput("EndTime","EndTimeForm");
            ClearInput("WorkingUnit","WorkingUnitForm");
            ClearInput("Duty","DutyForm");
            ClearInput("Witness","WitnessForm");
            $("#Addworking_experienceModal").modal('toggle');
            $("#Addworking_experienceModal").modal('hide');
    }
    )
    }
    else
    {
        //do nothing
    }
    });
    $("#table_3").on('click',"#deleteworking_experience",function(e)
    {
    var row=$(this).parent().parent()
    var st=$(this).parent().prev().prev().prev().prev().prev().text()
    var et=$(this).parent().prev().prev().prev().prev().text()
    var WorkingUnit=$(this).parent().prev().prev().prev().text()
    var Duty=$(this).parent().prev().prev().text()
    var Witness=$(this).parent().prev().text()
    $.get('/users/expert/profile/Deleteworking_experience/?st='+st+'&et='+et+'&WorkingUnit='+WorkingUnit+'&Duty='+Duty+'&Witness='+Witness,
    function(data,status)
    {
        row.remove()
    }
    )
    });
    $("#table_4").on('click',"#Addavoid_unitModalSubmit",function(e)
    {
    if(!CheckIsEmpty("UnitName","UnitNameForm","请输入单位名称"))
    {
        var UnitName=$("#UnitName").val()
        var IsWorking=$("#IsWorking").val()
        $.get('/users/expert/profile/Addavoid_unit/?UnitName='+UnitName+'&IsWorking='+IsWorking,
        function(data,status)
        {
                if(data=='exist')
            {
            alert("您已有相同的回避单位！")
            return
            }
                else
            {
            $("#AvoidH").after('<tr><td>'+UnitName+'</td><td>'+IsWorking+'</td><td><button id="DeleteAvoid_Unit" type="button" class="btn btn-default" >删除</button></td></tr>')
            ClearInput("UnitName","UnitNameForm");
            $("#Addavoid_unitModal").modal('toggle');
            $("#Addavoid_unitModal").modal('hide');
            }
        })
    }
    else
    {
        //do nothing
    }
    })
    $("#table_4").on('click',"#DeleteAvoid_Unit",function(e){
         var row=$(this).parent().parent()
         var UnitName=$(this).parent().prev().prev().text()
         $.get('/users/expert/profile/Deleteavoid_unit/?UnitName='+UnitName,
             function(data,status)
             {
                 row.remove()
             }
    )
    })
});
