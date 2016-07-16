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
    $("#table_1").on('click',"#SaveProfile",function(e)
    {
     $.post('/users/expert/profile/save/',
    {
    "Sex":$("#Sex").val(),
    "Name":$("#Name").val(),
    "Birthday":$("#Birthday").val(),
    "PoliticalStatus":$("#PoliticalStatus").val(),
    "Organization":$("#Organization").val(),
    "EducationalBackground":$("#EducationalBackground").val(),
    "Degree":$("#Degree").val(),
    "Identification":$("#Identification").val(),
    "IDNo":$("#IDNo").val(),
    "Title":$("#Title").val(),
    "CertificateID":$("#CertificateID").val(),
    "Job":$("#Job").val(),
    "WorkingTime":$("#WorkingTime").val(),
    "IsRetire":$("#IsRetire").val(),
    "IsParttime":$("#IsParttime").val(),
    "Department":$("#Department").val(),
    "Address":$("#Address").val(),
    "Email":$("#Email").val(),
    "MobileNum":$("#MobileNum").val(),
    "ZipCode":$("#ZipCode").val(),
    "HomeNum":$("#HomeNum").val(),
    "GraduatedFrom":$("#GraduatedFrom").val(),
    "Skill":$("#Skill").val(),
    "Achievement":$("#Achievement").val(),
    "Others":$("#Others").val()
    }
    ,function(data,status){$("#Statue").text("填写中")})
    }
    )
    //提交
    $("#table_1").on('click',"#SubmitProfile",function(e)
    {
    var legal=true
    $("[base='true']").each(function()
    {if($(this).val()=='')
    {
    $(this).attr("data-content","必须填写填写");
    $(this).popover({placement:'bottom'});
    $(this).popover({trigger:'manual'});
    $(this).popover('show');
    legal=false
    }
    })
    if(!legal)
    {
    return
    }
    $.post('/users/expert/profile/save/',
    {
    "Sex":$("#Sex").val(),
    "Name":$("#Name").val(),
    "Birthday":$("#Birthday").val(),
    "PoliticalStatus":$("#PoliticalStatus").val(),
    "Organization":$("#Organization").val(),
    "EducationalBackground":$("#EducationalBackground").val(),
    "Degree":$("#Degree").val(),
    "Identification":$("#Identification").val(),
    "IDNo":$("#IDNo").val(),
    "Title":$("#Title").val(),
    "CertificateID":$("#CertificateID").val(),
    "Job":$("#Job").val(),
    "WorkingTime":$("#WorkingTime").val(),
    "IsRetire":$("#IsRetire").val(),
    "IsParttime":$("#IsParttime").val(),
    "Department":$("#Department").val(),
    "Address":$("#Address").val(),
    "Email":$("#Email").val(),
    "MobileNum":$("#MobileNum").val(),
    "ZipCode":$("#ZipCode").val(),
    "HomeNum":$("#HomeNum").val(),
    "GraduatedFrom":$("#GraduatedFrom").val(),
    "Skill":$("#Skill").val(),
    "Achievement":$("#Achievement").val(),
    "Others":$("#Others").val()
    }
    ,function(data,status){})
    $.post('/users/expert/profile/submit/',function(data,status){
    $("#SaveProfile").attr("disabled",true)
    $("#SubmitProfile").attr("disabled",true)
    $.get('/users/expert/getprofile/',function(data,statue)
    {
        var d = $.parseJSON(data);
        for(var key in d)
        {
        $("#"+key).val(d[key])
        }
        $("#Statue").text(d["Statue"])
        if(d["ExpertCertificateID"]!=null){
        $("#ExpertCertificateID").text(d["ExpertCertificateID"])
        $("#ValidTime").text(d["ValidTime"])
        }
        if(d["Statue"]=="填写中")
        {
            $('Textarea').attr("disabled",false)
            $('button').attr("disabled",false)
            $("#SaveProfile").attr("disabled",false)
            $("#SubmitProfile").attr("disabled",false)
            $("#EditProfile").attr("disabled",true)
        }
        if(d["Statue"]!="填写中")
        {
        $('Textarea').attr("disabled",true)
        $('button').attr("disabled",true)
        $("#EditProfile").attr("disabled",false)
        }
        if(d["Submitted"]==true)
        {
        $("[base='true']").attr("disabled",true)
        }
    });
    })
    })
    $("#table_1").on('click',"#EditProfile",function(e)
    {
    $("#SaveProfile").attr("disabled",false)
    $("#SubmitProfile").attr("disabled",false)
    $('button').attr("disabled",false)
    })
    $("#ChangeCodeForm").on('click',"#ChangeCodeSubmit",function(e)
    {
    e.preventDefault()
    var one=$("#New_Code").val()
    var two=$("#NGNew_Code").val()
    if(one!=two)
    {
            $('#NGNew_CodeForm').attr("class","form-group has-error");
            $("#NGNew_Code").attr("data-content","两次输入密码不一致！");
            $("#NGNew_Code").popover({placement:'bottom'});
            $("#NGNew_Code").popover({trigger:'manual'});
            $("#NGNew_Code").popover('show');
            return;
    }
    $.post('/users/changecode/',
    {
    'New_Code':one,
    'Old_Code':$("#Old_Code").val()
    },
    function(data,statue)
    {
        if(data=='invalid')
        {
        location.reload();
        }
        else
        {
        location.href=data;
        }
    })
    })
    $("#ChangeCodeForm").on('blur',"#New_Code",function(e)
    {
        var l=$("#New_Code").val().length;
        if(l<=6|l>=20)
        {
            $('#New_CodeForm').attr("class","form-group has-error");
            $("#New_Code").attr("data-content","密码长度必须为6-20个字符！");
            $("#New_Code").popover({placement:'bottom'});
            $("#New_Code").popover({trigger:'manual'});
            $("#New_Code").popover('show');
        }
    })
    $("#QueryForm").on('click',"#Query",function(e)
    {
    e.preventDefault()
    $.post('/users/admin/profile/',{
    "Area":$("#AreaQuery").val(),
    "Statue":$("#StatueQuery").val()
    },function(data,statue)
    {
    $("#admin_head").nextAll().remove()
    var d = $.parseJSON(data);
    for(var i = 0, l = d.length; i < l; i++) {
    var one=d[i];
    $("#admin_head").after('<tr"><td>'+one["ExpertCertificateID"]+'</td><td>'+one["Name"]+'</td><td>'+one["Department"]+'</td><td>'+one["MobileNum"]+'</td><td>'+one["Statue"]+'</td><td><a id="details" href=/users/admin/details/?UserName='+one["UserName"]+'>详细</a></td></tr>')
    }
    })
    })
    $("#NotPass").on('click',function(e)
    {
		var l=$("#NotPassResult").val().length
		$("#NotPassInput").text(l);
		$("#NotPassLeft").text(500-l);
		if(l>=500|l==0)
		{
		    $("#NotPassResultSubmit").attr('disabled',true)
		}
		else
		{
		    $("#NotPassResultSubmit").attr('disabled',false)
		}
    })
    $("#NotPassResult").on('keyup',function(e)
	{
		var l=$("#NotPassResult").val().length
		$("#NotPassInput").text(l);
		$("#NotPassLeft").text(500-l);
		if(l>=500|l==0)
		{
		    $("#NotPassResultSubmit").attr('disabled',true)
		}
		else
		{
		    $("#NotPassResultSubmit").attr('disabled',false)
		}
	})
	$("#NotPassResultSubmit").on('click',function(e)
	{
		var UserName=$("#UserName").text()
		$.post('/users/admin/NotPass/',
		{
			'UserName':UserName,
			'NotPassResult':$("#NotPassResult").val(),
		},
		function(data,status)
		{
		    $("#Statue").text('已驳回')
			$("#NotPassModal").modal('toggle');
            $("#NotPassModal").modal('hide');
		})
	})
	$("#Pass").on('click',function(e)
	{
		var UserName=$("#UserName").text()
		$.post('/users/admin/Pass/',
		{
			'UserName':UserName
		},function(data,status)
		{
			var d=$.parseJSON(data)
			$("#ValidTime").text(d['time'])
			$("#ExpertCertificateID").text(d['ExpertCertificateID'])
		})
	})
		//Abort
	$("#Abort").on('click',function(e)
    {
		var l=$("#AbortText").val().length
		$("#AbortInput").text(l);
		$("#AbortLeft").text(500-l);
		if(l>=500|l==0)
		{
		    $("#AbortSubmit").attr('disabled',true)
		}
		else
		{
		    $("#AbortSubmit").attr('disabled',false)
		}
    })

    $("#AbortText").on('keyup',function(e)
	{
		var l=$("#AbortText").val().length
		$("#AbortInput").text(l);
		$("#AbortLeft").text(500-l);
		if(l>=500|l==0)
		{
		    $("#AbortSubmit").attr('disabled',true)
		}
		else
		{
		    $("#AbortSubmit").attr('disabled',false)
		}
	})
	$("#AbortSubmit").on('click',function(e)
	{
		var UserName=$("#UserName").text()
		$.post('/users/admin/Abort/',
		{
			'UserName':UserName,
			'NotPassResult':$("#AbortText").val(),
		},
		function(data,status)
		{
		    $("#Statue").text('失效')
			$("#AbortModal").modal('toggle');
            $("#AbortModal").modal('hide');
			$("#ValidTime").text(data)
		})
	})
	$("#UserName[name='UserName']").on('blur',function(e)
	{
		name=$(this).val()
		$.post('/users/checked/',{'name':name},function(data,status)
			{
			    alert(data)
				if(data=='true')
				{
					$("#UserName[name='UserName']").attr("data-content","用户名已被使用，请重新输入");
					$("#UserName[name='UserName']").popover({placement:'bottom'});
					$("#UserName[name='UserName']").popover({trigger:'manual'});
					$("#UserName[name='UserName']").popover('show');

				}
				else
				{
					$("#UserName[name='UserName']").popover('hide');
					$("#UserName[name='UserName']").popover('destroy');
				}
			})
	})
});
