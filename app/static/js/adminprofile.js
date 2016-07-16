$(document).on('ready',function(){
var UserName=$("#UserName").text()
$.get('/users/admin/getprofile/?UserName='+UserName,function(data,statue)
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
$('input').attr("readonly",true)
$('Textarea').attr("readonly",true)
$('select').attr("disabled",true)
$("#NotPassResult").attr("readonly",false)
$("#AbortText").attr("readonly",false)
});
})