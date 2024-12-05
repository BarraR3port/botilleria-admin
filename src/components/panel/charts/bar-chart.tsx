import { ResponsiveBar } from "@nivo/bar";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

interface Sale {
	createdAt: string;
}

interface Props {
	sales: Sale[];
}

const BarChart: React.FC<Props> = ({ sales }) => {
	const [data, setData] = useState<{ name: string; count: number }[]>([]);

	useEffect(() => {
		const monthlySales = sales.slice(0, 2000).reduce(
			(acc, sale) => {
				try {
					// Intenta parsear la fecha usando el formato específico
					let date: Date;
					if (sale.createdAt.includes("GMT")) {
						// Si es una fecha en formato GMT
						date = new Date(sale.createdAt);
					} else {
						// Si es una fecha en formato "dd MMMM yy HH:mm"
						date = parse(sale.createdAt, "dd MMMM yy HH:mm", new Date(), {
							locale: es
						});
					}

					if (Number.isNaN(date.getTime())) {
						console.error("Fecha inválida:", sale.createdAt);
						return acc;
					}

					const month = format(date, "MMM", {
						locale: es
					});

					if (!acc[month]) {
						acc[month] = 0;
					}
					acc[month]++;
					return acc;
				} catch (error) {
					console.error("Error procesando fecha:", sale.createdAt, error);
					return acc;
				}
			},
			{} as Record<string, number>
		);

		const formattedData = Object.keys(monthlySales).map(month => ({
			name: month,
			count: monthlySales[month]
		}));

		setData(formattedData);
	}, [sales]);

	return (
		<div className="aspect-[9/4]">
			<ResponsiveBar
				data={data}
				keys={["count"]}
				indexBy="name"
				margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
				padding={0.3}
				colors={["#2563eb"]}
				axisBottom={{
					tickSize: 0,
					tickPadding: 16
				}}
				axisLeft={{
					tickSize: 0,
					tickValues: 4,
					tickPadding: 16
				}}
				gridYValues={4}
				theme={{
					background: "hsl(var(--background))",
					axis: {
						domain: {
							line: {
								stroke: "hsl(var(--border))"
							}
						},
						ticks: {
							line: {
								stroke: "hsl(var(--border))",
								strokeWidth: 1
							},
							text: {
								fill: "hsl(var(--foreground))"
							}
						}
					},
					grid: {
						line: {
							stroke: "hsl(var(--muted))"
						}
					},
					tooltip: {
						container: {
							background: "hsl(var(--background))",
							color: "hsl(var(--foreground))",
							borderRadius: "6px",
							fontSize: "12px"
						}
					}
				}}
				tooltipLabel={({ id }) => `${id}`}
				enableLabel={false}
				role="application"
				ariaLabel="A bar chart showing data"
			/>
		</div>
	);
};

export default BarChart;
