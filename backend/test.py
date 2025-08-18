import yfinance as yf
from datetime import datetime

day = True

interval = "1d" if day else "1m"
period = "6mo" if day else "1d"

data = yf.download("AAPL", interval="1m", period="1d")["Close"]

formatted= []
for row in data.itertuples():
	formatted.append({"value": row[1], "time":row[0].timestamp()})

print(formatted)