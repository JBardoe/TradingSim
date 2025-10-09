import yfinance as yf
import pandas as pd
from datetime import timedelta, datetime

def past_trend_following(stock_code, interval, start_time, end_time=datetime.now(), volume=1):
	report = []

	match interval:
		case "day": 
			interval = "1d"
			period = start_time - timedelta(days=150)
		case "minute": 
			interval = "1m"
			period = start_time - timedelta(days=1)
		case _:
			return 
    
    
	data = yf.download(stock_code, interval=interval, start=period, end=end_time)
	data["MA100"] = data["Close"].rolling(window=100).mean()
	data["MA50"] = data["Close"].rolling(window=50).mean()
 
	backtest_data = data.loc[pd.to_datetime(data.index).tz_localize(None) >= start_time]
	backtest_data["Invest"] = backtest_data["MA50"] >= backtest_data["MA100"] 
	backtest_data["Switch"] = backtest_data["Invest"].diff()
 
	switches = backtest_data.dropna()[backtest_data["Switch"] == True]
 
	profit = 0
	entered_price = float(backtest_data["Close"].values[0][0]) * volume
	invested = backtest_data["Invest"].values[1]
 
 
	for row in switches.itertuples():
		profit += (row[1] * volume) - entered_price if invested else entered_price - (row[1] * volume)
		invested = not invested
		entered_price = row[1] * volume

	final_close = float(backtest_data["Close"].values[len(backtest_data["Close"]) - 1][0]) * volume
	profit += (final_close * volume) - entered_price if invested else entered_price - (final_close * volume)
 
	return (report, profit)