import useAuthenticated from "../components/hooks/useAuthenticated";
import StockMenu from "../components/stockhome/StockMenu";
import TopBar from "../components/TopBar";

const AllStocks = () => {
	const { authenticated, email } = useAuthenticated();

	if (!authenticated) return null;

	return (
		<>
			<TopBar email={email} home={false} />
			<StockMenu />
		</>
	);
};

export default AllStocks;
