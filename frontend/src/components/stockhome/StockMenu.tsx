import { useState } from "react";
import StockPanel from "./StockPanel";
import StockWindow from "./StockWindow";

const usedStocks = [
	"AAPL",
	"AMZN",
	"GOOGL",
	"JNJ",
	"JPM",
	"NVDA",
	"META",
	"MSFT",
	"TSLA",
	"XOM",
];

usedStocks.sort();

const StockMenu = () => {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(0);
	const [windowOpen, setWindowOpen] = useState<string | null>(null);

	const options = [
		{
			value: "alpha",
			label: "Alphabetical",
			sort: () => usedStocks.sort(),
		},
		{
			value: "reverse-alpha",
			label: "Reverse Alphabetical",
			sort: () => {
				usedStocks.sort();
				usedStocks.reverse();
			},
		},
	];

	const onSelect = (index: number) => {
		setSelected(index);
	};

	const handleOpenWindow = (name: string) => {
		setWindowOpen(name);
	};

	const onClose = () => {
		setWindowOpen(null);
	};

	return (
		<>
			{windowOpen && <StockWindow name={windowOpen} onClose={onClose} />}
			<div className="w-full flex flex-col items-center mt-8">
				<div className="relative inline-block text-left">
					Order By:
					<button
						onClick={() => setOpen((prev) => !prev)}
						className="px-4 py-2 rounded-2xl cursor-pointer bg-gray-300 hover:bg-indigo-400 dark:bg-gray-800 dark:hover:bg-indigo-600 transition ml-2"
					>
						{options[selected].label}{" "}
						<span className="opacity-20 ml-2">\/</span>
					</button>
					{open && (
						<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
							<div className="py-1">
								{options.map((opt, index) => (
									<button
										key={opt.value}
										onClick={() => {
											onSelect(index);
											setOpen(false);
											opt.sort();
										}}
										className="block w-full text-left px-4 py-2 text-sm cursor-pointer bg-white hover:bg-indigo-400 dark:bg-gray-800 dark:hover:bg-indigo-600"
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="w-full h-full flex flex-wrap p-10 gap-x-15 gap-y-15 justify-center">
				{usedStocks.map((value) => {
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

export default StockMenu;
