import axios from "axios";
import { useEffect, useState } from "react";
import StockWindowGraph from "../utils/StockWindowGraph";

interface DataOutputProps {
	stockCode?: string;
}

const DataOutput = ({ stockCode }: DataOutputProps) => {
	const [dayInterval, setDayInterval] = useState(true);
	const [data, setData] = useState<{ value: number; time: number }[] | null>(
		[]
	);
	const [fiftyAvg, setFiftyAvg] = useState(0);
	const [hundredAvg, setHundredAvg] = useState(0);

	useEffect(() => {
		if (!stockCode) return;
		axios
			.post(
				"http://localhost:5000/api/getStockWindowGraph",
				{
					code: stockCode,
					period: dayInterval ? "6mo" : "1d",
					interval: dayInterval ? "1d" : "1m",
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				setData(res.data);
			})
			.catch((err) => console.error(err));

		axios
			.post(
				"http://localhost:5000/api/getStockAverages",
				{
					code: stockCode,
					dayInterval: dayInterval,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				setFiftyAvg(res.data.fifty);
				setHundredAvg(res.data.hundred);
			})
			.catch((err) => console.error(err));
	}, [setData, dayInterval, setFiftyAvg, setHundredAvg, stockCode]);

	if (!stockCode) return null;

	return (
		<>
			<div className="w-full flex flex-row justify-center gap-10">
				<button
					className={
						(dayInterval
							? "bg-gray-500 dark:bg-gray-950 font-bold "
							: "bg-gray-300 dark:bg-gray-700 cursor-pointer ") +
						"w-[20%] py-1 rounded-lg text-xl"
					}
					onClick={() => {
						setDayInterval(true);
						setData([]);
					}}
				>
					Day
				</button>
				<button
					className={
						(!dayInterval
							? "bg-gray-500 dark:bg-gray-950 font-bold "
							: "bg-gray-300 dark:bg-gray-700 cursor-pointer ") +
						"w-[20%] py-1 rounded-lg text-xl"
					}
					onClick={() => {
						setDayInterval(false);
						setData([]);
					}}
				>
					Minute
				</button>
			</div>
			<div className="w-full h-full flex flex-col items-center pl-5 gap-5">
				{data ? (
					<StockWindowGraph data={data} dayInterval={dayInterval} />
				) : (
					<span className="opacity-70 font-semibold">
						Loading Graph...
					</span>
				)}
				{fiftyAvg ? (
					<h2 className="text-center font-semibold text-2xl">
						Fifty {dayInterval ? "Day" : "Minute"} Average:{" "}
						{fiftyAvg.toFixed(2)}
					</h2>
				) : (
					<h2 className="text-center font-semibold text-2xl">
						Cannot calculate fifty {dayInterval ? "day" : "minute"}{" "}
						average.
					</h2>
				)}
				{hundredAvg ? (
					<h2 className="text-center font-semibold text-2xl">
						Hundred {dayInterval ? "Day" : "Minute"} Average:{" "}
						{hundredAvg.toFixed(2)}
					</h2>
				) : (
					<h2 className="text-center font-semibold text-2xl">
						Cannot calculate hundred{" "}
						{dayInterval ? "day" : "minute"} average.
					</h2>
				)}
			</div>
		</>
	);
};

export default DataOutput;
