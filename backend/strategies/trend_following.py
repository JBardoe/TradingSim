import yfinance as yf
import pandas as pd
from datetime import timedelta, datetime

def long_trend_following(stock_code, interval, start_time, end_time=datetime.now(), volume=1):
	report = []

	match interval:
		case "day": 
			interval = "1d"
			period = start_time - timedelta(days=150)
			time_fmt = "%d/%m/%y"
		case "minute": 
			interval = "1m"
			period = start_time - timedelta(days=5)
			time_fmt = "%d/%m-%H:%M"
		case _:
			raise ValueError("Interval must be 'day' or 'minute'") 

	data = yf.download(stock_code, interval=interval, start=period, end=end_time)
	if data.empty:
		return (["No data available."], 0.0)

	if isinstance(data.columns[0], tuple):
		data.columns = [col[0].lower() for col in data.columns]
	else:
		data.columns = [str(col).lower() for col in data.columns]

	data["ma100"] = data["close"].rolling(window=100).mean()
	data["ma50"] = data["close"].rolling(window=50).mean()

	index = pd.to_datetime(data.index)
	if index.tz is not None:
		index = index.tz_localize(None)
	data.index = index

	backtest_data = data.loc[index >= start_time].copy()
	backtest_data["Invest"] = backtest_data["ma50"] >= backtest_data["ma100"] 
	backtest_data["Switch"] = backtest_data["Invest"].ne(backtest_data["Invest"].shift())

	switches = backtest_data[backtest_data["Switch"]]
	if switches.empty:
		return (["No purchases necessary."], 0.0) 

	profit = 0.0
	invested = bool(backtest_data["Invest"].iloc[0])
	entered_price = float(backtest_data["close"].iloc[0])

	for row in switches.itertuples():
		price = getattr(row, "close")
		if invested:
			profit += price - entered_price
			report.append(f"Time: {row.Index.strftime(time_fmt)}, Action: SELL, Price: £{round(price,2)}, Profit: {round(profit,2)}")
		else:
			report.append(f"Time: {row.Index.strftime(time_fmt)}, Action: BUY, Price: {round(price,2)}, Profit: {round(profit,2)}")
		invested = not invested
		entered_price = price

	final_close = float(backtest_data["close"].iloc[-1])
	final_time = backtest_data.index[-1]
	if invested:
		profit += final_close - entered_price

	profit *= volume
	report.append(f"Time: {final_time.strftime(time_fmt)}, Action: END, Price: {round(final_close,2)}, Profit: {round(profit,2)}")

	return (report, profit)

def trend_following(stock_code, interval, start_time, end_time=datetime.now(), volume=1):
	report = []

	match interval:
		case "day":
			interval = "1d"
			period = start_time - timedelta(days=150)
			time_fmt = "%d/%m/%y"
		case "minute":
			interval = "1m"
			period = start_time - timedelta(days=5)
			time_fmt = "%d/%m-%H:%M"
		case _:
			raise ValueError("Interval must be 'day' or 'minute'")

	data = yf.download(stock_code, interval=interval, start=period, end=end_time)
	if data.empty:
		return ([], 0.0)

	if isinstance(data.columns[0], tuple):
		data.columns = [col[0].lower() for col in data.columns]
	else:
		data.columns = [str(col).lower() for col in data.columns]

	data["ma100"] = data["close"].rolling(window=100).mean()
	data["ma50"] = data["close"].rolling(window=50).mean()

	index = pd.to_datetime(data.index)
	if index.tz is not None:
		index = index.tz_localize(None)
	data.index = index

	backtest_data = data.loc[index >= start_time].copy()

	backtest_data["Position"] = (backtest_data["ma50"] >= backtest_data["ma100"]).astype(int) * 2 - 1

	backtest_data["Switch"] = backtest_data["Position"].ne(backtest_data["Position"].shift())

	switches = backtest_data[backtest_data["Switch"]]
	if switches.empty:
		return ([], 0.0)

	profit = 0.0
	position = int(backtest_data["Position"].iloc[0])
	entry_price = float(backtest_data["close"].iloc[0])

	for row in switches.itertuples():
		price = getattr(row, "close")
		profit += (price - entry_price) * position
		report.append(f"Time: {row.Index.strftime(time_fmt)}, Action: " + ("BUY" if row.Position == 1 else "SHORT") + f", Price: {round(price,2)}, Profit: {round(profit,2)}")
		position = row.Position
		entry_price = price

	final_close = float(backtest_data["close"].iloc[-1])
	final_time = backtest_data.index[-1]
	profit += (final_close - entry_price) * position
	profit *= volume

	report.append(f"Time: {final_time.strftime(time_fmt)}, Action: END, Price: {round(final_close,2)}, Profit: {round(profit,2)}")

	return (report, profit)