import { useEffect, useState } from "react";
import StartDateInput from "./StartDateInput";
import EndDateInput from "./EndDateInput";

interface TrendFollowingInputProps {
	setOptions: React.Dispatch<React.SetStateAction<any>>;
}

const TrendFollowingInputs = ({ setOptions }: TrendFollowingInputProps) => {
	const [start, setStart] = useState(0);
	const [interval, setInterval] = useState("day");
	const [short, setShort] = useState(true);
	const [end, setEnd] = useState<number | null>(null);

	useEffect(() => {
		if (end) {
			setOptions({
				start: start,
				interval: interval,
				short: short,
				end: end,
			});
		} else {
			setOptions({
				start: start,
				interval: interval,
				short: short,
			});
		}
	}, [start, interval, short]);

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
			<div className="flex items-center">
				<input
					checked={short}
					id="checked-checkbox"
					type="checkbox"
					value=""
					className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
					onClick={() => {
						setShort(!short);
					}}
					onChange={() => {}}
				/>
				<label
					htmlFor="checked-checkbox"
					className="ms-2 text-md cursor-pointer"
				>
					Short When 50 Avg {"<"} 100 Avg
				</label>
			</div>
			<StartDateInput interval={interval} setStart={setStart} />
			<EndDateInput interval={interval} start={start} setEnd={setEnd} />
		</div>
	);
};

export default TrendFollowingInputs;
