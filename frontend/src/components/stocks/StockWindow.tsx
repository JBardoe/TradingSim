interface StockWindowProps {
	name: string;
}

const StockWindow = ({ name }: StockWindowProps) => {
	return <div>{name}</div>;
};

export default StockWindow;
