import { Client } from "@/components/panel/products/list/Client";
import type { Column } from "@/components/panel/products/list/Column";
import prisma from "@/lib/prismadb";
import { getType, priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function Ventas() {
	const products = await prisma.product.findMany({
		include: {
			discount: true,
			brand: {
				select: {
					name: true
				}
			}
		},
		orderBy: {
			createdAt: "asc"
		}
	});

	const formattedProducts: Column[] = products.map(product => {
		return {
			id: product.id.toString(),
			name: product.name,
			price: priceFormatter.format(product.sellPrice),
			available: product.available ? "Si" : "No",
			brandName: product.brand.name,
			barcode: product.barcode,
			stock: product.stock,
			weightOrVolume: getType(product.type, product.weightOrVolume) || "",
			createdAt: format(product.createdAt, "dd MMMM yy HH:mm", {
				locale: es
			})
		};
	});

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<Client products={formattedProducts} />
			</div>
		</div>
	);
}
