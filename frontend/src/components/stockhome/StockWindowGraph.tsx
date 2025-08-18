import {
	AreaSeries,
	createChart,
	ColorType,
	type AreaData,
	type Time,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

interface StockWindowGraphProps {
	data: { value: number; time: number }[];
	dayInterval: boolean;
}

export const StockWindowGraph = ({
	data,
	dayInterval,
}: StockWindowGraphProps) => {
	const chartContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!chartContainerRef.current) return;

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: "#000000" },
				textColor: "#ffffff",
			},
			width: chartContainerRef.current.clientWidth,
			height: 300,
			localization: {
				timeFormatter: (time: Time) => {
					const date = new Date((time as number) * 1000);
					if (dayInterval) {
						// Daily data → show Month + Day
						return date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						});
					} else {
						// Intraday → show Date + Time
						return date.toLocaleString("en-US", {
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						});
					}
				},
			},
		});

		const areaSeries = chart.addSeries(AreaSeries, {
			lineColor: dayInterval ? "#2196f3" : "#4caf50",
			topColor: "#000000",
			bottomColor: dayInterval ? "#59b0f6" : "#66bc69",
		});

		areaSeries.setData(data as AreaData<Time>[]);

		chart.timeScale().fitContent();

		const handleResize = () => {
			chart.applyOptions({
				width: chartContainerRef.current!.clientWidth,
			});
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			chart.remove();
		};
	}, [data, dayInterval]);

	return <div ref={chartContainerRef} className="w-full h-full mt-[6%]" />;
};

export default StockWindowGraph;
