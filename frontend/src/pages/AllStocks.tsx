import StockMenu from "../components/stockhome/StockMenu";
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
