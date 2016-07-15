# -*- coding: utf-8 -*-
from flask_wtf import Form
from flask_wtf.recaptcha import validators

from wtforms import PasswordField, BooleanField, SelectField, SubmitField
from wtforms import StringField
from wtforms.validators import DataRequired, Length, EqualTo


class LoginForm(Form):
    role=SelectField(u'角色', choices = [('0',u'管理员'),('1',u'专家')])
    username = StringField(u'用户名:',validators=[DataRequired()])
    password=PasswordField(u'密码:',validators=[DataRequired()])
    remember_me = BooleanField(u'remember_me', default=False)
    submit_button = SubmitField(u'登录')



class RegistrationForm(Form):
    UserName=StringField(u'用户名：',validators=[Length(min=5, max=20)])
    password=PasswordField(u'密码：',validators=[Length(min=6, max=20)])
    again_password=PasswordField(u'密码确认：',validators=[EqualTo('password', message=u'两次输入密码不同，请重新输入！')])
    submit_button = SubmitField(u'注册')