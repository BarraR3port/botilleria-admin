import { Client } from "@/components/panel/sales/list/Client";
import type { Column, ColumnRef } from "@/components/panel/sales/list/Column";
import prisma from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import sales from "./sales_data3.json";

export default async function Sales() {
	/* const sales = await prisma.sale.findMany({
		include: {},
		orderBy: {
			createdAt: "desc"
		}
	});
 */
	const newSales: ColumnRef[] = sales as any;

	// order the newSales array by id

	newSales.sort((a, b) => {
		return Number(a.id) - Number(b.id);
	});

	const formattedSales: Column[] = newSales.map(sale => {
		return {
			id: sale.id.toString(),
			total: priceFormatter.format(sale.total),
			createdAt: format(sale.createdAt, "dd MMMM yy HH:mm", {
				locale: es
			}),
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

	//console.log(JSON.stringify(sales[0], null, 4));

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4 ">
				<Client sales={formattedSales} />
			</div>
		</div>
	);
}
