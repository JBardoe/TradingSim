import type { JSX } from "react";
import TrendFollowingInputs from "./strategyinputs/TrendFollowingInputs";
import MeanReversionInputs from "./strategyinputs/MeanReversionInputs";
import MomentumInputs from "./strategyinputs/MomentumInputs";

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
	inputs.set("Momentum Trading", <MomentumInputs setOptions={setOptions} />);

	return <div>{inputs.get(strategy)}</div>;
};

export default StrategyInput;
