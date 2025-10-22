import type { JSX } from "react";
import TrendFollowingInputs from "./strategyinputs/TrendFollowingInputs";
import MeanReversionInputs from "./strategyinputs/MeanReversionInputs";

interface StrategyInputProps {
	strategy: string;
	setOptions: React.Dispatch<React.SetStateAction<any>>;
}

const StrategyInput = ({ strategy, setOptions }: StrategyInputProps) => {
	let inputs = new Map<string, JSX.Element>();
	inputs.set(
		"Trend Following",
		<TrendFollowingInputs setOptions={setOptions} />
	);
	inputs.set(
		"Mean Reversion",
		<MeanReversionInputs setOptions={setOptions} />
	);

	return <div>{inputs.get(strategy)}</div>;
};

export default StrategyInput;
