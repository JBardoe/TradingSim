import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TrackingToggle from "../components/singlestock/TrackingToggle";
import TopBar from "../components/TopBar";
import DataOutput from "../components/singlestock/DataOutput";

const SingleStock = () => {
	const { stockCode } = useParams<{ stockCode: string }>();
	const [tracked, setTracked] = useState(false);

	useEffect(() => {
		axios
			.post(
				"http://localhost:5000/api/getTrackedStocks",
				{
					code: stockCode,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (!res.data || !res.data.tracked) {
					return;
				}
				setTracked(res.data.tracked);
			})
			.catch((err) => console.error(err));
	}, [setTracked]);

	return (
		<>
			<TopBar home={false} />
			<div className="w-full h-full">
				<h1 className="text-center font-bold text-4xl mt-5">
					{stockCode}
				</h1>
				<Link
					to="/allStocks"
					className="text-xl font-semibold absolute top-14 right-5"
				>
					To All Stocks
				</Link>
				<div className="w-full h-full flex flex-row">
					<div className="w-[50%] h-fit">
						<DataOutput stockCode={stockCode} />
					</div>
					<div className="w-[50%] h-fit"></div>
				</div>
			</div>
			<TrackingToggle
				tracked={tracked}
				setTracked={setTracked}
				code={stockCode}
			/>
		</>
	);
};

export default SingleStock;
