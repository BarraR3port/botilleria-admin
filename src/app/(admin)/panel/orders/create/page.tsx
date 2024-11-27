import { auth } from "@/auth";
import OrderForm from "@/forms/order/OrderForm";
import prisma from "@/lib/prismadb";
import { getType } from "@/lib/utils";
import type { Brand, Discount, Provider } from "@prisma/client";
import { RedirectType, redirect } from "next/navigation";

export default async function Product() {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);

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
	const productsFormatted = products.map(product => {
		const productTypeFormatted = getType(product.type, product.weightOrVolume);
		return {
			...product,
			name: `${product.name} ${productTypeFormatted}`
		};
	});

	const productsByProvider = providers.map((provider: Provider) => {
		return {
			id: provider.id,
			name: provider.name,
			products: productsFormatted.filter(product => product.providerId === provider.id)
		};
	});

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				{/* @ts-ignore */}
				<OrderForm providers={productsByProvider} session={session} />
			</div>
		</div>
	);
}
