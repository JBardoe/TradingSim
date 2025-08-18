import { useEffect, useState } from "react";
import axios from "axios";

interface StockPanelProps {
	name: string;
	key: string;
	handleOpenWindow: (name: string) => void;
}

const StockPanel = ({ name, handleOpenWindow }: StockPanelProps) => {
	const [avg, setAvg] = useState<number | null>(null);
	const [curr, setCurr] = useState<number | null>(null);

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/getStockPanelData?stock=${name}`)
			.then((res) => {
				if (res.data.code !== name) {
					return;
				}
				setAvg(res.data.avg);
				setCurr(res.data.current);
			})
			.catch((err) => console.error(err));
	}, [setAvg, setCurr]);

	return (
		<div
			className="rounded-2xl w-75 h-70 bg-gray-400 dark:bg-gray-800 hover:scale-[115%] cursor-pointer p-4 flex flex-col text-center text-2xl"
			onClick={() => handleOpenWindow(name)}
		>
			<span className="text-3xl font-bold mb-2">{name}</span>
			{avg && curr ? (
				<>
					Running 100 Day Average: ${avg.toFixed(2)}
					<br />
					<br />
					Most Recent Close: ${curr.toFixed(2)}
				</>
			) : (
				<span className="opacity-65">Loading...</span>
			)}
		</div>
	);
};

export default StockPanel;
