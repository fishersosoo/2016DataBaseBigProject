$(document).on('ready',function(){
var UserName=$("#UserName").text()
$.get('/users/admin/getprofile/?'+UserName,function(data,statue)
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
$('Textarea').attr("disabled",true)
$('button').attr("disabled",true)
$("#EditProfile").attr("disabled",false)
});
})