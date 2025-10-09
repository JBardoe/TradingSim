import StockMenu from "../components/stockhome/StockMenu";
import TopBar from "../components/TopBar";

const AllStocks = () => {
	return (
		<>
			<TopBar home={false} />
			<StockMenu />
		</>
	);
};

export default AllStocks;
