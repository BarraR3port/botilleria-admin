import { auth } from "@/auth";
import PanelIndex from "@/components/panel";
import type { Column, ColumnRef } from "@/components/panel/sales/list/Column";
import { priceFormatter } from "@/lib/utils";
import { RedirectType, redirect } from "next/navigation";
import sales from "./sales/sales_data3.json";
import prisma from "@/lib/prismadb";

export default async function Panel() {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);

	const newSales: ColumnRef[] = sales as any;

	newSales.sort((a, b) => {
		return Number(a.id) - Number(b.id);
	});

	const formattedSales: Column[] = newSales.map(sale => {
		return {
			id: sale.id.toString(),
			total: sale.total,
			createdAt: sale.createdAt,
			userId: sale.userId,
			sellerName: `${sale.user.name} ${sale.user.lastName}`,
			sellerEmail: sale.user.email,
			products: sale.products.map(product => {
				return {
					id: product.id.toString(),
					quantity: product.quantity,
					originalPrice: priceFormatter.format(product.originalPrice),
					appliedDiscount: priceFormatter.format(product.appliedDiscount),
					productId: product.productId,
					productName: product.product.name,
					productSellPrice: priceFormatter.format(product.product.sellPrice)
				};
			})
		};
	});

	const products = await prisma.product.findMany({});

	return (
		<div className="flex-col overflow-auto ">
			<div className="flex-1 space-y-4 p-4">
				<PanelIndex session={session} sales={formattedSales} products={products} />
			</div>
		</div>
	);
}
