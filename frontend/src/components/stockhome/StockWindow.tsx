import { useEffect, useState } from "react";
import StockWindowGraph from "./StockWindowGraph";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface StockWindowProps {
	name: string;
	onClose: () => void;
}

const StockWindow = ({ name, onClose }: StockWindowProps) => {
	const [dayInterval, setDayInterval] = useState(true);
	const [data, setData] = useState<{ value: number; time: number }[] | null>(
		[]
	);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.post(
				"http://localhost:5000/api/getStockWindowGraph",
				{
					code: name,
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
	}, [setData, dayInterval]);

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<>
			<div
				className="fixed w-[100vw] h-[100h] bg-black opacity-70 inset-0"
				onClick={onClose}
			/>
			<div
				className="fixed inset-0 flex items-center justify-center z-50"
				onClick={onClose}
			>
				<div
					className="bg-white dark:bg-gray-900 rounded-lg px-6 py-[3%] shadow-lg relative w-[70vw] h-[80vh] hit-fit opacity-100 flex flex-col items-center"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						className="absolute top-1 right-3 text-gray-500 hover:text-black text-xl cursor-pointer"
						onClick={onClose}
						aria-label="Close menu"
					>
						×
					</button>
					<span className="font-bold text-2xl absolute top-3 left-3">
						{name}
					</span>
					<button
						className={
							(dayInterval
								? "bg-gray-500 dark:bg-gray-950 font-bold "
								: "bg-gray-300 dark:bg-gray-700 cursor-pointer ") +
							"absolute top-3 left-[30%] px-20 py-3 rounded-lg text-xl"
						}
						onClick={() => setDayInterval(true)}
					>
						Day
					</button>
					<button
						className={
							(!dayInterval
								? "bg-gray-500 dark:bg-gray-950 font-bold "
								: "bg-gray-300 dark:bg-gray-700 cursor-pointer ") +
							"absolute top-3 left-[60%] px-20 py-3 rounded-lg text-xl"
						}
						onClick={() => setDayInterval(false)}
					>
						Minute
					</button>
					<img
						src="../../public/newTab.png"
						onClick={() => {
							navigate(`/singleStock/${name}`);
						}}
						className="w-12 absolute right-[4%] top-2 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
					/>
					{data ? (
						<StockWindowGraph
							data={data}
							dayInterval={dayInterval}
						/>
					) : (
						<span className="opacity-70 font-semibold">
							Loading Graph...
						</span>
					)}
				</div>
			</div>
		</>
	);
};

export default StockWindow;
