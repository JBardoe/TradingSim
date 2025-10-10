import type { JSX } from "react";
import TrendFollowingInputs from "./strategyinputs/TrendFollowingInputs";

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

	return <div>{inputs.get(strategy)}</div>;
};

export default StrategyInput;
