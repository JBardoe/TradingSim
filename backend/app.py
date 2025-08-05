from flask import Flask, jsonify, request, redirect, session, send_from_directory
from flask_login import login_user, LoginManager, current_user, logout_user, login_required
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug import security
from db_schema import db, User, add_user, dbinit
import os

app = Flask(__name__, static_folder="build", static_url_path="/")
app.secret_key = "secretKey"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tradingsim.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


CORS(app)
login_manager = LoginManager()
login_manager.init_app(app)

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
	if not ("password" in request.form and "username" in request.form): #Should never trigger
		return jsonify(message="Invalid form submission", success=False)

	user = User.query.filter_by(email = request.form.get("email")).first()

	if not user:
		return jsonify(message="Unknown User", success=False)
	elif not security.check_password_hash(user.password, request.form.get("password")):
		return jsonify(message="Incorrect Username or Password", success=False)

	login_user(user)
	return jsonify(message="Login Successful", success=True)

@app.route("/api/register", methods=['POST'])
def register():
    if not ("email" in request.form and "password" in request.form and "fname" in request.form and "lname" in request.form):
        return jsonify(message="Invalid form submission", success=False)
    
    email = request.form.get("email")
    
    if User.query.filter_by(email = email).all():
        return jsonify(message="User already exists with that email", success=False)
    
    add_user(email=email, rawPassword=request.form.get("password"), fname=request.form.get("fname"), lname=request.form.get("lname"))
    login_user(User.query.filter_by(email=email).first())
    
    return jsonify("Registration Successful", success=True)

@app.route('/')
@app.route('/<path:path>')
def serve_react(path=''):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)