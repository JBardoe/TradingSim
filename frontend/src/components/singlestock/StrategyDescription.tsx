interface StrategyDescriptionProps {
	strategy: string;
}

const StrategyDescription = ({ strategy }: StrategyDescriptionProps) => {
	return (
		<div className="w-full h-fit bg-gray-300 dark:bg-gray-700 p-3 rounded-xl">
			<h2 className="text-center font-semibold text-lg">{strategy}</h2>
			<p className="text-center text-md">
				50 avg {">"} 100 avg {"=>"} Long
				<br />
				50 avg {"<"} 100 avg {"=>"} Sell/Short
			</p>
		</div>
	);
};

export default StrategyDescription;
