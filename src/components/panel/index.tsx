"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { Box, Crown, DollarSignIcon, PanelTopIcon, ShoppingCartIcon, UserIcon, UsersIcon } from "lucide-react";
import type { Session } from "next-auth";
import { useMemo, type ClassAttributes, type HTMLAttributes, type JSX } from "react";
import type { Column as SaleType } from "@/components/panel/sales/list/Column";
import { priceFormatter } from "@/lib/utils";
import BarChart from "./charts/bar-chart";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
	session: Session;
	sales: SaleType[];
	products: Product[];
}

export default function PanelIndex({ session, sales, products }: Props) {
	const router = useRouter();
	/* const percentageMoreThanLastMonth = useMemo(() => {
		const orderedSales = sales.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
		const lastMonthSales = orderedSales.slice(-30);
		const currentMonthSales = orderedSales.slice(-60, -30);
		const lastMonthTotal = lastMonthSales.reduce((acc, sale) => acc + Number(sale.total), 0);
		const currentMonthTotal = currentMonthSales.reduce((acc, sale) => acc + Number(sale.total), 0);
		const percentage = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
		return Number(percentage.toFixed(1));
	}, [sales]); */

	const totalRevenue = useMemo(() => {
		const total = sales.reduce((acc, sale) => acc + Number(sale.total), 0);
		return priceFormatter.format(total);
	}, [sales]);
	/* 
	const percentageMoreRevenueFromLastMonth = useMemo(() => {
		const orderedSales = sales.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
		const lastMonthSales = orderedSales.slice(-30);
		const currentMonthSales = orderedSales.slice(-60, -30);
		const lastMonthTotal = lastMonthSales.reduce((acc, sale) => acc + Number(sale.total), 0);
		const currentMonthTotal = currentMonthSales.reduce((acc, sale) => acc + Number(sale.total), 0);
		const percentage = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
		return Number(percentage.toFixed(1));
	}, [sales]); */

	const customers = useMemo(() => {
		const customers = sales.map(sale => {
			return {
				id: sale.userId,
				name: sale.sellerName,
				email: sale.sellerEmail,
				total: sale.total
			};
		});

		const mergedCustomers = customers.reduce(
			(
				acc: {
					id: string;
					name: string;
					email: string;
					total: number;
				}[],
				customer
			) => {
				const existingCustomer = acc.find(c => c.id === customer.id);
				if (existingCustomer !== undefined) {
					existingCustomer.total += Number(customer.total);
				} else {
					// @ts-ignore
					acc.push(customer);
				}
				return acc;
			},
			[]
		);

		return mergedCustomers;
	}, [sales]);

	const topTenCustomers = useMemo(() => {
		const sortedCustomers = customers.sort((a, b) => b.total - a.total);
		return sortedCustomers.slice(0, 6);
	}, [customers]);

	const totalProducts = useMemo(() => {
		const total = products.length;
		return total;
	}, [products]);

	return (
		<div className="flex-col overflow-auto ">
			<div className="flex-1 space-y-4 p-4">
				<div className="sticky top-0 bg-background z-10 space-y-2">
					<div className="flex items-center justify-between">
						<Heading
							title={
								<div className="">
									<h2 className="text-2xl font-bold">¡Bienvenido de vuelta, {session.user.name}!</h2>
									<p className="text-gray-500 dark:text-gray-400">
										Aquí tienes un resumen de tu panel de administración
									</p>
								</div>
							}
						/>
					</div>
					<Separator className="pt-2" />
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					<Card
						className="cursor-pointer rounded-lg border  p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md"
						onClick={() => {
							router.push("/panel/sales");
						}}
					>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">Ventas totales</CardTitle>
							<ShoppingCartIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{sales.length}</div>
							{/* <p className="text-xs text-gray-500 dark:text-gray-400">
								+{percentageMoreThanLastMonth}% desde el mes pasado
							</p> */}
						</CardContent>
					</Card>
					<Card
						className="cursor-pointer rounded-lg border  p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md "
						onClick={() => {
							router.push("/panel/sales");
						}}
					>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
							<DollarSignIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalRevenue}</div>
							{/* <p className="text-xs text-gray-500 dark:text-gray-400">
								+{percentageMoreRevenueFromLastMonth}% desde el mes pasado
							</p> */}
						</CardContent>
					</Card>
					<Card
						className="cursor-pointer rounded-lg border  p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md "
						onClick={() => {
							router.push("/panel/products");
						}}
					>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">Productos</CardTitle>
							<Box className="w-4 h-4 text-gray-500 dark:text-gray-400" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalProducts}</div>
						</CardContent>
					</Card>
					<Card
						className="cursor-pointer rounded-lg border  p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md "
						onClick={() => {
							router.push("/panel/users");
						}}
					>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">Vendedores</CardTitle>
							<UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{customers.length}</div>
						</CardContent>
					</Card>
				</div>
				<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="flex flex-col gap-6">
						<Card className="cursor-pointer rounded-lg border  p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md ">
							<CardHeader>
								<CardTitle>Actividad de Ventas</CardTitle>
							</CardHeader>
							<CardContent>
								<BarChart sales={sales} />
							</CardContent>
						</Card>
					</div>
					<div className="flex flex-col gap-6">
						<Card className="cursor-pointer rounded-lg border  p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md ">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">Top Vendedores</CardTitle>
								<Crown className="w-4 h-4 text-warning " />
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									{topTenCustomers.map(customer => (
										<div key={customer.id} className="flex items-center gap-4">
											<div>
												<Link
													href={`/panel/users/${customer.id}`}
													className="hover:text-blue-500 flex items-center"
												>
													<UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
													<h4 className="font-medium">{customer.name}</h4>
												</Link>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													{priceFormatter.format(customer.total)} en total
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
