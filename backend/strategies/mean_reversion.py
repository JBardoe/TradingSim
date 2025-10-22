import yfinance as yf
import pandas as pd
from datetime import timedelta, datetime


def mean_reversion(stock_code, interval, start_time, threshold=1,end_time=datetime.now(), volume=1):
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

	data["ma20"] = data["close"].rolling(20).mean()
	data["dev"] = (data["close"] - data["ma20"]) / data["close"].rolling(20).std()

	position = 0
	profit = 0.0
	entry = 0.0

	for i in range(1, len(data)):
		if data["dev"].iloc[i] < (-1 * threshold) and position <= 0:
			report.append(f"Time: {data.index[i].strftime(time_fmt)}, Action: BUY, Price: {round(data['close'].iloc[i],2)}, Profit: {round(profit,2)}")
			entry = data["close"].iloc[i]
			position = 1
		elif data["dev"].iloc[i] > threshold and position >= 0:
			report.append(f"Time: {data.index[i].strftime(time_fmt)}, Action: SHORT, Price: {round(data['close'].iloc[i],2)}, Profit: {round(profit,2)}")
			entry = data["close"].iloc[i]
			position = -1

		if position == 1 and data["dev"].iloc[i] >= 0:
			report.append(f"Time: {data.index[i].strftime(time_fmt)}, Action: REVERT, Price: {round(data['close'].iloc[i],2)}, Profit: {round(profit,2)}")
			profit += data["close"].iloc[i]- entry
			position = 0
		elif position == -1 and data["dev"].iloc[i] <= 0:
			report.append(f"Time: {data.index[i].strftime(time_fmt)}, Action: REVERT, Price: {round(data['close'].iloc[i],2)}, Profit: {round(profit,2)}")
			profit += entry - data["close"].iloc[i]
			position = 0 

	if position != 0:
		profit += (data["close"].iloc[-1] - entry) * position
	report.append(f"Time: {data.index[-1].strftime(time_fmt)}, Action: END, Price: {round(data['close'].iloc[-1],2)}, Profit: {round(profit,2)}")

	profit *= volume
	return (report, profit)