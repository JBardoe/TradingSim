import axios from "axios";
import { useState } from "react";

interface RunButtonProps {
	strategy: string;
	stockCode: string;
	dayInterval: boolean;
	startTime: number;
	setReport: React.Dispatch<React.SetStateAction<never[]>>;
	setResult: React.Dispatch<React.SetStateAction<number>>;
	setError: React.Dispatch<React.SetStateAction<boolean>>;
}

const RunButton = ({
	strategy,
	stockCode,
	dayInterval,
	startTime,
	setReport,
	setResult,
	setError,
}: RunButtonProps) => {
	const [blocked, setBlocked] = useState(false);

	const runStrategy = () => {
		axios
			.post(
				"http://localhost:5000/api/runAlgorithm",
				{
					code: stockCode,
					strategy: strategy,
					interval: dayInterval ? "day" : "minute",
					start: startTime,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setBlocked(false);
				if (!res.data || !res.data.report || !res.data.result) {
					setError(true);
					return;
				}
				setReport(res.data.report);
				setResult(res.data.result);
			})
			.catch((err) => {
				console.error(err);
				setBlocked(false);
			});
	};

	return (
		<button
			onClick={() => {
				setError(false);
				setBlocked(true);
				runStrategy();
			}}
			className={`rounded-full font-bold text-white ${
				blocked
					? "bg-red-500 cursor-not-allowed"
					: "bg-green-500 hover:bg-green-600 active:bg-green-700 hover:scale-[105%] active:scale-[97%] cursor-pointer"
			} py-3 w-[40%] text-2xl`}
			disabled={blocked}
		>
			{blocked ? "Running..." : "Run"}
		</button>
	);
};

export default RunButton;
