import { auth } from "@/auth";
import type { Column } from "@/components/panel/sales/list/Column";
import SaleForm from "@/forms/sale/SaleForm";
import prisma from "@/lib/prismadb";
import { getType, priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function Product({
	params
}: {
	params: {
		saleId: number | "new";
	};
}) {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);

	const sale = await prisma.sale.findUnique({
		where: {
			id: Number(params.saleId)
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
			}
		}
	});

	if (!sale) {
		notFound();
	}

	const totalUserSalesThisMonth = await prisma.sale.count({
		where: {
			userId: sale.userId,
			createdAt: {
				gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
				lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
			}
		}
	});

	const formattedSales: Column = {
		id: sale.id.toString(),
		type: sale.type,
		total: priceFormatter.format(sale.total),
		originalTotal: priceFormatter.format(sale.products.reduce((acc, product) => acc + product.originalPrice, 0)),
		totalDiscount: priceFormatter.format(sale.totalDiscount),
		createdAt: format(sale.createdAt, "dd MMMM yy HH:mm", {
			locale: es
		}),
		userId: sale.userId,
		totalUserSales: totalUserSalesThisMonth,
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
				productSellPrice: priceFormatter.format(product.finalPrice)
			};
		})
	};

	return (
		<div className="flex-col overflow-auto ">
			<div className="flex-1 space-y-4 p-4">
				<SaleForm sale={formattedSales} session={session} />
			</div>
		</div>
	);
}
