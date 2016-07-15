# -*- coding: utf-8 -*-
from __future__ import absolute_import
from flask_bootstrap import Bootstrap
from flask import Flask, g, render_template, send_from_directory, session, request
import os
import os.path

from flask_login import LoginManager, current_user, AnonymousUserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import redirect

_basedir = os.path.abspath(os.path.dirname(__file__))
configPy = os.path.join(os.path.join(_basedir, os.path.pardir), 'config.py')

app = Flask(__name__)
Bootstrap(app)
app.config.from_pyfile(configPy)

flask_sqlalchemy_used = True
db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.login_view = 'users.login_view'

from app.users.views import mod as usersModule
app.register_blueprint(usersModule,url_prefix='/users')

# *****************
# controllers
# *****************

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'ico/favicon.ico')


@app.errorhandler(404)
def page_not_found(e):
    print request.values
    return render_template('404.html'), 404


@app.route("/")
def index():
    if current_user.is_authenticated:
        return redirect('users/expert/index')
    else:
        return render_template('index.html')


