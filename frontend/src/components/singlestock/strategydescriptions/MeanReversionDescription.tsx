const MeanReversionDescription = () => {
	return (
		<div>
			<div>
				<h2 className="text-center font-semibold text-lg">
					Mean Reversion
				</h2>
				<p className="text-center text-md">
					Mean Price - Current Price {">"} Threshold {"=>"} Long
					<br />
					Current Price - Mean Price {">"} Threshold {"=>"} Short
					<br />
					|Current Price - Mean Price| {"<"} Threshold {"=>"} Revert
				</p>
			</div>
		</div>
	);
};

export default MeanReversionDescription;
