import { auth } from "@/auth";
import { Client } from "@/components/panel/orders/list/Client";
import { Column } from "@/components/panel/orders/list/Column";
import OrderForm from "@/forms/order/OrderForm";
import ProductForm from "@/forms/product/ProductForm";
import prisma from "@/lib/prismadb";
import { getType, priceFormatter } from "@/lib/utils";
import type { Discount, Provider } from "@prisma/client";
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
			}
		})
		.catch(() => []);

	if (!order) {
		notFound();
	}

	const products = await prisma.product
		.findMany({
			include: {
				brand: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})
		.catch(() => []);
	const providers = await prisma.provider.findMany({}).catch(() => []);

	const productsByProvider = providers.map((provider: Provider) => {
		return {
			id: provider.id,
			name: provider.name,
			products: products.filter(product => product.providerId === provider.id)
		};
	});
	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				{/* @ts-ignore */}
				<OrderForm providers={productsByProvider} session={session} order={order} />
			</div>
		</div>
	);
}
