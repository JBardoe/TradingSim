import { useState, useEffect } from "react";

interface EndDateInputProps {
	interval: string;
	start: number;
	setEnd: (timestamp: number | null) => void;
}

export const EndDateInput = ({
	interval,
	start,
	setEnd,
}: EndDateInputProps) => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("00:00");
	const [useCustomEnd, setUseCustomEnd] = useState(false);

	const now = new Date();
	const nowISO = now.toISOString().split("T")[0];

	const startDate = new Date(start * 1000);
	const startISO = startDate.toISOString().split("T")[0];

	useEffect(() => {
		if (!useCustomEnd) {
			setEnd(null);
			return;
		}
		if (!date) return;

		let selectedDateTime: Date;
		if (interval === "minute") {
			selectedDateTime = new Date(`${date}T${time}:00`);
		} else {
			selectedDateTime = new Date(`${date}T00:00:00`);
		}

		const clamped = new Date(
			Math.min(
				Math.max(selectedDateTime.getTime(), startDate.getTime()),
				now.getTime()
			)
		);
		setEnd(Math.floor(clamped.getTime() / 1000));
	}, [date, time, useCustomEnd, interval]);

	const maxTime = (() => {
		const isToday = date === nowISO;
		if (!isToday) return "23:59";
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		return `${hours}:${minutes}`;
	})();

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					id="customEnd"
					checked={useCustomEnd}
					onChange={(e) => setUseCustomEnd(e.target.checked)}
					className="w-4 h-4 accent-blue-500 cursor-pointer"
				/>
				<label htmlFor="customEnd" className="cursor-pointer">
					Custom end time?
				</label>
			</div>

			{useCustomEnd && (
				<div className="flex gap-3 items-center">
					<input
						type="date"
						value={date}
						min={startISO}
						max={nowISO}
						onChange={(e) => setDate(e.target.value)}
						className="border rounded-lg px-3 py-1.5 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-200 dark:bg-gray-600"
					/>
					{interval === "minute" && (
						<input
							type="time"
							value={time}
							max={maxTime}
							onChange={(e) => setTime(e.target.value)}
							className="border rounded-lg px-3 py-1.5 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 bg-gray-200 dark:bg-gray-600"
							disabled={!date}
						/>
					)}
				</div>
			)}

			{useCustomEnd && (
				<p className="text-xs">
					End date/time must be after the start and not later than the
					current time.
				</p>
			)}
		</div>
	);
};

export default EndDateInput;
