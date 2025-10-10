interface StrategyOutputProps {
	error: boolean;
	report: string[];
	result: number;
}

const StrategyOutput = ({ error, report, result }: StrategyOutputProps) => {
	console.log(report);
	return (
		<div className="w-full h-fit bg-gray-300 dark:bg-gray-700 rounded-xl">
			<h1 className="text-center text-2xl font-bold">Output:</h1>
			{error ? (
				<p className="text-red-500 text-center text-lg">
					An unexpected error has occurred. <br />
					Please try again.
				</p>
			) : (
				<>
					{report.length <= 5 ? (
						report.map((line, index) => {
							return (
								<p className="text-center text-md" key={index}>
									{line}
								</p>
							);
						})
					) : (
						<p className="text-center text-md">
							{report[0]} <br />
							{report[1]} <br />
							<span className="text-3xl">• • •</span> <br />
							{report[report.length - 2]} <br />
							{report[report.length - 1]} <br />
						</p>
					)}
					<br />
					<p className="text-center text-lg font-semibold">
						Total Profit: £{result.toFixed(2)}
					</p>
				</>
			)}
		</div>
	);
};

export default StrategyOutput;
