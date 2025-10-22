import type { JSX } from "react";
import TrendFollowingDescription from "./strategydescriptions/TrendFollowingDescription";
import MeanReversionDescription from "./strategydescriptions/MeanReversionDescription";

interface StrategyDescriptionProps {
	strategy: string;
}

const StrategyDescription = ({ strategy }: StrategyDescriptionProps) => {
	let inputs = new Map<string, JSX.Element>();
	inputs.set("Trend Following", <TrendFollowingDescription />);
	inputs.set("Mean Reversion", <MeanReversionDescription />);

	return (
		<div className="w-full h-fit bg-gray-300 dark:bg-gray-700 p-3 rounded-xl">
			{inputs.get(strategy)}
		</div>
	);
};

export default StrategyDescription;
