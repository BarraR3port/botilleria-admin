import { auth } from "@/auth";
import ProductForm from "@/forms/product/ProductForm";
import SaleForm from "@/forms/sale/SaleForm";
import prisma from "@/lib/prismadb";
import { notFound, redirect, RedirectType } from "next/navigation";
import sales from "../sales_data3.json";
import type { Column, ColumnRef } from "@/components/panel/sales/list/Column";
import { priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function Product({
	params
}: {
	params: {
		saleId: number | "new";
	};
}) {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);
	const newSales: ColumnRef[] = JSON.parse(JSON.stringify(sales));

	/* const sale = await prisma.sale
		.findUnique({
			where: {
				id: Number(params.saleId) || undefined
			},
			include: {
				products: {
					include: {
						product: true
					}
				}
			}
		})
		.catch(() => null); */

	const sale = newSales[Number(params.saleId)];

	if (!sale) {
		notFound();
	}

	const formattedSales: Column = {
		id: sale.id,
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

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<SaleForm sale={formattedSales} session={session} />
			</div>
		</div>
	);
}
