import { useEffect, useRef, useState } from "react";
import useAuthenticated from "../components/hooks/useAuthenticated";
import LogoutButton from "../components/loginComponents/LogoutButton";

const Home = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [rightWidth, setRightWidth] = useState(window.innerWidth * 0.25);
	const [topHeight, setTopHeight] = useState(window.innerHeight * (2 / 3));
	const [isDraggingVertical, setIsDraggingVertical] = useState(false);
	const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);
	const { authenticated } = useAuthenticated();

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
			<div className="sticky top-0 w-full shadow-md shadow-gray-500 dark:shadow-black h-[6vh] dark:bg-gray-800 flex items-center px-[2vw] flex-row-reverse">
				{!accountMenuOpen && (
					<button
						onClick={() => setAccountMenuOpen(!accountMenuOpen)}
						className="cursor-pointer flex flex-row gap-3 w-fit"
					>
						<p className="font-semibold">user.mail.com</p>
						<img src="../public/user.png" className="w-5"></img>
					</button>
				)}
			</div>
			{accountMenuOpen && (
				<div className="fixed top-[1vh] right-[2vw] w-[20vw] rounded-2xl bg-gray-300 dark:bg-gray-600 p-[1%] flex flex-col items-center">
					<div>
						<div className="w-full flex flex-row justify-center gap-2">
							<p className="font-semibold">user.mail.com</p>
							<img src="../public/user.png" className="w-5"></img>
						</div>
						<button
							onClick={() => setAccountMenuOpen(!accountMenuOpen)}
							className="cursor-pointer absolute top-[2%] right-[4%]"
						>
							✕
						</button>
					</div>
					<hr className="w-full text-gray-400 rounded-full my-2" />
					<div>
						<LogoutButton />
					</div>
				</div>
			)}
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
						<p>Tracked Stocks</p>
					</div>

					<div
						onMouseDown={startVerticalDrag}
						className="h-1 bg-gray-300 dark:bg-gray-600 cursor-row-resize hover:bg-gray-400 dark:hover:bg-gray-500"
					/>

					<div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-4">
						<p>Used Strategies</p>
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
