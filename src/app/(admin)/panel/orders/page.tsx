import { Client } from "@/components/panel/orders/list/Client";
import type { Column } from "@/components/panel/orders/list/Column";
import prisma from "@/lib/prismadb";
import { getType, priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function Ventas() {
	const orders = await prisma.order.findMany({
		include: {
			products: {
				include: {
					product: {
						select: {
							id: true,
							name: true,
							sellPrice: true,
							costPrice: true,
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
			},
			user: {
				select: {
					name: true,
					lastName: true
				}
			},
			provider: {
				select: {
					name: true
				}
			}
		},
		orderBy: {
			createdAt: "asc"
		}
	});

	const formattedOrders: Column[] = orders.map(order => {
		return {
			id: order.id.toString(),
			total: priceFormatter.format(order.total),
			status: order.status,
			userId: order.userId,
			user: `${order.user?.name} ${order.user?.lastName}`,
			provider: order.provider?.name,
			createdAt: format(order.createdAt, "dd MMMM yy HH:mm", {
				locale: es
			}),
			products: order.products.map(product => {
				const productTypeFormatted = getType(product.product.type, product.product.weightOrVolume);
				return {
					id: product.id.toString(),
					quantity: product.quantity,
					productId: product.product.id,
					productName: `${product.product.name} ${product.product.brand.name} ${productTypeFormatted} x${product.quantity}`,
					productSellPrice: priceFormatter.format(product.product.sellPrice),
					originalPrice: priceFormatter.format(product.product.costPrice)
				};
			})
		};
	});

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<Client orders={formattedOrders} />
			</div>
		</div>
	);
}
