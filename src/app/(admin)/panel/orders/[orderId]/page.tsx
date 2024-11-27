import { auth } from "@/auth";
import { Column } from "@/components/panel/orders/list/Column";
import ProductInfo from "@/components/panel/products/product-info";
import OrderInfo from "@/forms/order/OrderInfo";
import prisma from "@/lib/prismadb";
import { getType, priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function Product({
	params
}: {
	params: {
		orderId: number | "create";
	};
}) {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);

	const order = await prisma.order
		.findUnique({
			where: {
				id: Number(params.orderId) || undefined
			},
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
				},
				provider: true
			}
		});

	if (!order && params.orderId === "create") {
		redirect("/panel/orders/create");
	}

	if (!order) {
		notFound();
	}
	const totalUserOrdersThisMonth = await prisma.order.count({
		where: {
			userId: order.userId,
			createdAt: {
				gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
				lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
			}
		}
	});

	const formattedOrder: Column = {
		id: order.id.toString(),
		status: order.status,
		total: priceFormatter.format(order.total),
		createdAt: format(order.createdAt, "dd MMMM yy HH:mm", {
			locale: es
		}),
		user: `${order.user.name} ${order.user.lastName}`,
		userId: order.userId,
		totalUserSales: totalUserOrdersThisMonth,
		sellerEmail: order.user.email,
		provider: order.provider,
		products: order.products.map(product => {
			const productTypeFormatted = getType(product.product.type, product.product.weightOrVolume);
			return {
				id: product.id.toString(),
				quantity: product.quantity,
				originalPrice: priceFormatter.format(product.priceWithoutVAT),
				productId: product.product.id,
				productName: `${product.product.name} (${product.product.brand.name}) ${productTypeFormatted} x${product.quantity}`,
				productSellPrice: priceFormatter.format(product.priceWithVAT)
			};
		})
	};

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<OrderInfo order={formattedOrder as any} session={session} />
			</div>
		</div>
	);
}
