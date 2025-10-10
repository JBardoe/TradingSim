import { useEffect, useRef, useState } from "react";
import useAuthenticated from "../components/hooks/useAuthenticated";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import TrackedStocksMenu from "../components/home/TrackedStocksMenu";
import StrategiesMenu from "../components/home/StrategiesMenu";

const Home = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [rightWidth, setRightWidth] = useState(window.innerWidth * 0.25);
	const [topHeight, setTopHeight] = useState(window.innerHeight * (2 / 3));
	const [isDraggingVertical, setIsDraggingVertical] = useState(false);
	const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
	const navigate = useNavigate();
	const { authenticated, email } = useAuthenticated();

	const startVerticalDrag = () => setIsDraggingVertical(true);
	const startHorizontalDrag = () => setIsDraggingHorizontal(true);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDraggingHorizontal) {
				setRightWidth(window.innerWidth - e.clientX);
			}
			if (isDraggingVertical && containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const offsetY = e.clientY - rect.top;
				setTopHeight(offsetY);
			}
		};

		const stopDrag = () => {
			setIsDraggingHorizontal(false);
			setIsDraggingVertical(false);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", stopDrag);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", stopDrag);
		};
	}, [isDraggingHorizontal, isDraggingVertical]);

	if (!authenticated) return null;

	return (
		<>
			<TopBar email={email} home={true} />
			<div
				ref={containerRef}
				className="flex h-[94vh] w-screen bg-white dark:bg-gray-900"
			>
				<div
					style={{ width: `calc(100% - ${rightWidth}px)` }}
					className="flex flex-col"
				>
					<div
						style={{ height: `${topHeight}px` }}
						className="overflow-auto bg-gray-50 dark:bg-gray-900 p-4"
					>
						<TrackedStocksMenu />
						<button
							style={{
								right: `calc(4% + ${rightWidth}px)`,
								bottom: `calc(95% - ${topHeight}px)`,
							}}
							className="text-white rounded-full absolute cursor-pointer bg-indigo-600 hover:bg-indigo-800 active:bg-indigo-950 dark:bg-indigo-500 dark:hover:bg-indigo-700 dark:active:bg-indigo-900 text-4xl font-bold px-[0.7%] pb-[0.4%] hover:scale-[110%] active:scale-[97%]"
							onClick={() => navigate("/allStocks")}
						>
							+
						</button>
					</div>

					<div
						onMouseDown={startVerticalDrag}
						className="h-1 bg-gray-300 dark:bg-gray-600 cursor-row-resize hover:bg-gray-400 dark:hover:bg-gray-500"
					/>

					<div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
						<StrategiesMenu />
					</div>
				</div>

				<div
					onMouseDown={startHorizontalDrag}
					className="w-1 bg-gray-300 dark:bg-gray-700 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-500"
				/>

				<div
					style={{ width: `${rightWidth}px` }}
					className="overflow-auto bg-gray-200 dark:bg-gray-800 p-4"
				>
					<p>Performance Stats</p>
				</div>
			</div>
		</>
	);
};

export default Home;
