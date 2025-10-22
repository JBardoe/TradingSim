import yfinance as yf
import pandas as pd
from datetime import timedelta, datetime


def momentum_trading(stock_code, interval, start_time, lookback = 20, threshold=0.02, end_time=datetime.now(), volume=1):
	report = []

	match interval:
		case "day":
			interval = "1d"
			period = start_time - timedelta(days=150)
			time_fmt = "%d/%m/%y"
		case "minute":
			interval = "1m"
			period = start_time - timedelta(days=1)
			time_fmt = "%d/%m-%H:%M"
		case _:
			raise ValueError("Interval must be 'day' or 'minute'")
		
	data = yf.download(stock_code, interval=interval, start=period, end=end_time)
	if data.empty:
		return (["No data found"], 0.0)
	
	if isinstance(data.columns[0], tuple):
		data.columns = [col[0].lower() for col in data.columns]
	else:
		data.columns = [str(col).lower() for col in data.columns]

	data["momentum"] = data["close"] / data["close"].shift(lookback) - 1.0 

	profit = 0.0
	position = 0
	entry = 0.0

	for i in range(1, len(data)):
		row = data.iloc[i]
		time = data.index[i]
		price = float(row["close"])
		momentum = row["momentum"]

		if pd.isna(momentum):
			continue

		if momentum > threshold and position <= 0:
			if position == -1 and entry != 0.0:
				profit += entry - price
				report.append(f"Time: {time.strftime(time_fmt)}, Action: CLOSE, Price: {round(data['close'].iloc[i],2)}, Profit: {round(profit,2)}")
			
			report.append(f"Time: {time.strftime(time_fmt)}, Action: BUY, Price: {round(data['close'].iloc[i],2)}, Profit: {round(profit,2)}")
			entry = price
			position = 1

		elif momentum < -threshold and position >= 0:
			if position == 1 and entry != 0.0:
				profit += price - entry
				report.append(f"Time: {time.strftime(time_fmt)}, Action: CLOSE, Price: {round(data['close'].iloc[i],2)}, Profit: {round(profit,2)}")
			
			entry = price
			position = -1
			report.append(f"Time: {time.strftime(time_fmt)}, Action: SHORT, Price: {round(data['close'].iloc[i],2)}, Profit: {round(profit,2)}")
	
	if position != 0:
		profit += (data["close"].iloc[-1] - entry) * position

	report.append(f"Time: {data.index[-1].strftime(time_fmt)}, Action: CLOSE, Price: {round(data['close'].iloc[-1],2)}, Profit: {round(profit,2)}")

	profit *= volume
	
	return (report, profit)