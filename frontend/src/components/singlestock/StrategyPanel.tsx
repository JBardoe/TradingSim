import axios from "axios";
import { useEffect, useState } from "react";
import StrategyDescription from "./StrategyDescription";
import RunButton from "./RunButton";
import StrategyOutput from "./StrategyOutput";
import StrategyInput from "./StrategyInput";

interface StrategyPanelProps {
	stockCode: string;
}

const StrategyPanel = ({ stockCode }: StrategyPanelProps) => {
	const [open, setOpen] = useState(false);
	const [strategies, setStrategies] = useState([]);
	const [selected, setSelected] = useState(0);
	const [report, setReport] = useState<string[]>([]);
	const [result, setResult] = useState(0);
	const [error, setError] = useState(false);
	const [options, setOptions] = useState(null);

	useEffect(() => {
		axios
			.get("http://localhost:5000/api/getAlgorithms")
			.then((res) => {
				setStrategies(res.data.algorithms);
			})
			.catch((err) => console.error(err));
	}, [setStrategies]);

	return (
		strategies.length > 0 && (
			<div className="w-full h-fit">
				<div className="w-full flex flex-col items-center mt-8">
					<div className="relative inline-block text-left">
						<button
							onClick={() => setOpen((prev) => !prev)}
							className="px-4 py-2 rounded-2xl cursor-pointer bg-gray-300 hover:bg-indigo-400 dark:bg-gray-800 dark:hover:bg-indigo-600 transition ml-2"
						>
							{strategies[selected]}{" "}
							<span className="opacity-20 ml-2">\/</span>
						</button>
						{open && (
							<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
								<div className="py-1">
									{strategies.map((strat, index) => (
										<button
											key={strat}
											onClick={() => {
												setSelected(index);
												setOpen(false);
											}}
											className={`block w-full text-center px-4 py-2 text-md cursor-pointer bg-white hover:bg-indigo-400 dark:bg-gray-800 dark:hover:bg-indigo-600 ${
												selected == index &&
												"font-semibold"
											}`}
										>
											{strat}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="w-full h-fit p-10 pt-6">
					<StrategyDescription strategy={strategies[selected]} />
				</div>
				<div className="w-full h-fit p-10 pt-6">
					<StrategyInput
						strategy={strategies[selected]}
						setOptions={setOptions}
					/>
				</div>
				<div className="w-full h-fit flex flex-col items-center">
					<RunButton
						strategy={strategies[selected]}
						stockCode={stockCode}
						options={options}
						setError={setError}
						setReport={setReport}
						setResult={setResult}
					/>
				</div>
				{report.length > 0 && (
					<div className="w-full h-fit px-10 py-5">
						<StrategyOutput
							error={error}
							report={report}
							result={result}
						/>
					</div>
				)}
			</div>
		)
	);
};

export default StrategyPanel;
