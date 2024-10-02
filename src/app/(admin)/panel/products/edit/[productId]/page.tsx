import { auth } from "@/auth";
import ProductForm from "@/forms/product/ProductForm";
import prisma from "@/lib/prismadb";
import type { Discount } from "@prisma/client";
import { RedirectType, notFound, redirect } from "next/navigation";

export default async function Product({
	params
}: {
	params: {
		productId: number | "create";
	};
}) {
	const session = await auth();

	if (!session) redirect("/signIn", RedirectType.replace);

	const product = await prisma.product
		.findUnique({
			where: {
				id: Number(params.productId) || undefined
			},
			include: {
				discount: true,
				brand: {
					select: {
						name: true
					}
				}
			}
		})
		.catch(() => null);

	if (!product && params.productId !== "create") {
		notFound();
	}

	const brands = await prisma.brand.findMany({}).catch(() => []);

	const discounts = await prisma.discount
		.findMany({
			where: {
				active: true
			}
		})
		.catch(() => []);

	const discountsWithEmpty: Discount[] = [
		{
			id: -1,
			name: "Sin descuento"
		} as any,
		...discounts
	];
	const providers = await prisma.provider.findMany({}).catch(() => []);

	return (
		<div className="flex-col overflow-auto">
			<div className="flex-1 space-y-4 p-4">
				<ProductForm
					product={product}
					brands={brands}
					providers={providers}
					discounts={discountsWithEmpty}
					types={PRODUCT_TYPES}
					session={session}
				/>
			</div>
		</div>
	);
}

const PRODUCT_TYPES = [
	{
		value: "FOOD",
		label: "Comida"
	},
	{
		value: "DRINK",
		label: "Bebida"
	},
	{
		value: "OTHER",
		label: "Otro"
	}
];
