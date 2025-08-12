import StockMenu from "../components/stocks/StockMenu";
import TopBar from "../components/TopBar";

const AllStocks = () => {
	return (
		<>
			<TopBar home={true} />
			<StockMenu />
		</>
	);
};

export default AllStocks;
