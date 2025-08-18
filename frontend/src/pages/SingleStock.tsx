import { useParams } from "react-router-dom";

const SingleStock = () => {
	const { stockCode } = useParams<{ stockCode: string }>();

	return <div>{stockCode}</div>;
};

export default SingleStock;
