import axios from "axios";
import { useEffect, useState } from "react";

const StrategiesMenu = () => {
	const [strategies, setStrategies] = useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/getAlgorithms")
			.then((res) => {
				setStrategies(res.data.algorithms);
			})
			.catch((err) => console.error(err));
	}, [setStrategies]);

	return (
		<div className="w-full h-full flex flex-row gap-5 flex-wrap">
			<h1 className="font-bold text-2xl w-full h-fit">
				Supported Strategies:
			</h1>
			{strategies.map((strategy) => {
				return (
					<div
						key={strategy}
						className="rounded-2xl p-5 h-fit bg-gray-300 dark:bg-gray-700 text-2xl font-semibold text-center"
					>
						{strategy}
					</div>
				);
			})}
		</div>
	);
};

export default StrategiesMenu;
