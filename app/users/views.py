# -*- coding: utf-8 -*-
from __future__ import absolute_import

import hashlib
import json
from datetime import time
import time
from sqlite3 import IntegrityError

from flask_bootstrap import Bootstrap
from flask import Blueprint, render_template, flash, redirect, session, url_for, request, g, make_response
from flask_login import login_user, logout_user, login_required, current_user
from app import app, db, login_manager
from app.users.forms import LoginForm
from app.users.forms import RegistrationForm
from app.users.models import User ,Profile, Expert_info, Qualification, Appraise_experience, Working_experience, \
    Avoid_unit, Reseaon

mod=Blueprint('users',__name__)

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.UserName==user_id).first()

@mod.route('/admin/NotPass/',methods=('GET','POST'))
@login_required
def NotPass():
    reseaon=Reseaon.query.filter(Reseaon.UserName==request.values.get("UserName")).first()
    if reseaon == None:
        reseaon=Reseaon(UserName=request.values.get("UserName"),ReseaonContext=request.values.get("NotPassResult"),CreateTime=time.strftime('%Y-%m-%d',time.localtime(time.time())),Message="被驳回")
    else:
        reseaon.CreateTime.CreateTime=time.strftime('%Y-%m-%d',time.localtime(time.time()))
        reseaon.Message=u"被驳回"
        reseaon.ReseaonContext=request.values.get("NotPassResult")
    reseaon.save()
    expert_info=Expert_info.query.filter(Expert_info.UserName==request.values.get("UserName")).first()
    expert_info.Statue=u'已驳回'
    expert_info.save()
    return 'good'

@mod.route('/admin/Pass/',methods=('GET','POST'))
@login_required
def PassSubmit():
    expert_info=Expert_info.query.filter(Expert_info.UserName==request.values.get("UserName")).first()
    expert_info.Statue=u'可用'
    md=hashlib.md5()
    md.update(request.values.get("UserName"))
    i=str(md.hexdigest())[1:10]
    expert_info.ExpertCertificateID='zj-'+i
    vt=time.localtime(time.time()+31622400)
    expert_info.ValidTime=time.strftime('%Y-%m-%d',vt)
    expert_info.save()
    return json.dumps({'time':time.strftime('%Y-%m-%d',vt),'ExpertCertificateID':'zj-'+i})

@mod.route('/admin/getprofile/')
@login_required
def admin_get_profile():
    UserName=request.values.get("UserName")
    expert_info=Expert_info.query.filter(Expert_info.UserName==UserName).first()
    if(expert_info.__dict__['Birthday']!=None):
        expert_info.__dict__['Birthday']=expert_info.__dict__['Birthday'].isoformat()
    if(expert_info.__dict__['ValidTime']!=None):
        expert_info.__dict__['ValidTime']=expert_info.__dict__['ValidTime'].isoformat()
    expert_info.__dict__['_sa_instance_state']=''
    print expert_info.__dict__
    return json.dumps(expert_info.__dict__)


@mod.route('/expert/getprofile/')
@login_required
def getprofile():
    UserName=current_user.UserName
    expert_info=Expert_info.query.filter(Expert_info.UserName==UserName).first()
    if(expert_info.__dict__['Birthday']!=None):
        expert_info.__dict__['Birthday']=expert_info.__dict__['Birthday'].isoformat()
    if(expert_info.__dict__['ValidTime']!=None):
        expert_info.__dict__['ValidTime']=expert_info.__dict__['ValidTime'].isoformat()
    expert_info.__dict__['_sa_instance_state']=''
    print expert_info.__dict__
    return json.dumps(expert_info.__dict__)

@mod.route('/expert/profile/')
@login_required
def expertprofile():
    UserName=current_user.UserName
    the_profile=Profile(UserName)
    the_profile.ReviewAreaOne=Expert_info.query.filter(Expert_info.UserName==UserName).first().ReviewAreaOne
    the_profile.ReviewAreaTwo=Expert_info.query.filter(Expert_info.UserName==UserName).first().ReviewAreaTwo
    return render_template('users/profile.html',profile=the_profile)

@mod.route('/expert/changepassword/')
@login_required
def expertchangepassword():
    return render_template('users/changepassword.html')

@mod.route('/expert/index/')
@login_required
def expertindex():
    return render_template('users/expertindex.html')

@mod.route('/admin/profile/all/')
@login_required
def admin_profileall():
    expert_infos=Expert_info.query.filter().all()
    List=[]
    for one in expert_infos:
        List.append({'Department':one.Department,'ExpertCertificateID':one.ExpertCertificateID,'Name':one.Name,'MobileNum':one.MobileNum,'Statue':one.Statue,'UserName':one.UserName})
    return render_template('users/adminprofile.html',profile=List)

@mod.route('/admin/profile/',methods=('GET','POST'))
@login_required
def admin_profile():
    List=[]
    area=request.values.get('Area')
    statue=request.values.get('Statue')
    if area!='' and statue!='':
        expert_infos=Expert_info.query.filter(Expert_info.ReviewAreaOne==area,Expert_info.Statue==statue).all()
        for one in expert_infos:
            List.append({'Department':one.Department,'ExpertCertificateID':one.ExpertCertificateID,'Name':one.Name,'MobileNum':one.MobileNum,'Statue':one.Statue,'UserName':one.UserName})
        expert_infos=Expert_info.query.filter(Expert_info.ReviewAreaTwo==area,Expert_info.Statue==statue).all()
        for one in expert_infos:
            List.append({'Department':one.Department,'ExpertCertificateID':one.ExpertCertificateID,'Name':one.Name,'MobileNum':one.MobileNum,'Statue':one.Statue,'UserName':one.UserName})
    if area=='' and statue!='':
        expert_infos=Expert_info.query.filter(Expert_info.Statue==statue).all()
        for one in expert_infos:
            List.append({'Department':one.Department,'ExpertCertificateID':one.ExpertCertificateID,'Name':one.Name,'MobileNum':one.MobileNum,'Statue':one.Statue,'UserName':one.UserName})
    if area!='' and statue=='':
        expert_infos=Expert_info.query.filter(Expert_info.ReviewAreaOne==area).all()
        for one in expert_infos:
            List.append({'Department':one.Department,'ExpertCertificateID':one.ExpertCertificateID,'Name':one.Name,'MobileNum':one.MobileNum,'Statue':one.Statue,'UserName':one.UserName})
        expert_infos=Expert_info.query.filter(Expert_info.ReviewAreaTwo==area).all()
        for one in expert_infos:
            List.append({'Department':one.Department,'ExpertCertificateID':one.ExpertCertificateID,'Name':one.Name,'MobileNum':one.MobileNum,'Statue':one.Statue,'UserName':one.UserName})
    if area=='' and statue=='':
            expert_infos=Expert_info.query.filter().all()
            for one in expert_infos:
                List.append({'Department':one.Department,'ExpertCertificateID':one.ExpertCertificateID,'Name':one.Name,'MobileNum':one.MobileNum,'Statue':one.Statue,'UserName':one.UserName})
    return json.dumps(List)

@mod.route('/login/',methods=('GET','POST'))
def login_view():
    if request.method == 'GET':
        render_template('users/login.html')
    if request.method == 'POST':
        print request.values.get('LoginRadio')
        user = User.query.filter(User.UserName ==  request.values.get('UserName'),User.Password ==  request.values.get('Password'),User.Type==request.values.get('LoginRadio')).first()
        # user = User.query.filter(User.UserName ==  "sosoo",User.Password == "1995101010").first()
        if user != None:
            remember= request.values.get('Remember')
            if remember =='on':
                remember= True
            else:
                remember=False
            login_user(user,remember=remember)
            flash(u"登录成功")
            # redirect(url_for('index'))
            if (request.values.get('LoginRadio')=='0'):
                return 'admin'
            return 'index'
        else:
            flash(u"用户名或密码错误")
            return ''
    return render_template('users/login.html')

@mod.route('/login/admin')
@login_required
def login_admin():
    return render_template('users/adminindex.html')

@mod.route('/login/index')
@login_required
def index_view():
    return render_template('users/expertindex.html')

@mod.route('/changecode/',methods=('GET', 'POST'))
@login_required
def ChangeCode():
    user_name=user_name=current_user.UserName
    old=request.values.get('Old_Code')
    new=request.values.get('New_Code')
    user=User.query.filter(User.UserName==user_name,User.Password==old).first()
    if user:
        user.Password=new
        user.save()
        logout_user()
        flash(u"成功修改密码，请重新登录",category=u'success')
        return 'index'
    else:
        flash(u"密码错误",category=u'success')
        return 'invalid'


@mod.route('/admin/details/',methods=('GET', 'POST'))
@login_required
def details():
    UserName=request.values.get('UserName')
    the_profile=Profile(UserName)
    the_profile.UserName=UserName
    the_profile.ReviewAreaOne=Expert_info.query.filter(Expert_info.UserName==UserName).first().ReviewAreaOne
    the_profile.ReviewAreaTwo=Expert_info.query.filter(Expert_info.UserName==UserName).first().ReviewAreaTwo
    return render_template('users/details.html',profile=the_profile)


@mod.route('/register/', methods=('GET', 'POST'))
def register_view():
    form = RegistrationForm(request.form)
    if request.method=='GET':
        return render_template('users/register.html',form=form)
    if request.method=='POST':
        if form.validate_on_submit():
            user = User()
            user.UserName=form.UserName
            user.Password=form.password.data
            user.Type=1
            form.populate_obj(user)
            if User.query.filter(User.UserName==user.UserName).first():
                e=u'用户名已被使用'
                flash(e, 'error')
                return render_template('users/register.html', form=form)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect(url_for('index'))
    return render_template('users/register.html', form=form)

@mod.route('/expert/changepassword/index/', methods=('GET', 'POST'))
def changepassword_index():
    return redirect(url_for('index'))

@login_required
@mod.route('/logout/')
def logout_view():
    logout_user()
    return redirect(url_for('index'))

@login_required
@mod.route('/expert/profile/AddQualification/')
def AddQualification():
    user_name=user_name=current_user.UserName
    qualification=Qualification.query.filter(Qualification.UserName==user_name,Qualification.QualificationID==request.values.get('QID')).first()
    if qualification:
        return 'exist'
    else:
        qualification=Qualification(request.values.get('QName'),request.values.get('QID'),user_name)
        db.session.add(qualification)
        db.session.commit()
        a={'id':"Qualification_"+str(Qualification.query.filter(Qualification.UserName==user_name).all().__len__()),
           'qname':request.values.get('QName'),'qno':request.values.get('QID')}
        return json.dumps(a)

@login_required
@mod.route('/expert/profile/ChangeArea/')
def ChangeArea():
    user_name=current_user.UserName
    expert_info=Expert_info.query.filter(Expert_info.UserName==user_name).first()
    expert_info.ReviewAreaOne=request.values.get('one')
    if request.values.get('one')!=request.values.get('two'):
        expert_info.ReviewAreaTwo=request.values.get('two')
        AreaNum='2'
    else:
        expert_info.ReviewAreaTwo=""
        AreaNum='1'
    expert_info.save()
    a={'AreaNum': AreaNum, 'Area1': expert_info.ReviewAreaOne, 'Area2': expert_info.ReviewAreaTwo}
    return json.dumps(a)

@login_required
@mod.route('/expert/profile/DeleteQualification/')
def DeleteQualification():
    user_name=user_name=current_user.UserName
    qualification=Qualification.query.filter(Qualification.UserName==user_name,Qualification.QualificationID==' '.join(request.values.get('QID').split())).first()
    db.session.delete(qualification)
    db.session.commit()
    return "good"

@login_required
@mod.route('/expert/profile/AddAppraise/')
def AddAppraise():
    user_name=user_name=current_user.UserName
    appraise=Appraise_experience.query.filter(Appraise_experience.UserName==user_name,Appraise_experience.AppraiseTime==request.values.get('ATime')
                                              ,Appraise_experience.TaskType==request.values.get('AType'),Appraise_experience.TaskName==request.values.get('AName')
                                              ,Appraise_experience.TaskDes==request.values.get('ADes')).first()
    if appraise:
        return 'exist'
    else:
        appraise=Appraise_experience(UserName=user_name,AppraiseTime=request.values.get('ATime'),TaskType=request.values.get('AType'),TaskName=request.values.get('AName'),TaskDes=request.values.get('ADes'))
        db.session.add(appraise)
        db.session.commit()
        return "good"

@login_required
@mod.route('/expert/profile/DeleteAppraise/')
def DeleteAppraise():
    user_name=user_name=current_user.UserName
    appraise=Appraise_experience.query.filter(Appraise_experience.UserName==user_name,Appraise_experience.AppraiseTime==request.values.get('ATime')
                                              ,Appraise_experience.TaskType==request.values.get('AType'),Appraise_experience.TaskName==request.values.get('AName')
                                              ,Appraise_experience.TaskDes==request.values.get('ADes')).first()
    db.session.delete(appraise)
    db.session.commit()
    return "good"

@login_required
@mod.route('/expert/profile/Addworking_experience/')
def Addworking_experience():
    user_name=user_name=current_user.UserName
    working_experience=Working_experience.query.filter(Working_experience.UserName==user_name,Working_experience.StartTime==request.values.get('st')
                                              ,Working_experience.EndTime==request.values.get('et'),Working_experience.Unit==request.values.get('WorkingUnit')
                                              ,Working_experience.Duty==request.values.get('Duty'),Working_experience.Witness==request.values.get('Witness')).first()
    if working_experience:
        return 'exist'
    else:
        working_experience=Working_experience(UserName=user_name,StartTime=request.values.get('st'),EndTime=request.values.get('et'),Duty=request.values.get('Duty'),Unit=request.values.get('WorkingUnit'),Witness=request.values.get('Witness'))
        db.session.add(working_experience)
        db.session.commit()
        return "good"

@login_required
@mod.route('/expert/profile/Deleteworking_experience/')
def Deleteworking_experience():
    user_name=user_name=current_user.UserName
    working_experience=Working_experience.query.filter(Working_experience.UserName==user_name,Working_experience.StartTime==request.values.get('st')
                                              ,Working_experience.EndTime==request.values.get('et'),Working_experience.Unit==request.values.get('WorkingUnit')
                                              ,Working_experience.Duty==request.values.get('Duty'),Working_experience.Witness==request.values.get('Witness')).first()
    db.session.delete(working_experience)
    db.session.commit()
    return "good"

@login_required
@mod.route('/expert/profile/submit/',methods=('GET', 'POST'))
def Submit_Profile():
    user_name=user_name=current_user.UserName
    expert_info=Expert_info.query.filter(Expert_info.UserName==user_name).first()
    expert_info.Submitted=True
    expert_info.Statue=u'审核中'
    expert_info.save()
    return make_response('1')

@login_required
@mod.route('/expert/profile/save/',methods=('GET', 'POST'))
def Save_Profile():
    user_name=user_name=current_user.UserName
    expert_info=Expert_info.query.filter(Expert_info.UserName==user_name).first()
    expert_info.Sex=request.values.get("Sex")
    expert_info.Name=request.values.get("Name")
    expert_info.Statue=u'填写中'
    if(request.values.get("Birthday")==""):
        expert_info.Birthday="1900-01-01"
    else:
        expert_info.Birthday=request.values.get("Birthday")
    expert_info.PoliticalStatus=request.values.get("PoliticalStatus")
    expert_info.Organization=request.values.get("Organization")
    expert_info.EducationalBackground=request.values.get("EducationalBackground")
    expert_info.Degree=request.values.get("Degree")
    expert_info.Identification=request.values.get("Identification")
    expert_info.IDNo=request.values.get("IDNo")
    expert_info.Title=request.values.get("Title")
    expert_info.CertificateID=request.values.get("CertificateID")
    expert_info.Job=request.values.get("Job")
    expert_info.WorkingTime=request.values.get("WorkingTime")
    expert_info.IsRetire=request.values.get("IsRetire")
    expert_info.IsParttime=request.values.get("IsParttime")
    expert_info.Department=request.values.get("Department")
    expert_info.Address=request.values.get("Address")
    expert_info.Email=request.values.get("Email")
    expert_info.MobileNum=request.values.get("MobileNum")
    expert_info.ZipCode=request.values.get("ZipCode")
    expert_info.HomeNum=request.values.get("HomeNum")
    expert_info.GraduatedFrom=request.values.get("GraduatedFrom")
    expert_info.Skill=request.values.get("Skill")
    expert_info.Achievement=request.values.get("Achievement")
    expert_info.Others=request.values.get("Others")
    expert_info.save()
    return make_response('1')

@login_required
@mod.route('/expert/profile/Addavoid_unit/')
def Addavoid_unit():
    user_name=user_name=current_user.UserName
    avoid_unit=Avoid_unit.query.filter(Avoid_unit.UserName==user_name,Avoid_unit.UnitName==request.values.get('UnitName')).first()
    if avoid_unit:
        return 'exist'
    else:
        avoid_unit=Avoid_unit(UserName=user_name,UnitName=request.values.get('UnitName'),IsWorking=request.values.get('IsWorking'))
        db.session.add(avoid_unit)
        db.session.commit()
        return "good"

@login_required
@mod.route('/expert/profile/Deleteavoid_unit/')
def Deleteavoid_unit():
    user_name=user_name=current_user.UserName
    avoid_unit=Avoid_unit.query.filter(Avoid_unit.UserName==user_name,Avoid_unit.UnitName==request.values.get('UnitName')).first()
    db.session.delete(avoid_unit)
    db.session.commit()
    return "good"
