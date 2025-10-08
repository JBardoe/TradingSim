import axios from "axios";
import { useState } from "react";

interface TrackingToggleProps {
	tracked: boolean;
	setTracked: React.Dispatch<React.SetStateAction<boolean>>;
	code?: string;
}

const TrackingToggle = ({ tracked, setTracked, code }: TrackingToggleProps) => {
	const [blocked, setBlocked] = useState(false);

	const toggleTracking = () => {
		if (!code) {
			return;
		}
		axios
			.post(
				`http://localhost:5000/api/${
					tracked ? "removeTrackedStock" : "addTrackedStock"
				}`,
				{ code: code },
				{
					withCredentials: true,
				}
			)
			.then((_) => {
				setBlocked(false);
				setTracked(!tracked);
			})
			.catch((err) => {
				console.error(err);
				setBlocked(false);
			});
	};

	if (!code) return null;

	return (
		<button
			className="text-white rounded-full fixed bottom-8 left-10 cursor-pointer bg-indigo-600 hover:bg-indigo-800 active:bg-indigo-950 dark:bg-indigo-500 dark:hover:bg-indigo-700 dark:active:bg-indigo-900 text-2xl font-bold px-[2%] py-[1%] hover:scale-[110%] active:scale-[97%]"
			onClick={() => {
				setBlocked(true);
				toggleTracking();
			}}
			disabled={blocked}
		>
			{tracked ? "Remove from Tracked" : "Add to Tracked"}
		</button>
	);
};

export default TrackingToggle;
