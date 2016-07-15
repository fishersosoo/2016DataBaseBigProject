# -*- coding: utf-8 -*-
from __future__ import absolute_import

import json
from sqlite3 import IntegrityError

from flask_bootstrap import Bootstrap
from flask import Blueprint, render_template, flash, redirect, session, url_for, request, g, make_response
from flask_login import login_user, logout_user, login_required, current_user
from app import app, db, login_manager
from app.users.forms import LoginForm
from app.users.forms import RegistrationForm
from app.users.models import User ,Profile, Expert_info, Qualification, Appraise_experience, Working_experience, \
    Avoid_unit

mod=Blueprint('users',__name__)

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.UserName==user_id).first()

@mod.route('/expert/profile/')
@login_required
def expertprofile():
    UserName=current_user.UserName
    the_profile=Profile(UserName)
    print the_profile.Name
    return render_template('users/profile.html',profile=the_profile)

@mod.route('/expert/changepassword/')
@login_required
def expertchangepassword():
    return render_template('users/changepassword.html')

@mod.route('/expert/index/')
@login_required
def expertindex():
    return render_template('users/expertindex.html')

@mod.route('/login/',methods=('GET','POST'))
def login_view():
    if request.method == 'GET':
        render_template('users/login.html')
    if request.method == 'POST':
        # user = User.query.filter(User.UserName ==  request.values.get('UserName'),User.Password ==  request.values.get('Password')).first()
        user = User.query.filter(User.UserName ==  "sosoo",User.Password == "1995101010").first()
        if user != None:
            remember= request.values.get('Remember')
            if remember =='on':
                remember= True
            else:
                remember=False
            login_user(user,remember=remember)
            flash(u"登录成功")
            # redirect(url_for('index'))
            return 'index'
        else:
            flash(u"用户名或密码错误")
            return ''
    return render_template('users/login.html')

@mod.route('/login/index')
def index_view():
    return render_template('users/expertindex.html')

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
