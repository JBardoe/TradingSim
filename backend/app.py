from flask import Flask, json, jsonify, request, redirect, session, send_from_directory, make_response
from flask_login import login_user, LoginManager, current_user, logout_user, login_required
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug import security

import os
import yfinance as yf

from db_schema import db, User, add_user, dbinit

app = Flask(__name__, static_folder="build", static_url_path="/")
app.secret_key = "secretKey"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tradingsim.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

CORS(app, supports_credentials=True)
login_manager = LoginManager()
login_manager.init_app(app)

def resetDb():
    with app.app_context():
        db.drop_all()
        db.create_all()
        dbinit()

resetDb()#Database is reset when the app is run

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorised_callback():
    return jsonify(message="Login is required to access this route")

@app.errorhandler(Exception)
def handle_error(e):
    return jsonify(message="An unexpected error has occurred")

@app.route("/api/login", methods=['POST'])
def login():
	json = request.get_json()

	user = User.query.filter_by(email = json.get("email")).first()
 
	if not user:
		return jsonify(message="Unknown User"), 401
	elif not security.check_password_hash(user.password, json.get("password")):
		return jsonify(message="Incorrect Username or Password"), 401

	login_user(user)
	return jsonify(message="Login Successful"), 200

@app.route("/api/register", methods=['POST'])
def register():  
    json = request.form.json()  
    email = json.get("email")
    
    if User.query.filter_by(email = email).all():
        return make_response(jsonify(message="User already exists with that email"), 409)
    
    add_user(email=email, rawPassword=json.get("password"), fname=json.get("fname"), lname=json.get("lname"))
    login_user(User.query.filter_by(email=email).first())
    
    return jsonify("Registration Successful"), 200

@app.route("/api/checkAuth", methods=['GET', 'POST'])
def check_auth():
    if current_user.is_authenticated or app.debug:
        return jsonify(message="User Authenticated"), 200
    else:
        return jsonify(message="User Unauthorised"), 401

@app.route("/api/logout", methods=['GET', 'POST'])
def logout():
    logout_user()
    return jsonify("Logout Successful!"), 200

@app.route("/api/getStockData", methods=['GET', 'POST'])
def all_stocks():
	stock_code = request.args.get("stock")
	time_period = request.args.get("period")
	time_interval = request.args.get("interval")
	data = yf.download(stock_code, period=time_period, interval=time_interval)
	return data.to_json()

@app.route('/')
@app.route('/<path:path>')
def serve_react(path=''):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)