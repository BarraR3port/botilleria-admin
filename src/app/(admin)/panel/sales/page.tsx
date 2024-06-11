import { Client } from "@/components/panel/sales/list/Client";
import type { Column } from "@/components/panel/sales/list/Column";
import prisma from "@/lib/prismadb";
import { getType, priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function Sales() {
	const sales = await prisma.sale.findMany({
		include: {
			user: {
				select: {
					name: true,
					lastName: true,
					email: true
				}
			},
			products: {
				include: {
					product: {
						select: {
							id: true,
							name: true,
							sellPrice: true,
							type: true,
							weightOrVolume: true,
							brand: {
								select: {
									name: true
								}
							}
						}
					}
				}
			}
		},
		orderBy: {
			createdAt: "asc"
		}
	});

	const formattedSales: Column[] = sales.map(sale => {
		return {
			id: sale.id.toString(),
			type: sale.type,
			total: priceFormatter.format(sale.total),
			totalDiscount: priceFormatter.format(sale.totalDiscount),
			createdAt: format(sale.createdAt, "dd MMMM yy HH:mm", {
				locale: es
			}),
			userId: sale.userId,
			sellerName: `${sale.user.name} ${sale.user.lastName}`,
			sellerEmail: sale.user.email,
			products: sale.products.map(product => {
				const productTypeFormatted = getType(product.product.type, product.product.weightOrVolume);
				return {
					id: product.id.toString(),
					quantity: product.quantity,
					originalPrice: priceFormatter.format(product.originalPrice),
					appliedDiscount: priceFormatter.format(product.appliedDiscount ?? 0),
					productId: product.product.id,
					productName: `${product.product.name} ${product.product.brand.name} ${productTypeFormatted} x${product.quantity}`,
					productSellPrice: priceFormatter.format(product.product.sellPrice)
				};
			})
		};
	});

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4 ">
				<Client sales={formattedSales} />
			</div>
		</div>
	);
}
