import { useEffect, useState } from "react";
import StartDateInput from "./StartDateInput";
import EndDateInput from "./EndDateInput";

interface MomentumInputsInputProps {
	setOptions: React.Dispatch<React.SetStateAction<any>>;
}

const MomentumInputs = ({ setOptions }: MomentumInputsInputProps) => {
	const [start, setStart] = useState(0);
	const [interval, setInterval] = useState("day");
	const [threshold, setThreshold] = useState(0.02);
	const [lookback, setLookback] = useState(20);
	const [end, setEnd] = useState<number | null>(null);

	useEffect(() => {
		if (end) {
			setOptions({
				start: start,
				interval: interval,
				end: end,
				threshold: threshold,
				lookback: lookback,
			});
		} else {
			setOptions({
				start: start,
				interval: interval,
				threshold: threshold,
				lookback: lookback,
			});
		}
	}, [start, interval]);

	return (
		<div className="w-full h-fit flex flex-col items-center bg-gray-300 dark:bg-gray-700 rounded-xl p-3 gap-3">
			<div className="inline-flex items-center gap-2">
				<label
					htmlFor="switch-component-on"
					className="text-md cursor-pointer"
				>
					Day
				</label>

				<div className="relative inline-block w-11 h-5">
					<input
						id="switch-component-on"
						type="checkbox"
						checked={interval == "minute"}
						className="peer appearance-none w-11 h-5 bg-blue-500 rounded-full checked:bg-green-500 cursor-pointer transition-colors duration-300"
						onClick={() => {
							setInterval(interval == "day" ? "minute" : "day");
						}}
						onChange={() => {}}
					/>
					<label
						htmlFor="switch-component-on"
						className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
					></label>
				</div>

				<label
					htmlFor="switch-component-on"
					className="text-white text-md cursor-pointer"
				>
					Minute
				</label>
			</div>
			<div className="flex flex-col items-center">
				<label
					htmlFor="threshold"
					className="text-white text-md text-center"
				>
					Set Threshold:
				</label>
				<input
					type="number"
					id="set-threshold"
					min="0.01"
					max="0.1"
					step="0.1"
					value={threshold}
					className="border rounded-lg px-1 py-0.5 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-200 dark:bg-gray-600 ml-2 text-center"
					onChange={(e) => {
						setThreshold(
							Math.max(
								Math.min(parseFloat(e.target.value), 0.1),
								0.01
							)
						);
					}}
				/>

				<label
					htmlFor="set-lookback"
					className="text-white text-md text-center mt-3"
				>
					Set Lookback:
				</label>
				<input
					type="number"
					id="set-lookback"
					min="5"
					max={interval == "day" ? "200" : "300"}
					step="0.1"
					value={lookback}
					className="border rounded-lg px-1 py-0.5 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-200 dark:bg-gray-600 ml-2 text-center"
					onChange={(e) => {
						setLookback(
							Math.max(
								Math.min(
									parseFloat(e.target.value),
									interval == "day" ? 200 : 300
								),
								5
							)
						);
					}}
				/>
			</div>
			<StartDateInput interval={interval} setStart={setStart} />
			<EndDateInput interval={interval} start={start} setEnd={setEnd} />
		</div>
	);
};

export default MomentumInputs;
