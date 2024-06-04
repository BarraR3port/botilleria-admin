import { Client } from "@/components/panel/products/list/Client";
import type { Column } from "@/components/panel/products/list/Column";
import prisma from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function Ventas() {
	const products = await prisma.product.findMany({
		include: {
			discounts: true,
			brand: {
				select: {
					name: true
				}
			}
		},
		orderBy: {
			createdAt: "desc"
		}
	});

	const formattedProducts: Column[] = products.map(product => {
		return {
			id: product.id,
			name: product.name,
			price: priceFormatter.format(product.sellPrice),
			available: product.available,
			brandName: product.brand.name,
			stock: product.stock,
			weightOrVolume: product.weightOrVolume.toString(),
			createdAt: format(product.createdAt, "dd-MMMM-yy HH:mm", {
				locale: es
			})
		};
	});
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-5 pt-6">
				<Client products={formattedProducts} />
			</div>
		</div>
	);
}
