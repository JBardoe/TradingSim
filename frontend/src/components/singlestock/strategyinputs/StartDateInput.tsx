import { useState, useEffect } from "react";

interface StartDateInputProps {
	interval: string;
	setStart: (timestamp: number) => void;
}

export const StartDateInput = ({ interval, setStart }: StartDateInputProps) => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("00:00");

	const now = new Date();
	const todayISO = now.toISOString().split("T")[0];

	const minDate = (() => {
		const d = new Date(now);
		if (interval === "minute") d.setDate(d.getDate() - 7);
		else d.setFullYear(d.getFullYear() - 10);
		return d.toISOString().split("T")[0];
	})();

	useEffect(() => {
		if (!date) return;

		let selectedDateTime: Date;
		if (interval === "minute") {
			selectedDateTime = new Date(`${date}T${time}:00`);
		} else {
			selectedDateTime = new Date(`${date}T00:00:00`);
		}

		const timestamp = Math.floor(
			Math.min(selectedDateTime.getTime(), now.getTime()) / 1000
		);

		setStart(timestamp);
	}, [date, time, interval]);

	const maxTime = (() => {
		if (date !== todayISO) return "23:59";
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		return `${hours}:${minutes}`;
	})();

	return (
		<div className="flex flex-col gap-2">
			<label className="text-center">
				Start {interval === "minute" ? "Date & Time" : "Date"}:
			</label>

			<div className="flex flex-row justify-center gap-3 items-center">
				<input
					type="date"
					value={date}
					min={minDate}
					max={todayISO}
					onChange={(e) => setDate(e.target.value)}
					className="border rounded-lg px-3 py-1.5 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-200 dark:bg-gray-600 cursor-pointer"
				/>
				{interval === "minute" && (
					<input
						type="time"
						value={time}
						max={maxTime}
						onChange={(e) => setTime(e.target.value)}
						className="border rounded-lg px-3 py-1.5 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-200 dark:bg-gray-600 cursor-pointer"
					/>
				)}
			</div>

			<p className="text-xs">
				{interval === "minute"
					? "Select a time within the past 7 days (minute-level data)."
					: "Select a date within the past 10 years (daily data)."}
			</p>
		</div>
	);
};

export default StartDateInput;
