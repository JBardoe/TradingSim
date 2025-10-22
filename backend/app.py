from flask import Flask, json, jsonify, request, redirect, session, send_from_directory, make_response
from flask_login import login_user, LoginManager, current_user, logout_user, login_required
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug import security

import pandas as pd
import os
import yfinance as yf
from datetime import datetime, timedelta

from db_schema import db, User, add_user, dbinit, TrackedStock, track_stock, untrack_stock
from strategies.trend_following import trend_following, long_trend_following
from strategies.mean_reversion import mean_reversion
from strategies.momentum_trading import momentum_trading

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

algs = ["Trend Following", "Mean Reversion", "Momentum Trading"]

@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorised_callback():
	return jsonify(message="Login is required to access this route"), 401

@app.errorhandler(Exception)
def handle_error(e):
	print("Error:", e)
	return jsonify(message="An unexpected error has occurred"), 500

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

	add_user(email=email, raw_password=json.get("password"), fname=json.get("fname"), lname=json.get("lname"))
	login_user(User.query.filter_by(email=email).first())

	return jsonify("Registration Successful"), 200

@app.route("/api/checkAuth", methods=['POST'])
def check_auth():
	if current_user.is_authenticated:
		return jsonify(message="User Authenticated", email=current_user.email), 200
	else:
		return jsonify(message="User Unauthorised"), 401

@app.route("/api/logout", methods=['GET', 'POST'])
def logout():
	logout_user()
	return jsonify("Logout Successful!"), 200

@app.route("/api/getRecentStockData", methods=['POST'])
def get_recent_stock():
	stock_code = request.args.get("stock")
	time_period = request.args.get("period")
	time_interval = request.args.get("interval")
	data = yf.download(stock_code, period=time_period, interval=time_interval)["Close"]
	return data.to_json()

@app.route("/api/getStockPanelData", methods=['GET'])
def	get_stock_panel():
	stock_code = request.args.get("stock")
	if not stock_code:
		return jsonify({"error": "Missing 'stock' query parameter"}), 400

	data = yf.Ticker(stock_code).history(period="6mo", interval="1d")

	if data.empty:
		return jsonify({"error": f"No data found for {stock_code}"}), 404

	close = data["Close"]
	if isinstance(close, pd.DataFrame):
		close = close.iloc[:, 0]

	data["MA100"] = close.rolling(window=100).mean()

	current_price = close.iloc[-1]
	avg_price = data["MA100"].iloc[-1]

	if pd.isna(avg_price):
		return jsonify({
			"code": stock_code,
			"error": "Not enough data to compute 100-day average",
			"current": float(current_price)
		}), 200
	
	return jsonify({
		"code": stock_code,
		"avg": float(avg_price),
		"current": float(current_price)
	})
	
@app.route("/api/getStockWindowGraph", methods=['POST'])
def get_stock_window_graph():
	json = request.get_json()
	stock_code = json.get("code")
	interval = json.get("interval")
	period = json.get("period")
	data = yf.download(stock_code, interval=interval, period=period)["Close"]

	formatted= []
	for row in data.itertuples():
		formatted.append({"value": row[1], "time":row[0].timestamp()})

	return jsonify(formatted)

@app.route("/api/getStockAverages", methods=['POST'])
def get_stock_averages():
	json = request.get_json()
	stock_code = json.get("code")
	day_interval = json.get("dayInterval")

	if not stock_code:
		return jsonify({"error": "Missing required query parameters"}), 400

	interval = "1d" if day_interval else "1m"
	period = datetime.now() - timedelta(days=(150 if day_interval else 1))

	data = yf.download(stock_code, interval=interval, start=period)

	if data.empty:
		return jsonify({"error": f"No data found for {stock_code}"}), 404

	data["MA100"] = data["Close"].rolling(window=100).mean()
	data["MA50"] = data["Close"].rolling(window=50).mean()
	
	if pd.isna(data["MA100"].iloc[-1]):
		return jsonify({"fifty": float(data["MA50"].iloc[-1])}), 200

	return jsonify({
		"fifty": float(data["MA50"].iloc[-1]),
		"hundred": float(data["MA100"].iloc[-1])
	}),200

@app.route("/api/getTrackedStocks", methods=["POST"])
@login_required
def get_tracked_stocks():
	
	stock_codes = []

	rows = TrackedStock.query.with_entities(TrackedStock.stock_code).filter_by(user_id = current_user.id).all()

	for row in rows:
		stock_codes.append(row[0])

	if request.get_json() and request.get_json().get("code"):
		return jsonify({
			"tracked": request.get_json().get("code") in stock_codes
		}), 200
	
	return jsonify({
		"stocks": stock_codes
	}), 200
 
@app.route("/api/addTrackedStock", methods=["POST"])
@login_required
def add_tracked_stock():
	json = request.get_json()
	stock_code = json.get("code")

	if not stock_code:
		return jsonify({"error": "Missing required query parameters"}), 400

	track_stock(current_user.id, stock_code)

	return jsonify({"message": "Stock tracked successfully"}), 200

@app.route("/api/removeTrackedStock", methods=["POST"])
@login_required
def remove_tracked_stock():
	json = request.get_json()
	stock_code = json.get("code")

	if not stock_code:
		return jsonify({"error": "Missing required query parameters"}), 400
	
	untrack_stock(current_user.id, stock_code)

	return jsonify({"message": "Stock untracked successfully"}), 200

@app.route("/api/getAlgorithms", methods=["GET"])
def get_algorithms():
	return jsonify({"algorithms": algs}), 200

@app.route("/api/runAlgorithm", methods=["POST"])
@login_required
def run_algorithm():
	json = request.get_json()
	stock_code = json.get("code")
	algorithm = json.get("strategy")
	options = json.get("options")

	if not stock_code or not algorithm or not options:
		return jsonify({"error": "Missing required query parameters"}), 400
	
	start_time = datetime.fromtimestamp(options.get("start"))
	interval = options.get("interval")

	end_time = datetime.fromtimestamp(options.get("end")) if options.get("end") else datetime.now()

	match algorithm:
		case "Trend Following": 
			if options.get("short"):
				(report, result) = trend_following(stock_code=stock_code, interval=interval, start_time = start_time, end_time=end_time)
			else:
				(report, result) = long_trend_following(stock_code=stock_code, interval=interval, start_time = start_time, end_time=end_time)
		case "Mean Reversion":
			(report, result) = mean_reversion(stock_code=stock_code, interval=interval, start_time=start_time, threshold=float(options.get("threshold")), end_time=end_time)
		case "Momentum Trading":
			(report, result) = momentum_trading(stock_code=stock_code, interval=interval, start_time=start_time, end_time=end_time)
		case _:
			return jsonify({"error": "Unknown Algorithm"}), 400
	
	return jsonify({
		"report":report, 
		"result":result
	}),200

@app.route('/')
@app.route('/<path:path>')
def serve_react(path=''):
	if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
		return send_from_directory(app.static_folder, path)
	else:
		return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
	app.run(debug=True)