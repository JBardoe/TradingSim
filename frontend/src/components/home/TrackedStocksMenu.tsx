import axios from "axios";
import { useEffect, useState } from "react";
import StockPanel from "../stockhome/StockPanel";
import StockWindow from "../stockhome/StockWindow";

const TrackedStocksMenu = () => {
	const [trackedStocks, setTrackedStocks] = useState([]);
	const [windowOpen, setWindowOpen] = useState<string | null>(null);

	useEffect(() => {
		axios
			.post(
				"http://localhost:5000/api/getTrackedStocks",
				{},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (res.data.stocks) {
					setTrackedStocks(res.data.stocks);
				}
			})
			.catch((err) => console.error(err));
	}, [setTrackedStocks]);

	const handleOpenWindow = (name: string) => {
		setWindowOpen(name);
	};

	const onClose = () => {
		setWindowOpen(null);
	};

	return (
		<>
			{windowOpen && <StockWindow name={windowOpen} onClose={onClose} />}
			<div className="w-full h-full flex flex-wrap p-10 gap-x-15 gap-y-15 justify-center">
				{trackedStocks.map((value) => {
					return (
						<StockPanel
							name={value}
							key={value}
							handleOpenWindow={handleOpenWindow}
						/>
					);
				})}
			</div>
		</>
	);
};

export default TrackedStocksMenu;
