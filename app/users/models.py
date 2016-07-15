# -*- coding: utf-8 -*-
from app import db, login_manager
from app.users import constants as USER
from flask_login import UserMixin
from collections import Counter

class User(db.Model,UserMixin):
    __tablename__='user'
    UserName=db.Column(db.String(20),primary_key=True)
    Password=db.Column(db.String(20),nullable=False)
    Type=db.Column(db.Boolean,nullable=False)
    def __init__(self, user_name=None, password=None,tpye=1):
        self.UserName=user_name
        self.Password=password
        self.Type=type
    def get_user(self):
        return unicode(self.UserName)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.UserName)


class Avoid_unit(db.Model):
    __tablename__ = 'avoid_unit'
    UserName = db.Column(db.String(20), db.ForeignKey('user.UserName'), primary_key=True )
    UnitName = db.Column(db.String(20),  primary_key=True )
    IsWorking = db.Column(db.String(2), nullable=False)
    def __init__(self, UnitName, IsWorking):
        self.UnitName=UnitName
        if IsWorking:
            self.IsWorking=u"是"
        else:
            self.IsWorking=u"否"

    def setID(self,id):
        self.ID=unicode("Avoid_unit_"+str(id))


class Appraise_experience(db.Model):
    __tablename__ = 'appraise_experience'
    UserName = db.Column(db.String(20), db.ForeignKey('user.UserName'), primary_key=True )
    AppraiseTime = db.Column(db.Date,  primary_key=True )
    TaskName = db.Column(db.String(20),  primary_key=True )
    TaskDes= db.Column(db.String(20),  primary_key=True )
    TaskType=db.Column(db.String(10),  primary_key=True )
    def __init__(self,AppraiseTime, UserName, TaskName,TaskDes,TaskType):
        self.AppraiseTime=AppraiseTime
        self.TaskName=TaskName
        self.TaskDes=TaskDes
        self.TaskType=TaskType
        self.UserName=UserName

    def setID(self,id):
        self.ID=unicode("Appraise_experience_"+ str(id))


class Working_experience(db.Model):
    __tablename__ = 'working_experience'
    UserName = db.Column(db.String(20), db.ForeignKey('user.UserName'), primary_key=True )
    StartTime = db.Column(db.Date,  primary_key=True )
    EndTime = db.Column(db.Date, primary_key=False)
    Unit = db.Column(db.String(20),  primary_key=True )
    Duty=db.Column(db.String(20),  primary_key=True )
    Witness=db.Column(db.String(20),  primary_key=True )
    def __init__(self, StartTime,EndTime ,Unit, Duty,Witness,UserName):
        self.StartTime=StartTime
        self.EndTime=EndTime
        self.Unit=Unit
        self.Duty=Duty
        self.Witness=Witness
        self.UserName=UserName

    def setID(self,id):
        self.ID=unicode("Working_experience_"+str(id))

class Qualification(db.Model):
    __tablename__ = 'qualification'
    UserName = db.Column(db.String(20), db.ForeignKey('user.UserName'), primary_key=True )
    QualificationID = db.Column(db.String(20),  primary_key=True )
    QualificationName=db.Column(db.String(20),  nullable=False )
    def __init__(self, QualificationName,QualificationID,UserName):
        self.QualificationName=QualificationName
        self.QualificationID=QualificationID
        self.UserName=UserName

    def setID(self,id):
        self.ID=("Qualification_"+str(id))

class Expert_info(db.Model):
    __tablename__ = 'expert_info'
    UserName = db.Column(db.String(20), db.ForeignKey('user.UserName'), primary_key=True, )
    Statue = db.Column(db.String(20), nullable=False)
    ExpertCertificateID = db.Column(db.String(20), unique=True)
    ValidTime = db.Column(db.Date)
    Name = db.Column(db.String(20), nullable=False)
    Sex = db.Column(db.String(2), nullable=False)
    Birthday = db.Column(db.Date, nullable=False)
    PoliticalStatus = db.Column(db.String(10), nullable=False)
    Organization = db.Column(db.String(10), nullable=False)
    EducationalBackground = db.Column(db.String(10), nullable=False)
    Degree = db.Column(db.String(10), nullable=False)
    Identification = db.Column(db.String(20), nullable=False)
    IDNo = db.Column(db.String(40), nullable=False)
    Title = db.Column(db.String(10), nullable=False)
    CertificateID = db.Column(db.String(20), nullable=False)
    Job = db.Column(db.String(10), nullable=False)
    WorkingTime = db.Column(db.String(10), nullable=True)
    IsRetire = db.Column(db.String(2), nullable=False)
    IsParttime = db.Column(db.String(2), nullable=False)
    Department = db.Column(db.String(30), nullable=False)
    Address = db.Column(db.String(30), nullable=False)
    Email = db.Column(db.String(30), nullable=False)
    MobileNum = db.Column(db.String(30), nullable=False)
    ZipCode = db.Column(db.String(10), nullable=False)
    HomeNum = db.Column(db.String(30), nullable=False)
    GraduatedFrom = db.Column(db.String(30), nullable=False)
    ReviewAreaOne = db.Column(db.String(20), nullable=False)
    ReviewAreaTwo = db.Column(db.String(20), nullable=False)
    Skill = db.Column(db.String(300), nullable=True)
    Achievement = db.Column(db.String(300), nullable=True)
    Others = db.Column(db.String(300), nullable=True)
    Pic= db.Column(db.LargeBinary, nullable=True)
    def save(self):
        db.session.add(self)
        db.session.commit()


class Profile():
    def __init__(self,UserName):
        expert_info=Expert_info.query.filter(Expert_info.UserName==UserName).first()
        if expert_info:
            self.__dict__.update(expert_info.__dict__)
            self.IsEmpty=False
            Qualifications=Qualification.query.filter(Qualification.UserName==UserName).all()
            self.Qualifications=[]
            if Qualifications:
                self.NoQulifications=False
                self.QualificationNum=Qualifications.__len__()+1
                id=1
                for one in Qualifications:
                    self.Qualifications.append(one)
                    self.Qualifications[id-1].setID(id)
                    id=id+1
            else:
                self.NoQualifications=True
            Appraise_experiences=Appraise_experience.query.filter(Appraise_experience.UserName==UserName).all()
            self.Appraise_experiences=[]
            id=1
            for one in Appraise_experiences:
                self.Appraise_experiences.append(one)
                self.Appraise_experiences[id-1].setID(id)
                id=id+1
            Working_experiences=Working_experience.query.filter(Working_experience.UserName==UserName).all()
            self.Working_experiences=[]
            id=1
            for one in Working_experiences:
                self.Working_experiences.append(one)
                self.Working_experiences[id-1].setID(id)
                id=id+1
            Avoid_units=Avoid_unit.query.filter(Avoid_unit.UserName==UserName).all()
            self.Avoid_units=[]
            id=1
            for one in Avoid_units:
                self.Avoid_units.append(one)
                self.Avoid_units[id-1].setID(id)
                id=id+1
        else:
            self.Status=u"填写中"
            self.IsEmpty=True