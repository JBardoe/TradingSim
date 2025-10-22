const TrendFollowingDescription = () => {
	return (
		<div>
			<h2 className="text-center font-semibold text-lg">
				Trend Following
			</h2>
			<p className="text-center text-md">
				50 avg {">"} 100 avg {"=>"} Long
				<br />
				50 avg {"<"} 100 avg {"=>"} Sell/Short
			</p>
		</div>
	);
};

export default TrendFollowingDescription;
